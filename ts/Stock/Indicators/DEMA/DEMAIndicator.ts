/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    DEMAOptions,
    DEMAParamsOptions
} from './DEMAOptions';
import type DEMAPoint from './DEMAPoint';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        ema: EMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    correctFloat,
    isArray,
    merge
} = U;

/**
 * The DEMA series Type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dema
 *
 * @augments Highcharts.Series
 */
class DEMAIndicator extends EMAIndicator {
    /**
     * Double exponential moving average (DEMA) indicator. This series requires
     * `linkedTo` option to be set and should be loaded after the
     * `stock/indicators/indicators.js`.
     *
     * @sample {highstock} stock/indicators/dema
     *         DEMA indicator
     *
     * @extends      plotOptions.ema
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/dema
     * @optionparent plotOptions.dema
     */
    public static defaultOptions: DEMAOptions = merge(EMAIndicator.defaultOptions);

    public EMApercent: number = void 0 as any;
    public data: Array<DEMAPoint> = void 0 as any;
    public options: DEMAOptions = void 0 as any;
    public points: Array<DEMAPoint> = void 0 as any;

    public getEMA(
        yVal: (Array<number>|Array<Array<number>>),
        prevEMA: (number|undefined),
        SMA: number,
        index?: number,
        i?: number,
        xVal?: Array<number>
    ): [number, number] {

        return EMAIndicator.prototype.calculateEma(
            xVal || [],
            yVal,
            typeof i === 'undefined' ? 1 : i,
            this.EMApercent,
            prevEMA,
            typeof index === 'undefined' ? -1 : index,
            SMA
        );
    }

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: DEMAParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        let period: number = (params.period as any),
            doubledPeriod: number = 2 * period,
            xVal: Array<number> = (series.xData as any),
            yVal: Array<Array<number>> = (series.yData as any),
            yValLen: number = yVal ? yVal.length : 0,
            index = -1,
            accumulatePeriodPoints = 0,
            SMA = 0,
            DEMA: Array<Array<number>> = [],
            xDataDema: Array<number> = [],
            yDataDema: Array<number> = [],
            EMA = 0,
            // EMA(EMA)
            EMAlevel2: number,
            // EMA of previous point
            prevEMA: (number|undefined),
            prevEMAlevel2: (number|undefined),
            // EMA values array
            EMAvalues: Array<number> = [],
            i: number,
            DEMAPoint: [number, number];

        this.EMApercent = (2 / (period + 1));

        // Check period, if bigger than EMA points length, skip
        if (yValLen < 2 * period - 1) {
            return;
        }

        // Switch index for OHLC / Candlestick / Arearange
        if (isArray(yVal[0])) {
            index = params.index ? params.index : 0;
        }

        // Accumulate first N-points
        accumulatePeriodPoints =
            EMAIndicator.prototype.accumulatePeriodPoints(
                period,
                index,
                yVal
            );

        // first point
        SMA = accumulatePeriodPoints / period;
        accumulatePeriodPoints = 0;

        // Calculate value one-by-one for each period in visible data
        for (i = period; i < yValLen + 2; i++) {
            if (i < yValLen + 1) {
                EMA = this.getEMA(
                    yVal,
                    prevEMA,
                    SMA,
                    index,
                    i
                )[1];
                EMAvalues.push(EMA);
            }
            prevEMA = EMA;

            // Summing first period points for EMA(EMA)
            if (i < doubledPeriod) {
                accumulatePeriodPoints += EMA;
            } else {
                // Calculate DEMA
                // First DEMA point
                if (i === doubledPeriod) {
                    SMA = accumulatePeriodPoints / period;
                }
                EMA = EMAvalues[i - period - 1];
                EMAlevel2 = this.getEMA(
                    [EMA],
                    prevEMAlevel2,
                    SMA
                )[1];
                DEMAPoint = [
                    xVal[i - 2],
                    correctFloat(2 * EMA - EMAlevel2)
                ];
                DEMA.push(DEMAPoint);
                xDataDema.push(DEMAPoint[0]);
                yDataDema.push(DEMAPoint[1]);
                prevEMAlevel2 = EMAlevel2;
            }
        }

        return {
            values: DEMA,
            xData: xDataDema,
            yData: yDataDema
        } as IndicatorValuesObject<TLinkedSeries>;
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface DEMAIndicator {
    pointClass: typeof DEMAPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        dema: typeof DEMAIndicator;
    }
}
SeriesRegistry.registerSeriesType('dema', DEMAIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default DEMAIndicator;

/**
 * A `DEMA` series. If the [type](#series.dema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dema
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/dema
 * @apioption series.dema
 */

''; // adds doclet above to the transpiled file
