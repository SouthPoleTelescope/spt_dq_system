// Check if there are cookies already defined for the wafer and time interval,
// and use them if available.
if(Cookies.get('wafer') !== undefined)
	var wafer = Cookies.get('wafer', {expires: 1});
else
	var wafer='all';

if(Cookies.get('weekdir') !== undefined) {
	var weekdir = Cookies.get('weekdir', {expires: 1});
    var mapweekdir = Cookies.get('mapweekdir', {expires: 1});
}
else {
	var weekdir='plots/last_n/last_3/';
    var mapweekdir='maps/figures/last_n/last_30/';
}


/**
 * Updates the source of all images defined on the summary page.
 */
function update_figs()
{
  document["ts_median_cal_sn_highel"].src         ='staticimg/'+weekdir+'/median_cal_sn_4Hz_highel_'+wafer+'.png';
  document["ts_median_cal_response_highel"].src   ='staticimg/'+weekdir+'/median_cal_response_4Hz_highel_'+wafer+'.png';
  document["ts_alive_bolos_cal_highel"].src       ='staticimg/'+weekdir+'/alive_bolos_cal_4Hz_highel_'+wafer+'.png';

  document["ts_median_cal_sn_lowel"].src          ='staticimg/'+weekdir+'/median_cal_sn_4Hz_lowel_'+wafer+'.png';
  document["ts_median_cal_response_lowel"].src    ='staticimg/'+weekdir+'/median_cal_response_4Hz_lowel_'+wafer+'.png';
  document["ts_alive_bolos_cal_lowel"].src        ='staticimg/'+weekdir+'/alive_bolos_cal_4Hz_lowel_'+wafer+'.png';

  document["ts_median_elnod_sn"].src              ='staticimg/'+weekdir+'/median_elnod_sn_'+wafer+'.png';
  document["ts_median_elnod_iq"].src              ='staticimg/'+weekdir+'/median_elnod_iq_phase_'+wafer+'.png';
  document["ts_alive_bolos_elnod"].src            ='staticimg/'+weekdir+'/alive_bolos_elnod_'+wafer+'.png';

  document["ts_rcw38_sky_transmission"].src       ='staticimg/'+weekdir+'/rcw38_sky_transmission_'+wafer+'.png';

  document["ts_median_rcw38_fluxcal"].src         ='staticimg/'+weekdir+'/median_rcw38_fluxcal_'+wafer+'.png';
  document["ts_median_rcw38_intflux"].src         ='staticimg/'+weekdir+'/median_rcw38_intflux_'+wafer+'.png';
  document["ts_alive_bolos_rcw38"].src            ='staticimg/'+weekdir+'/alive_bolos_rcw38_'+wafer+'.png';

  document["ts_mat5a_sky_transmission"].src       ='staticimg/'+weekdir+'/mat5a_sky_transmission_'+wafer+'.png';

  document["ts_median_mat5a_fluxcal"].src         ='staticimg/'+weekdir+'/median_mat5a_fluxcal_'+wafer+'.png';
  document["ts_median_mat5a_intflux"].src         ='staticimg/'+weekdir+'/median_mat5a_intflux_'+wafer+'.png';
  document["ts_alive_bolos_mat5a"].src            ='staticimg/'+weekdir+'/alive_bolos_mat5a_'+wafer+'.png';

  document["ts_median_net_01Hz_to_05Hz"].src      ='staticimg/'+weekdir+'/median_NET_0.1Hz_to_0.5Hz_'+wafer+'.png';
  document["ts_median_net_1Hz_to_2Hz"].src        ='staticimg/'+weekdir+'/median_NET_1.0Hz_to_2.0Hz_'+wafer+'.png';
  document["ts_median_net_3Hz_to_5Hz"].src        ='staticimg/'+weekdir+'/median_NET_3.0Hz_to_5.0Hz_'+wafer+'.png';
  document["ts_median_net_10Hz_to_15Hz"].src      ='staticimg/'+weekdir+'/median_NET_10.0Hz_to_15.0Hz_'+wafer+'.png';

  document["ts_median_nep_01Hz_to_05Hz"].src      ='staticimg/'+weekdir+'/median_NEP_0.1Hz_to_0.5Hz_'+wafer+'.png';
  document["ts_median_nep_1Hz_to_2Hz"].src        ='staticimg/'+weekdir+'/median_NEP_1.0Hz_to_2.0Hz_'+wafer+'.png';
  document["ts_median_nep_3Hz_to_5Hz"].src        ='staticimg/'+weekdir+'/median_NEP_3.0Hz_to_5.0Hz_'+wafer+'.png';
  document["ts_median_nep_10Hz_to_15Hz"].src      ='staticimg/'+weekdir+'/median_NEP_10.0Hz_to_15.0Hz_'+wafer+'.png';

  document["ts_median_nei_01Hz_to_05Hz"].src      ='staticimg/'+weekdir+'/median_NEI_0.1Hz_to_0.5Hz_'+wafer+'.png';
  document["ts_median_nei_1Hz_to_2Hz"].src        ='staticimg/'+weekdir+'/median_NEI_1.0Hz_to_2.0Hz_'+wafer+'.png';
  document["ts_median_nei_3Hz_to_5Hz"].src        ='staticimg/'+weekdir+'/median_NEI_3.0Hz_to_5.0Hz_'+wafer+'.png';
  document["ts_median_nei_10Hz_to_15Hz"].src      ='staticimg/'+weekdir+'/median_NEI_10.0Hz_to_15.0Hz_'+wafer+'.png';

  document["map_t_90"].src                        ='staticimg/'+mapweekdir+'/90GHz-T_map.png'
  document["map_t_150"].src                       ='staticimg/'+mapweekdir+'/150GHz-T_map.png'
  document["map_t_220"].src                       ='staticimg/'+mapweekdir+'/220GHz-T_map.png'
  
  document["map_noise_t_90"].src                  ='staticimg/'+mapweekdir+'/90GHz-T_map_noise_levels_from_individual_maps.png'
  document["map_noise_t_150"].src                 ='staticimg/'+mapweekdir+'/150GHz-T_map_noise_levels_from_individual_maps.png'
  document["map_noise_t_220"].src                 ='staticimg/'+mapweekdir+'/220GHz-T_map_noise_levels_from_individual_maps.png'
  
  document["map_delta_ras_t_90"].src              ='staticimg/'+mapweekdir+'/90GHz-T_map_delta_Ras_from_point_sources.png'
  document["map_delta_ras_t_150"].src             ='staticimg/'+mapweekdir+'/150GHz-T_map_delta_Ras_from_point_sources.png'
  document["map_delta_ras_t_220"].src             ='staticimg/'+mapweekdir+'/220GHz-T_map_delta_Ras_from_point_sources.png'
  
  document["map_delta_decs_t_90"].src             ='staticimg/'+mapweekdir+'/90GHz-T_map_delta_Decs_from_point_sources.png'
  document["map_delta_decs_t_150"].src            ='staticimg/'+mapweekdir+'/150GHz-T_map_delta_Decs_from_point_sources.png'
  document["map_delta_decs_t_220"].src            ='staticimg/'+mapweekdir+'/220GHz-T_map_delta_Decs_from_point_sources.png'

  document["flagging_90"].src                     ='staticimg/'+mapweekdir+'/90GHz-T_map_average_numbers_of_flagged_detectors.png'
  document["flagging_150"].src                    ='staticimg/'+mapweekdir+'/150GHz-T_map_average_numbers_of_flagged_detectors.png'
  document["flagging_220"].src                    ='staticimg/'+mapweekdir+'/220GHz-T_map_average_numbers_of_flagged_detectors.png'

  document["weight_xsection_90"].src              ='staticimg/'+mapweekdir+'/90GHz-TT_weight_map_cross_sectional_view.png'
  document["weight_xsection_150"].src             ='staticimg/'+mapweekdir+'/150GHz-TT_weight_map_cross_sectional_view.png'
  document["weight_xsection_220"].src             ='staticimg/'+mapweekdir+'/220GHz-TT_weight_map_cross_sectional_view.png'

  document["running_noise_90"].src                ='staticimg/'+mapweekdir+'/90GHz-T_map_noise_levels_from_running_coadds.png'
  document["running_noise_150"].src               ='staticimg/'+mapweekdir+'/150GHz-T_map_noise_levels_from_running_coadds.png'
  document["running_noise_220"].src               ='staticimg/'+mapweekdir+'/220GHz-T_map_noise_levels_from_running_coadds.png'
}

/**
 * Sets a global variable to records its value as a cookie for retrieval later.
 */
function set_variable(variable, newVal)
{
  window[variable] = newVal;
  Cookies.set(variable, newVal, { expires: 1 });
  update_figs();
}

/**
 * Builds the buttons on the summary page that select different time intervals
 * of data to display. These are constructed by appending the DOM directly.
 * Note also that this function also initializes the jQuery UI "controlgroup"
 * and binds the click event to it after appending all the buttons.
 * 
 * Arguments:
 *  interval : time interval to traverse, 'weekly' or 'monthly'
 *  subdirectory : subdirectory that we should traverse to get dated data
 *  tab : tab in which to add buttons, 'summary' or 'maps'
 */
function add_date_buttons(interval, subdirectory, tab)
{
    // now rebuild the div
	$.get('/staticdirs', {subdirectory:subdirectory, interval:interval},
		  function(data, status) {
			  div_id = '#datalist_'+interval+'_'+tab
			  
			  data.reverse();
			  for (jdir=0; jdir<data.length; jdir++)
			  {
				  if (tab === 'summary')
					  datestring = data[jdir].split('/')[2];
				  else if (tab == 'maps')
					  datestring = data[jdir].split('/')[3];

				  $(div_id).append("<input type='radio' id='dates-"+datestring+"' name='dates' value='" +
								   data[jdir] + "'>\n" + 
								   "<label for='dates-"+datestring+"'>"+datestring+"</label>");
			  }
			  $(div_id).controlgroup();
			  $("[id^=dates-]").click(function(event) {
				  set_variable("weekdir", event.target.value);
			  });
		  });
}

// Page initialization
$( document ).ready(function()
{
	// Initialize jQuery UI elements and make dynamic modifications to the DOM
	$("#tabs").tabs();
	$("#waferlist").controlgroup();
	add_date_buttons();
	
	// Bind the click event to the wafer buttons
	$("[id^=wafers-]").click(function(event) {
		set_variable("wafer", event.target.value);
	});

	// Update all the figures. Need to call this on load because the values of
	// wafer and weekdir might be pulled from a cookie, which probably differs
	// from the default values.
	update_figs();
});
