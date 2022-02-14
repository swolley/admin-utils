import { JSONEditor } from '@json-editor/json-editor';

//plugin
// switch field type plug-in code
(function ($, DataTable) {

	if (!DataTable.ext.editorFields) {
		DataTable.ext.editorFields = {};
	}

	var Editor = DataTable.Editor;
	var _fieldTypes = DataTable.ext.editorFields;

	_fieldTypes.json = {
		editor: null,

		create: (conf) => {
			//var that = this;

			conf._enabled = true;

			// Create the elements to use for the input
			const uid = Editor.safeId(conf.id);
			conf._input = $(
				'<div id="' + uid + '_container" class="form-control json-control">' +
					'<div class="border-0 json-value" id="' + uid + '"/>' +
				'</div>');
			conf.editor = new JSONEditor(conf._input.find(/*'.json-value'*/`#${uid}`).get(0), Object.assign({ 
				theme: 'bootstrap4',
				iconlib: "fontawesome5",
				disable_collapse: true,
				disable_edit_json: true,
				disable_properties: true, 
				disable_array_add: true,
				disable_array_delete: true,
				disable_array_delete_all_rows: true,
				disable_array_delete_last_row: true,
				disable_array_reorder: true,
				no_additional_properties: true,
				show_errors: 'interaction',
				//schema: conf.options.schema || {} 
			}, conf.options));
			return conf._input;
		},

		get: (conf) => {
			let validated = conf.editor.validate();
			if(validated.length === 0) {
				return JSON.stringify(conf.editor.getValue());
			} else {
				alert(JSON.stringify(validated));
				return undefined;
			}
		},

		set: (conf, val) => {
			if(val === '') return;
			conf.editor.setValue(typeof val === 'string' ? JSON.parse(val) : val);
		},

		enable: (conf) => {
			conf._enabled = true;
			conf.editor.enable();
		},

		disable: (conf) => {
			conf._enabled = false;
			conf.editor.disable();
		}
	};
})(jQuery, jQuery.fn.dataTable);