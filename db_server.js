var express = require('express');
var sqlite3 = require('sqlite3');
var assert = require('assert');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var squel = require("squel");
var execFile = require('child_process').execFile;
var fs = require('fs');
var readline = require('readline');
var util = require('util');
var auth = require('express-basic-auth');
var bcrypt = require('bcryptjs');
var https = require('https');
var moment = require('moment');

// TODO error handling

// setup express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// determines if username and password are correct
function authorizer(username, password, cb) {
  if (username != 'spt')
    return cb(null, false);
  // get hash
  filePath = __dirname + '/hash';
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err, hash){
    if (!err) {
      // check password vs hash
      bcrypt.compare(password, hash.trim(), function(err, res) {
        return cb(null, res);
      });
    } else {
      log(err);
    }
  });
}

// response if wrong credentials
function getUnauthorizedResponse(req) {
  return 'Credentials rejected';
}

// password protect the website
app.use(auth({
  authorizer: authorizer,
  authorizeAsync: true,
  challenge: true,
  unauthorizedResponse: getUnauthorizedResponse,
}))

// setup home page
app.use(express.static('public'));
app.get('/index.html', function (req, res) {
  res.sendFile( __dirname + "/" + "index.html" );
})
app.get('/', function (req, res) {
  res.sendFile( __dirname + "/" + "index.html" );
})

// handlebars for templating
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// open the database (use amundsen path if it exists, otherwise use this dir)
var t_db_path = '/spt/data/transfer_database/transfer.db';
var a_db_path = '/spt/data/transfer_database/aux_transfer.db';
if (!fs.existsSync(t_db_path))
  t_db_path = './transfer.db';
t_db = new sqlite3.Database(t_db_path);
if (!fs.existsSync(a_db_path))
  a_db_path = './aux_transfer.db';
a_db = new sqlite3.Database(a_db_path);

// needed to load js and css files
app.use('/js',express.static(__dirname + '/js'));
app.use('/css',express.static(__dirname + '/css'));

// create directory in /tmp to store plots
// TODO: don't cache every plot. Remove old plots from time to time
// NOTE: not a high priority because right now ~1.2TB free in /tmp
var plot_dir = '/tmp/spt_dq/';
if (!fs.existsSync(plot_dir)){
      fs.mkdirSync(plot_dir);
}
app.use('/img', express.static(plot_dir));

// logs messages along with a timestamp. keeps writesteam open
var ws = fs.createWriteStream('./db.log', {'flags': 'a'});
ws.on('error', function (err) {
  console.error('Error logging message');
  console.error(err);
});
function log(msg) {
    var d = new Date();
    ws.write(d.toLocaleString() + '\t' + msg + '\n');
}


// for database requests
app.get('/tpage', function(req, res) {
  // get all data from the database
  query = squel.select()
                .from('transfer');
  parseSearch(query, req.query, 'transfer');
  t_db.all(query.toString(), function(err, rows) {
    res.send(rows);
  });

});

app.get('/apage', function(req, res) {
  // get all data from the database
  query = squel.select()
                .from('aux_transfer');
  parseSearch(query, req.query, 'aux');
  a_db.all(query.toString(), function(err, rows) {
    res.send(rows);
  });
});

// page for displaying plots/data
app.get('/display.html', function(req, res) {
  res.sendFile( __dirname + "/" + "display.html" );
});

// used to make plotting requests. User requests a specific plot(s) and
// the server executes a plotting script that saves the plot in the img
// directory. The request times out after 20s in case of a bad script or
// the server is being slow.
app.get('/data_req', function (req, res) {
  options = {'timeout':20000};
  obs = req.query['observation'];
  source = req.query['source'];
  plot_type = req.query['plot_type'];
  func_val = req.query['func'];

  log(util.inspect(req.query));
  // execute python plotting script. Safe because user input
  // is passed as arguments to the python script and the python
  // script handles the arguments safely.
  var python = '/cvmfs/spt.opensciencegrid.org/py3-v1/RHEL_6_x86_64/bin/python';
  if (func_val == 'individual')
    var args = ['-B', './plot/_plot.py', func_val, source, obs].concat(
        plot_type.split(' '));
  else if (func_val == 'timeseries')
    var args = ['-B', './plot/_plot.py', func_val, source, plot_type].concat(
        obs.split(' '));
  var err = null;
  execFile(python, args, options, (error, stdout, stderr) => {
    if (error) {
      err = stdout;
      log('exec python error: ' + error.toString());
    }
    res.json(err);
  });
  return;
})

// get all available plot types, removing the driver file and .py
app.get('/plot_list', function(req, res) {
  if (req.query['type'] == '')
    req.query['type'] = 'any';
  var json = JSON.parse(fs.readFileSync('./plot/plot_config.json', 'utf8'));
  res.json(json[req.query['func']][req.query['type']]);
})

// turns search into a sql query
function parseSearch(query, searchJSON, tab) {
  if (tab == 'transfer') {
    if(searchJSON['source']) {
      query.where('source == \'' + searchJSON['source'] + '\'');
    }

    // user could specify min obs, max obs or both
    if(searchJSON['observation']['min'] && searchJSON['observation']['max']) {
      query.where('observation >= ' + searchJSON['observation']['min'])
          .where('observation <= ' + searchJSON['observation']['max']);
    }
    else if (searchJSON['observation']['min']) {
      query.where('observation >= ' + searchJSON['observation']['min']);
    }
    else if (searchJSON['observation']['max']) {
      query.where('observation <= ' + searchJSON['observation']['max']);
    }
  }

  // user could specify min date, max data, or both
  var min_time = searchJSON['date']['min'];
  var max_time = searchJSON['date']['max'];
  if(min_time && max_time) {
    query.where("date(date) BETWEEN date('" + min_time +
        "') AND date('" + max_time + "')");
  }
  else if (min_time) {
    // set max time to current date
    max_time = moment().format('YYYY-MM-DD'); 
    query.where("date(date) BETWEEN date('" + min_time +
        "') AND date('" + max_time + "')");
  }
  else if (max_time) {
    // set min time before any observations
    min_time = "2000-01-01";
    query.where("date(date) BETWEEN date('" + min_time +
        "') AND date('" + max_time + "')");
  }

  var sort = searchJSON['sort'];
  var sort_dir = searchJSON['sort_dir'];
  if (sort) {
    if (sort_dir == 'desc')
      query.order(sort, false);
    else
      query.order(sort, true);
  }
  else
    query.order('date', false);

  return query;
}

// https files
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// run server
log('Listening on port 3000');
https.createServer(options, app).listen(3000);
