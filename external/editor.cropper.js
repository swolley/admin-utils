import Cropper from 'cropperjs';

//plugin
// switch field type plug-in code
(function ($, DataTable) {

	if (!DataTable.ext.editorFields) {
		DataTable.ext.editorFields = {};
	}

	var Editor = DataTable.Editor;
	var _fieldTypes = DataTable.ext.editorFields;

	_fieldTypes.cropper = {
		//cropper: null,
		image: null,
		preview: null,

		_triggerChange: ( input ) => {
			setTimeout( function () {
				input.trigger( 'change', {editor: true, editorSet: true} ); // editorSet legacy
			}, 0 );
		},

		start: (conf, /*canvas,*/ image, preview, reset = false) => {
			//let width = _fieldTypes.image.offsetWidth;
			//let height = _fieldTypes.image.offsetHeight;
			//let image;
		
			//canvas.width = width;
			//canvas.height = height;
			let fr = new FileReader();
			fr.onload = function() {
				if(reset) {
					preview.src = '';
					conf._input.val('');
				} else {
					preview.src = fr.result;
				}
				//canvas.getContext('2d').drawImage(preview, 0, 0);
				conf.cropper = new Cropper(preview, {
					aspectRatio: 1,
					//rotatable: false
					autoCropArea: 1
				});
			}
			fr.readAsDataURL(image);
		},

		clear: (conf) => {
			if(conf.cropper) {
				conf.cropper.destroy();
				_fieldTypes.cropper.set(conf, null)
				//_fieldTypes.cropper.start(conf, conf._input.find('input')[0].files[0], conf._input.find('.preview').get(0), true);
				_fieldTypes.cropper.create(conf);
			}
		},

		create: (conf) => {
			//var that = this;

			conf._enabled = true;

			// Create the elements to use for the input
			const uid = Editor.safeId(conf.id);
			conf._input = $(
				`<div id="${uid}_container" class="editor_upload cropper">
					<div class="eu_table container">
						<div class="row">
							<div class="upload limitHide">
								<button class="btn btn-outline-secondary">${conf.uploadText || 'Choose a file'}...</button>
								<input id="${uid}" type="file"></input>
							</div>
						</div>
						<div class="row text-center">
							<img id="${uid}_preview" class="preview cropper-preview" style="display: none" />
						</div>
						<div class="row">
							<div class="clearValue mt-2">
								<button class="btn btn-outline-secondary">${conf.clearText}</button>
							</div>
						</div>
					</div>
				</div>`
			);
			
			conf._input.find('.clearValue button').on('click', () => _fieldTypes.cropper.clear(conf));
			conf._input.find('.upload button').on('click', () => conf._input.find('#'+uid).trigger('click'));

			conf._input.find(`#${uid}`).on('input', e => {
				let button = conf._input.find('div.clearValue button');
				button.html( conf.clearText );
				conf._input.removeClass( 'noClear' );

				let image = e.target.files[0];
				let preview = conf._input.find(`#${uid}_preview`);
				preview.hide();
				//let canvas = conf._input.find(`#${uid}_canvas`).get(0);
				//let image = conf._input.find(`#${uid}`).get(0);

				_fieldTypes.cropper.start(conf, /*canvas,*/ image, preview.get(0));

				// conf.cropper = new Cropper(canvas, {
				// 	aspectRatio: 1
				// });
			
				// if (image.complete) {
				// 	_fieldTypes.image.start(conf, image, canvas);
				// } else {
				// 	image.onload = start;
				// }
			});

			//_fieldTypes.cropper.set.call(conf);

			return conf._input;
		},

		get: (conf) => {
			/*return await new Promise((resolve, reject) => {
				conf.cropper
					.getCroppedCanvas({ width: 25, height: 25 })
					.toBlob(blob => {
						resolve(blob);
					});
			}); */

			return conf.cropper ? conf.cropper
					.getCroppedCanvas({ width: 25, height: 25 })
					.toDataURL('image/png'): null;
		},

		set: (conf, val) => {
			conf._val = val;
			let container = conf._input;
			//if ( conf.display ) {
				let preview = container.find('img.preview');
				let cropperContainer = container.find('.cropper-container');
				if ( conf._val ) {
					preview.attr('src', conf._val);
					preview.show();
					cropperContainer.hide();
					//container.find('.no-file').remove();
				}else {
					preview.attr('src', '');
					preview.hide();
					cropperContainer.show();
					// /preview.after( '<span class="no-file">'+( conf.noImageText || 'No file' )+'</span>' );
				}
			//}

			let button = container.find('div.clearValue button');
			if ( val && conf.clearText ) {
				button.html( conf.clearText );
				container.removeClass( 'noClear' );
			} else {
				container.addClass( 'noClear' );
				if(conf.cropper) conf.cropper.clear();
				//if(conf.cropper) conf.cropper.destroy();
				//_fieldTypes.cropper.start(conf, conf._input.find('input')[0].files[0], conf._input.find('preview').get(0));
			}

			conf._input.find('input').triggerHandler( 'upload.editor', [ conf._val ] );
		},

		enable: (conf) => {
			conf._enabled = true;
			if(conf.cropper) conf.cropper.enable();
		},

		disable: (conf) => {
			conf._enabled = false;
			if(conf.cropper) conf.cropper.disable();
		}
	};
})(jQuery, jQuery.fn.dataTable);