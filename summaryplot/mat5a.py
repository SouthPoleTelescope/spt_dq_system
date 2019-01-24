from statistics import compute_median
from functools import reduce
import operator
import numpy as np
import matplotlib.pyplot as plt
from spt3g import core
from spt3g.std_processing import obsid_to_g3time
import datetime
import matplotlib.dates as mdates


def median_mat5a_fluxcal(frame, boloprops, selector_dict):
    if 'MAT5AFluxCalibration' not in frame.keys():
        return None
    return compute_median(frame, 'MAT5AFluxCalibration', boloprops, selector_dict)


def median_mat5a_intflux(frame, boloprops, selector_dict):
    if 'MAT5AIntegralFlux' not in frame.keys():
        return None
    return compute_median(frame, 'MAT5AIntegralFlux', boloprops, selector_dict)


def mat5a_sky_transmission(frame, boloprops, selector_dict):
    if 'MAT5ASkyTransmission' not in frame.keys():
        return None

    data_on_selection = {}

    for select_values, f_select_list in selector_dict.items():
        # prep the dictionary for output
        for keylist in [select_values[:j] for j in np.arange(len(select_values))+1]:
            try:
                reduce(operator.getitem, keylist, data_on_selection)
            except:
                reduce(operator.getitem, keylist[:-1], data_on_selection)[keylist[-1]] = {}

        # get data that satisfies the selection and compute median
        if str(select_values[-1]) in frame['MAT5ASkyTransmission'].keys():
            reduce(operator.getitem, select_values[:-1], data_on_selection)[select_values[-1]] = \
                frame['MAT5ASkyTransmission'][str(select_values[-1])]
        else:
            reduce(operator.getitem, select_values[:-1], data_on_selection)[select_values[-1]] = np.nan

    return data_on_selection


def plot_median_mat5a_fluxcal(data, wafers, outdir):
    for wafer in wafers:
        obsids = [obsid for obsid in data['MAT5A-pixelraster']]
        f = plt.figure(figsize=(8,6))

        is_empty = True
        for band in [90, 150, 220]:
            median_mat5a = np.array([data['MAT5A-pixelraster'][obsid]['MedianMAT5AFluxCalibration'][wafer][band]
                                     for obsid in obsids
                                     if 'MedianMAT5AFluxCalibration' in data['MAT5A-pixelraster'][obsid]])

            timestamps = [obsid_to_g3time(int(obsid)).time / core.G3Units.seconds \
                          for obsid in obsids
                          if 'MedianMAT5AFluxCalibration' in data['MAT5A-pixelraster'][obsid]]
            dts = np.array([datetime.datetime.fromtimestamp(ts) for ts in timestamps])
            datenums = mdates.date2num(dts)

            plt.plot(datenums[np.isfinite(median_mat5a)],
                     median_mat5a[np.isfinite(median_mat5a)],
                     'o', label='{} GHz'.format(band))

            if len(median_mat5a[np.isfinite(median_mat5a)])>0:
                is_empty = False

        if is_empty == False:
            xfmt = mdates.DateFormatter('%m-%d %H:%M')
            plt.gca().xaxis.set_major_formatter(xfmt)
            plt.xticks(rotation=25)
            plt.ylim([-100, 0])
            plt.legend()
        plt.xlabel('observation time')
        plt.ylabel('median MAT5A flux calibration')
        plt.title('MAT5A Flux Calibration ({})'.format(wafer))
        plt.tight_layout()
        plt.savefig('{}/median_mat5a_fluxcal_{}.png'.format(outdir, wafer))
        plt.close()

def plot_median_mat5a_intflux(data, wafers, outdir):
    for wafer in wafers:   
        obsids = [obsid for obsid in data['MAT5A-pixelraster']]
        f = plt.figure(figsize=(8,6))

        is_empty = True
        for band in [90, 150, 220]:
            median_mat5a = np.array([data['MAT5A-pixelraster'][obsid]['MedianMAT5AIntegralFlux'][wafer][band]
                                     for obsid in obsids 
                                     if 'MedianMAT5AIntegralFlux' in data['MAT5A-pixelraster'][obsid]])

            timestamps = [obsid_to_g3time(int(obsid)).time / core.G3Units.seconds \
                          for obsid in obsids
                          if 'MedianMAT5AIntegralFlux' in data['MAT5A-pixelraster'][obsid]]
            dts = np.array([datetime.datetime.fromtimestamp(ts) for ts in timestamps])
            datenums = mdates.date2num(dts)

            plt.plot(datenums[np.isfinite(median_mat5a)],
                     median_mat5a[np.isfinite(median_mat5a)],
                     'o', label='{} GHz'.format(band))

            if len(median_mat5a[np.isfinite(median_mat5a)])>0:
                is_empty = False

        if is_empty == False:
            xfmt = mdates.DateFormatter('%m-%d %H:%M')
            plt.gca().xaxis.set_major_formatter(xfmt)
            plt.xticks(rotation=25)
            plt.ylim([2e-7, 7e-7])
            plt.legend()
        plt.xlabel('observation time')
        plt.ylabel('median MAT5A integral flux')
        plt.title('MAT5A Integral Flux ({})'.format(wafer))
        plt.tight_layout()
        plt.savefig('{}/median_mat5a_intflux_{}.png'.format(outdir, wafer))
        plt.close()

def plot_mat5a_sky_transmission(data, wafers, outdir):
    for wafer in wafers:   
        obsids = [obsid for obsid in data['MAT5A']]
        f = plt.figure(figsize=(8,6))

        is_empty = True
        for band in [90, 150, 220]:
            mat5a_skytrans = np.array([data['MAT5A'][obsid]['MAT5ASkyTransmission'][wafer][band]
                                       for obsid in obsids
                                       if 'MAT5ASkyTransmission' in data['MAT5A'][obsid]])
            timestamps = [obsid_to_g3time(int(obsid)).time / core.G3Units.seconds
                          for obsid in obsids
                          if 'MAT5ASkyTransmission' in data['MAT5A'][obsid]]
            dts = np.array([datetime.datetime.fromtimestamp(ts) for ts in timestamps])
            datenums = mdates.date2num(dts)

            plt.plot(datenums[np.isfinite(mat5a_skytrans)],
                     mat5a_skytrans[np.isfinite(mat5a_skytrans)],
                     'o', label='{} GHz'.format(band))

            if len(mat5a_skytrans[np.isfinite(mat5a_skytrans)])>0:
                is_empty = False

        if is_empty == False:
            xfmt = mdates.DateFormatter('%m-%d %H:%M')
            plt.gca().xaxis.set_major_formatter(xfmt)
            plt.xticks(rotation=25)
            plt.ylim([0.85, 1.25])
            plt.legend()
        plt.xlabel('observation time')
        plt.ylabel('MAT5A sky transmission')
        plt.title('MAT5A Sky Transmission ({})'.format(wafer))
        plt.tight_layout()
        plt.savefig('{}/mat5a_sky_transmission_{}.png'.format(outdir, wafer))
        plt.close()