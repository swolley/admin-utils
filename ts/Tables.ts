'use strict';

require('jszip');
require('pdfmake');
require('pdfmake/build/vfs_fonts');
require('datatables.net')(window, $);
require('datatables.net-bs4')(window, $);
require('datatables.net-editor')(window, $);
require('datatables.net-editor-bs4')(window, $);
require('datatables.net-autofill')(window, $);
require('datatables.net-autofill-bs4')(window, $);
require('datatables.net-buttons')(window, $);
require('datatables.net-buttons-bs4')(window, $);
require('datatables.net-buttons/js/buttons.colVis.min.js')(window, $);
// require('datatables.net-buttons/js/buttons.flash.js')(window, $);
require('datatables.net-buttons/js/buttons.html5.min.js')(window, $);
require('datatables.net-buttons/js/buttons.print.min.js')(window, $);
require('datatables.net-colreorder')(window, $);
require('datatables.net-colreorder-bs4')(window, $);
require('datatables.net-datetime')(window, $);
require('datatables.net-fixedcolumns')(window, $);
require('datatables.net-fixedcolumns-bs4')(window, $);
require('datatables.net-fixedheader')(window, $);
require('datatables.net-fixedheader-bs4')(window, $);
require('datatables.net-keytable')(window, $);
///require('datatables.net-keytable-bs4')(window, $);
require('datatables.net-responsive')(window, $);
require('datatables.net-responsive-bs4')(window, $);
require('datatables.net-rowgroup')(window, $);
require('datatables.net-rowgroup-bs4')(window, $);
require('datatables.net-rowreorder')(window, $);
require('datatables.net-rowreorder-bs4')(window, $);
require('datatables.net-scroller')(window, $);
require('datatables.net-scroller-bs4')(window, $);
require('datatables.net-searchbuilder')(window, $);
require('datatables.net-searchbuilder-bs4')(window, $);
require('datatables.net-searchpanes')(window, $);
require('datatables.net-searchpanes-bs4')(window, $);
require('datatables.net-select-bs4')(window, $);

//require('spectrum-colorpicker');

//require('./external/dataTables.rowsGroup');
//require('jquery-mask-plugin');
//require('./external/editor.mask')();
require('selectize');
require('../external/editor.selectize')();
require('../external/editor.switch');
require('../external/editor.json');
require('../external/editor.cropper');
//require('./external/editor.colorpicker');
// require('jquery-ui/ui/widget');
// require('jquery-ui/ui/widgets/mouse');
// require('jquery-ui/ui/widgets/sortable');

import { Utils } from './Utils';

// window.COLLABORATORI = window.COLLABORATORI || {};
// window.COLLABORATORI.datatables = window.COLLABORATORI.datatables || {};
// window.COLLABORATORI.editors = {};
window.datatablesTranslations = Object.assign({}, window.datatablesTranslations) || {};
(window.datatablesTranslations as any).sProcessing = '<i class="fas fa-spinner fa-spin"></i> ' + (window.datatablesTranslations as any).sProcessing;


$.fn.dataTable.Buttons.defaults.dom!.button!.className = 'btn btn-sm btn-secondary';
$.fn.dataTable.ext.errMode = 'throw';

interface ColumnDefsSettings extends DataTables.ColumnDefsSettings {
	searchPanes?: { [key: string]: any };
}

interface ButtonSettings extends DataTables.ButtonSettings {
	autoClose?: boolean;
	fade?: number;
}

interface ColumnSettings extends DataTables.ColumnSettings {
	editField?: string;
}

export interface DatatablesSettings extends DataTables.Settings {
	searchPanes?: { [key: string]: any } | false;
	searchBuilder?: { [key: string]: any } | false;
	columnDefs?: ColumnDefsSettings[];
	columns?: ColumnSettings[];
	buttons?: boolean | string[] | DataTables.ButtonsSettings | ButtonSettings[] | undefined;
}

export class Tables {
	static readonly DEFAULT_DATATABLES_OPTIONS: DatatablesSettings = {
		// language: (() => {
		// 	let trans = <any>window.datatablesTranslations;
		// 	if(trans.loadingRecords) trans.loadingRecords = `<div>${trans.loadingRecords}</div><div class='text-default h4 mt-1 mb-0'><i class='fas fa-circle-notch fa-spin'></i></div>`;
		// 	if(trans.processing) trans.processing = `<div>${trans.processing}</div><div class='text-default h4 mt-1 mb-0'><i class='fas fa-circle-notch fa-spin'></i></div>`;
		// 	return trans;
		// })(),
		processing: true,
		searching: true,
		ordering: false,
		serverSide: true,
		pageLength: 25,
		responsive: true,
		stateSave: true,
		retrieve: true,
		searchDelay: 800,
		autoWidth: false,
		deferRender: true,
		pagingType: "first_last_numbers",
		dom: `<'row sticky-top'<'col-12 d-flex flex-column flex-md-row justify-content-between pb-1'<B><f>>>
		<'row dt-table-container'<'col-sm-12'tr>>
		<'row sticky-bottom'<'col-12 d-flex flex-column flex-md-row justify-content-between'<l><'d-none d-md-block'<i>><p>>>`,
		select: {
			style: 'os',
			//selector: 'td:not(:first-child):not(.bg-highlight):not(.action-button)'
			selector: 'td.select-checkbox'
		}
		// columnDefs: [ 
		// 	{ orderable: false, className: 'select-checkbox', targets: 0 } 
		// ],
	};

	static readonly DEFAULT_EDITOR_OPTIONS: any = {
		formOptions: {
			main: {
				focus: null
			},
			bubble: {
				drawType: "none"
			}
		},
		// i18n: (window.datatablesTranslations as any).i18n || {}
	};

	/**
	 * @param {string|HTMLElement|JQuery<HTMLElement>} domElement table container selector or object
	 * @param {object|null} options datatables options
	 * @param {boolean} enableSearchpanes activate searchpanes
	 * @return {Datatables.Api} datatables contruction to be resolved
	 */
	public static constructDataTables(domElement: anyElement, options?: DatatablesSettings/*, checkForNewRows?: boolean|number*/): DataTables.Api {
		let mergedOptions = Object.assign({}, Tables.DEFAULT_DATATABLES_OPTIONS, options);
		//if ((mergedOptions.ajax as DataTables.AjaxSettings).url) settings.url = (mergedOptions.ajax as DataTables.AjaxSettings).url;
		mergedOptions.initComplete = function (settings: DataTables.SettingsLegacy, _json: any) {
			let $table = $(settings.nTable);
			$table.append('<tfoot></tfoot>');
			$table.find("thead tr").clone().appendTo($table.find("tfoot"));

			let $wrapper = $table.closest('.dataTables_wrapper');
			$wrapper.find('.dtsp-searchPanes').addClass('hidden');
			let $builder = $wrapper.find('.dtsb-searchBuilder');
			if($builder.length) {
				let observer = new MutationObserver(mutations => {
					mutations.forEach(mutation => {
						if (!mutation.addedNodes) return
						
						let $groups = $builder.find('.dtsb-group');
						if($groups.length){
							$groups.addClass('hidden');
							observer.disconnect();
						}
					})
				});
				
				observer.observe(<Node>$builder.get(0), {
					childList: true, 
					subtree: true, 
					attributes: false, 
					characterData: false
				});
			}
		}

		if (mergedOptions.buttons && (mergedOptions.buttons as any[]).length) {
			(mergedOptions.buttons as any[]).forEach(button => {
				if (button.extend && button.extend === 'collection') {
					button.autoClose = true;
					button.fade = 0;
				}
			});
		}

		if (mergedOptions.searchBuilder) {
			mergedOptions.dom = "<'row dt-builder-container'<'col-sm-12'Q>>" + mergedOptions.dom;
		}

		if (mergedOptions.searchPanes) {
			mergedOptions.dom = "<'row dt-filters-container'<'col-sm-12'P>>" + mergedOptions.dom;
			mergedOptions.searchPanes = Object.assign(mergedOptions.searchPanes, {
				threshold: 1,
				combiner: 'and',
				cascadePanes: true,
				viewTotal: true,
				orderable: true,
				controls: true,
				dtOpts: {
					paging: true,
					dom: "tp",
					pagingType: 'simple',
					select: { style: 'multi' }
				}
			});
		} else {
			mergedOptions.searchPanes = false;
		}


		if (typeof mergedOptions.ajax === 'object' && !mergedOptions.ajax.hasOwnProperty('method')) {
			mergedOptions.ajax = {
				url: typeof mergedOptions.ajax == 'object' && !mergedOptions.ajax.hasOwnProperty('method') ? mergedOptions.ajax.url : mergedOptions.ajax as string,
				method: 'POST'
			};
		} else {
			mergedOptions.ajax = { url: mergedOptions.ajax as string, method: 'POST' };
		}

		let place = Utils.DOM.getDomElement(domElement);
		let table = $(place)
			.DataTable(mergedOptions)
			// .on('xhr.dt', function(_e: Event, _settings: any, _json: any, xhr: XMLHttpRequest) {
			// 	if(xhr.status === 403) {
			// 		window.Notify.alert(window.Translator.trans('generic.sessionExpired'), () => {
			// 			//$(location).attr('href', '/login');
			// 			location.href = '/admin/login';
			// 		});
			// 	}
			// });
			
		$(place).on('click', '.details-control.dtr-control', function(_e) {
			$(this).parent('tr').toggleClass('sticky-row');
		});

		return table;
	}

	/**
	 * @param {object} options editor options
	 */
	public static constructEditor(options?: any) {
		let mergedOptions: any = Object.assign({}, Tables.DEFAULT_EDITOR_OPTIONS, options);
		if (typeof mergedOptions.ajax === 'object' && !mergedOptions.ajax.hasOwnProperty('method')) {
			mergedOptions.ajax = {
				create: { url: mergedOptions.ajax.url, method: 'PUT' },
				upload: { url: mergedOptions.ajax.url, method: 'PUT' },
				edit: { url: mergedOptions.ajax.url, method: 'PATCH' },
				remove: { url: mergedOptions.ajax.url + '/_id_', method: 'DELETE' }
			};
		} else {
			mergedOptions.ajax = {
				create: { url: mergedOptions.ajax, method: 'PUT' },
				upload: { url: mergedOptions.ajax, method: 'PUT' },
				edit: { url: mergedOptions.ajax, method: 'PATCH' },
				remove: { url: mergedOptions.ajax + '/_id_', method: 'DELETE' }
			};
		}

		if (mergedOptions.formOptions === undefined) mergedOptions.formOptions = { inline: { drawType: "none" } };

		mergedOptions.fields.forEach((field: any) => {
			if (field.type === 'datetime') {
				field.opts = field.opts || {};
				// switch (window.COLLABORATORI.locale) {
					// case 'en':
						// if (!field.displayFormat) field.displayFormat = 'YYYY-MM-DD';
						// if (!field.opts.firstDay) field.opts.firstDay = 0;
						// break;
					// default:
						if (!field.displayFormat) field.displayFormat = 'DD-MM-YYYY';
						if (!field.opts.firstDay) field.opts.firstDay = 1;
				// }
				field.opts.wireFormat = 'YYYY-MM-DD';
			}
		});

		return new ($.fn.dataTable as any).Editor(mergedOptions)
			.on('postSubmit', function(_e: Event, json: any, _data: any, _action: any, xhr: XMLHttpRequest) {
				if(xhr.status === 403) location.href = '/login';

				if(json && json.error && json.error.length) console.error(json.error);
				if(json && json.FieldErrors && json.error.length) console.error(json.fieldErrors);
			});
	}
}