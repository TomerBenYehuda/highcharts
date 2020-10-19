/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type LineSeries from '../../Series/LineSeries.js';
import type {
    SeriesOptionsType,
    SeriesTypeRegistry
} from './Types';
import type Chart from '../Chart/Chart';
import H from '../Globals.js';
import O from '../Options.js';
const { defaultOptions } = O;
import Point from './Point.js';
import U from '../Utilities.js';
const {
    error,
    extendClass,
    fireEvent,
    getOptions,
    isObject,
    merge,
    objectEach
} = U;

/**
 * Internal namespace
 * @private
 * @todo remove
 */
declare global {
    namespace Highcharts {
        let seriesTypes: SeriesTypeRegistry;
        function seriesType<T extends typeof LineSeries>(
            type: keyof SeriesTypeRegistry,
            parent: (keyof SeriesTypeRegistry|undefined),
            options: T['prototype']['options'],
            props?: DeepPartial<T['prototype']>,
            pointProps?: DeepPartial<T['prototype']['pointClass']['prototype']>
        ): T;
    }
}

import '../Options.js';

/* eslint-disable valid-jsdoc */

namespace Series {

    /* *
     *
     *  Static Properties
     *
     * */

    export const seriesTypes = {} as SeriesTypeRegistry;

    /* *
     *
     *  Static Functions
     *
     * */

    /** @private */
    export function addSeries(
        seriesType: string,
        seriesClass: typeof LineSeries
    ): void {
        const defaultPlotOptions = getOptions().plotOptions || {},
            seriesOptions: Highcharts.SeriesOptions = (seriesClass as any).defaultOptions;

        if (!seriesClass.prototype.pointClass) {
            seriesClass.prototype.pointClass = Point;
        }

        seriesClass.prototype.type = seriesType;

        if (seriesOptions) {
            defaultPlotOptions[seriesType] = seriesOptions;
        }

        seriesTypes[seriesType] = seriesClass;
    }

    /** @private */
    export function cleanRecursively<T>(
        toClean: DeepRecord<string, T>,
        reference: DeepRecord<string, T>
    ): DeepRecord<string, T> {
        var clean: DeepRecord<string, T> = {};

        objectEach(toClean, function (
            _val: (T|DeepRecord<string, T>),
            key: (number|string)
        ): void {
            var ob;

            // Dive into objects (except DOM nodes)
            if (
                isObject(toClean[key], true) &&
                !toClean.nodeType && // #10044
                reference[key]
            ) {
                ob = cleanRecursively<T>(
                    toClean[key] as DeepRecord<string, T>,
                    reference[key] as DeepRecord<string, T>
                );
                if (Object.keys(ob).length) {
                    clean[key] = ob;
                }

            // Arrays, primitives and DOM nodes are copied directly
            } else if (
                isObject(toClean[key]) ||
                toClean[key] !== reference[key]
            ) {
                clean[key] = toClean[key];
            }
        });

        return clean;
    }

    /**
     * Internal function to initialize an individual series.
     * @private
     */
    export function getSeries(
        chart: Chart,
        options: DeepPartial<SeriesOptionsType> = {}
    ): Highcharts.Series {
        const optionsChart = chart.options.chart as Highcharts.ChartOptions,
            type = (
                options.type ||
                optionsChart.type ||
                optionsChart.defaultSeriesType ||
                ''
            ),
            SeriesClass: typeof LineSeries = seriesTypes[type] as any;

        // No such series type
        if (!Series) {
            error(17, true, chart as any, { missingModuleFor: type });
        }

        const series = new SeriesClass();

        if (typeof series.init === 'function') {
            series.init(chart, options);
        }

        return series;
    }

    /**
     * Factory to create new series prototypes.
     *
     * @function Highcharts.seriesType
     *
     * @param {string} type
     * The series type name.
     *
     * @param {string} parent
     * The parent series type name. Use `line` to inherit from the basic
     * {@link Series} object.
     *
     * @param {Highcharts.SeriesOptionsType|Highcharts.Dictionary<*>} options
     * The additional default options that are merged with the parent's options.
     *
     * @param {Highcharts.Dictionary<*>} [props]
     * The properties (functions and primitives) to set on the new prototype.
     *
     * @param {Highcharts.Dictionary<*>} [pointProps]
     * Members for a series-specific extension of the {@link Point} prototype if
     * needed.
     *
     * @return {Highcharts.Series}
     * The newly created prototype as extended from {@link Series} or its
     * derivatives.
     */
    export function seriesType<T extends typeof Highcharts.Series>(
        type: keyof SeriesTypeRegistry,
        parent: (keyof SeriesTypeRegistry|undefined),
        options: T['prototype']['options'],
        seriesProto?: DeepPartial<T['prototype']>,
        pointProto?: DeepPartial<T['prototype']['pointClass']['prototype']>
    ): T {
        const defaultPlotOptions = getOptions().plotOptions || {};

        parent = parent || '';

        // Merge the options
        defaultPlotOptions[type] = merge(
            defaultPlotOptions[parent],
            options
        );

        // Create the class
        addSeries(type, extendClass(
            seriesTypes[parent] as any || function (): void {},
            seriesProto
        ) as any);
        seriesTypes[type].prototype.type = type;

        // Create the point class if needed
        if (pointProto) {
            seriesTypes[type].prototype.pointClass =
                extendClass(Point, pointProto);
        }

        return seriesTypes[type] as unknown as T;
    }

}

// backwards compatibility

H.seriesType = Series.seriesType;
H.seriesTypes = Series.seriesTypes;

/* *
 *
 *  Export
 *
 * */

export default Series;
