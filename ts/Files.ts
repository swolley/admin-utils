'use strict';

const FancyTree = require('jquery.fancytree');
require('jquery.fancytree/dist/modules/jquery.fancytree.childcounter');
require('bootstrap-fileinput');
require('bootstrap-fileinput/themes/fas/theme');

import { Utils } from './Utils';

// window.COLLABORATORI = window.COLLABORATORI ?? {};
// window.COLLABORATORI.calendars = {};

interface CustomFileInputOptions extends BootstrapFileInput.FileInputOptions { 
	autoOrientImage?: boolean | undefined;
	autoOrientImageInitial?: boolean | undefined;
	showBrowse?: boolean | undefined;
	initialPreviewAsData?: boolean | undefined;
	downloadUrl?: string | false | undefined;
	language?: string | undefined;
}

interface FileInfo extends BootstrapFileInput.PreviewConfig {
	type: string,
	created: number,
	downloadUrl: string
}

export class Files {
	static readonly FILEINPUT_FOOTER_TEMPLATE: string = `<div class="file-thumbnail-footer">
		<div class="file-footer-caption" title="{caption}">
		<div class="file-caption-info">{caption}</div>
		<div class="file-size-info">{size}</div>
		<!--div class="file-caption-info">{TAG_CREATED}</div-->
		</div>
		{progress}
		{actions}
	</div>`;
	
	static readonly DEFAULT_FILEINPUT_OPTIONS: CustomFileInputOptions = {
		autoOrientImage: false,
		autoOrientImageInitial: false,
		theme: "fas",
		// language: <string>window.COLLABORATORI.locale,
		showBrowse: false,
		showUpload: false,
		showCaption: false,
		showCancel: false,
		showClose: false,
		showRemove: false,
		layoutTemplates: { 
			footer: Files.FILEINPUT_FOOTER_TEMPLATE 
		},
		dropZoneEnabled: false,
		showAjaxErrorDetails: false,
		initialPreviewAsData: false,
		initialPreview: [],
		initialPreviewConfig: [],
		initialPreviewThumbTags: {},
		fileActionSettings: {
			showDrag: true,
			showZoom: true,
			showRemove: true,
			showUpload: true,
			showDownload: true
		},
		downloadUrl: false
	};
	
	static readonly DEFAULT_FILETREE_OPTIONS: Fancytree.FancytreeOptions = {
		extensions: ["childcounter"],
		childcounter: {
			deep: false,
			hideZeros: true,
			hideExpanded: false
		},
		generateIds: true,
		keyboard: true,
		quicksearch: false,
		minExpandLevel: 2,
		//clickFolderMode: 2,
		autoCollapse: true,
		autoActivate: false,
		beforeSelect: function (_event: JQueryEventObject, data: Fancytree.EventData): boolean {
			// A node is about to be selected: prevent this for folders:
			return !data.node.isFolder();
		}
	};
	
	public static constructTree(domElement: anyElement, source: any, options?: Fancytree.FancytreeOptions): Fancytree.Fancytree {
		options = Object.assign({}, Files.DEFAULT_FILETREE_OPTIONS, options ?? {});
		options.source = typeof source === 'string' ? { url: source } : source;
		//return $.ui.fancytree.createTree(Utils.DOM.getDomElement(domElement), options);
		return FancyTree.createTree(Utils.DOM.getDomElement(domElement), options);
	}
	
	private static prepareInitialsLists(initialPreview: string[], initialPreviewConfig: FileInfo[]/*, initialPreviewThumbTags: {[key: string]: string }*/, adminMode?: boolean): void {
		for (let i = 0; i < initialPreviewConfig.length; i++) {
			initialPreviewConfig[i].downloadUrl = `/${adminMode ? 'admin' : 'api'}/files/${(<any>initialPreviewConfig[i].extra).mainfolder}/${initialPreviewConfig[i].key}/${initialPreviewConfig[i].caption}`;
			let htmlPreview = '';
			switch (initialPreviewConfig[i].type) { 
				case 'image':
				case 'video':
					htmlPreview = `<img class="file-preview-image kv-preview-data" src="/admin/files/${(<any>initialPreviewConfig[i].extra).mainfolder}/${initialPreviewConfig[i].key}/${initialPreviewConfig[i].caption}/thumb" alt="${initialPreviewConfig[i].caption}" title="${initialPreviewConfig[i].caption}" onerror="this.onerror=null;this.src='/build/file-${initialPreviewConfig[i].key}-icon.png'">`;
					break;
				case 'audio':
					htmlPreview = `<img class="file-preview-image kv-preview-data" src="/build/file-audio-icon.png" alt="${initialPreviewConfig[i].caption}" title="${initialPreviewConfig[i].caption}">`;
					break;
				case 'text':
				case 'application':
					htmlPreview = `<img class="file-preview-image kv-preview-data" src="/admin}/files/${(<any>initialPreviewConfig[i].extra).mainfolder}/${initialPreviewConfig[i].key}/${initialPreviewConfig[i].caption}/thumb" alt="${initialPreviewConfig[i].caption}" title="${initialPreviewConfig[i].caption}" onerror="this.onerror=null;this.src='/build/file-text-icon.png'">`;
					break;
				default:
					htmlPreview = `<img class="file-preview-image kv-preview-data" src="/build/file-generic-icon.png" alt="${initialPreviewConfig[i].caption}" title="${initialPreviewConfig[i].caption}">`;
			}
			
			initialPreview.push(htmlPreview);
			initialPreviewConfig[i].caption = initialPreviewConfig[i].caption.split('§')[1];
		}
	}

	public static constructFileInput(domElement: anyElement, ajaxUrl?: string, options?: CustomFileInputOptions, cb?: Function, adminMode?: boolean): void {
		let $container = $(Utils.DOM.getDomElement(domElement));
		//options = Object.assign({}, Files.DEFAULT_FILEINPUT_OPTIONS, options ?? {});
		options = Utils.Objects.mergeDeep(jQuery.extend(true, {}, Files.DEFAULT_FILEINPUT_OPTIONS), options ?? {});
		
		if(ajaxUrl) {
			$.ajax({
				url: ajaxUrl,
				method: 'GET',
				async: false,
				success: response => {
					let initialPreviewConfig: FileInfo[] = response.data;
					let initialPreview: string[] = [];
					let initialPreviewThumbTags: {[key: string]: string } = {};
					Files.prepareInitialsLists (initialPreview, initialPreviewConfig/*, initialPreviewThumbTags*/, adminMode);
					options!.initialPreview = initialPreview;
					options!.initialPreviewConfig = initialPreviewConfig;
					options!.initialPreviewThumbTags = initialPreviewThumbTags;
	
					$container.empty();
					$container.append('<input type="file"/>');
					let fileinput = $container.find('input[type=file]').fileinput('destroy').fileinput(options);
					if(cb) cb(fileinput);
				}
			});
		} else {
			let fileinput = $container.find('input[type=file]').fileinput('destroy').fileinput(options);
			if(cb) cb(fileinput);
		}
	}
}