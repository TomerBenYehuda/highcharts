/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type LinePointOptions from './LinePointOptions';
import type LineSeries from './LineSeries';
import type Point from '../../Core/Series/Point';
import type PointOptions from '../../Core/Series/PointOptions';
import type { SeriesZonesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        category?: string;
        clientX?: number;
        dist?: number;
        distX?: number;
        hasImage?: boolean;
        index: number;
        isInside?: boolean;
        low?: number;
        negative?: boolean;
        options: PointOptions;
        stackTotal?: number;
        stackY?: (number|null);
        yBottom?: number;
        zone?: SeriesZonesOptions;
    }
}

declare class LinePoint extends Point {
    options: LinePointOptions;
    series: LineSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinePoint;
