'use strict';

import 'jquery-ui/ui/data';
import 'jquery-ui/ui/scroll-parent';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/sortable';
import 'pivottable/dist/pivot';
import 'pivottable/dist/pivot.it';
import 'pivottable/dist/pivot.fr';
import 'pivottable/dist/pivot.de';
import 'pivottable/dist/pivot.es';
import 'pivottable/dist/export_renderers';
import 'pivottable/dist/gchart_renderers';

import { Utils } from './Utils';

declare global {
	interface JQuery {
		pivot(data: any[], options?: any): JQuery;
		pivotUI(data: any[], options?: any, overwrite?: boolean, locale?: string): JQuery;
	}

	interface Window {
		google: any;
	}
}

// window.COLLABORATORI = window.COLLABORATORI ?? {};
// window.COLLABORATORI.charts = {};

window.google = require('google-charts').GoogleCharts;
window.google.load("visualization", "1", {packages:["corechart", "charteditor"]});

// interface PivotOptions {
// 	rows?: string[];
// 	cols?: string[];
// 	aggregator?: any;
// 	renderer?: any;
// 	derivedAttributes?: any;
// 	filter?: any;
// 	rendererOptions?: any;
// 	localeStrings?: any;
// }

interface PivotUiOptions {
	renderers?: any;
	aggregators?: any;
	rows?: string[];
	cols?: string[];
	vals?: string[];
	aggregatorName?: string;
	rendererName?: string;
	derivedAttributes?: any;
	filter?: any;
	exclusions?: any;
	hiddenAttributes?: string[];
	hiddenFromDragDrop?: string[];
	menuLimit?: number;
	rendererOptions?: any;
	onRefresh?: (options: PivotUiOptions) => void;
	localeStrings?: any;
	autoSortUnusedAttrs?: boolean;
	unusedAttrsVertical?: boolean;
}

export class Charts {
	private static readonly DEFAULT_PIVOT_OPTIONS: PivotUiOptions = {
		renderers: $.extend(
			($ as any).pivotUtilities.renderers,
			($ as any).pivotUtilities.export_renderers,
			($ as any).pivotUtilities.gchart_renderers
		),
		hiddenFromDragDrop: ['total'],
		cols: [], 
		rows: [],
		rendererOptions: { 
			gchart: { 
				fontSize: 12,
				chartArea: {
					top: 10,
					left: 20,
					width:'60%',
					height:'80%',
				},				
			} 
		}
	};

	public static constructPivot(domElement: anyElement, options?: any, ajaxUrl?: string, from?: moment.Moment, to?: moment.Moment, type?: number, cb?: Function): any {
		let mergedOptions = Object.assign({}, Charts.DEFAULT_PIVOT_OPTIONS, options || {});
		let route = ajaxUrl || domElement.toString().replace('#', '').replace(/-/g, '/');
		return $.get(route + '?' + $.param({ start: from?.format(), end: to?.format(), type }))
			.then(data => {
				// let currentLocale = window.COLLABORATORI.locale as string || 'en';
				data.forEach((row: any) => {
					let columns = Object.keys(row);
					columns.forEach(col => {
						row[window.Translator.trans('tables.columns.' + col)] = row[col];
						delete(row[col]);
					});
				});
				if(cb) cb(data);
				return $(Utils.DOM.getDomElement(domElement)).pivotUI(data, mergedOptions, false/*, currentLocale === 'sp' ? 'es' : currentLocale*/);
			});
	}
}