//plugin
// switch field type plug-in code
(function ($, DataTable) {

	if (!DataTable.ext.editorFields) {
		DataTable.ext.editorFields = {};
	}

	var Editor = DataTable.Editor;
	var _fieldTypes = DataTable.ext.editorFields;

	_fieldTypes.switch = {
		create: function (conf) {
			//var that = this;

			conf._enabled = true;

			// Create the elements to use for the input
			const uid = Editor.safeId(conf.id);
			conf._input = $(
				'<div id="' + uid + '_container" class="custom-control custom-switch">' +
					'<input type="checkbox" class="custom-control-input" id="' + uid + '"/>' +
					'<label class="custom-control-label" for="' + uid + '"></label>' +
				'</div>');
				
			return conf._input;
		},

		get: function (conf) {
			return conf._input.find('input').is(':checked') ? 1 : 0;
		},

		set: function (conf, val) {
			conf._input.find('input').prop( "checked", val == true || val == 1 );
		},

		enable: function (conf) {
			conf._enabled = true;
			$(conf._input).attr('disabled', false);
		},

		disable: function (conf) {
			conf._enabled = false;
			$(conf._input).find('input').attr('disabled', true);
		}
	};
})(jQuery, jQuery.fn.dataTable);