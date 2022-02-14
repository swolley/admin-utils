'use strict';

declare global {
	// interface JQuery {
	// 	modal(options: any): void;
	// 	popover(options: any): void;
	// 	tab(options: any): void;
	// }
	
	interface Window {
		// COLLABORATORI: any;
		// datatablesTranslations: Object;
		Notify: Notifications;
		jQuery: JQueryStatic;
		$: JQueryStatic;
		// errorMessage: string;
	}
	
	// type anyElement = string | HTMLElement | JQuery;
}

//#region ------------------------ IMPORTS ------------------------------------------------//
import '../scss/base.scss';

import $ from 'jquery';
window.$ = window.jQuery = $;
import 'bootstrap';
import Translator from 'bazinga-translator';
import { Notifications } from './ts/Notifications';
import moment from 'moment';
//#endregion

//jquery overrides
//$.noConflict();
$.ajaxSetup({ cache: false, timeout: 5000 });
// $.support.transition = false;	//disable jquery transitions
// $.fx.off = true;	//disable jquery animations

// window.COLLABORATORI = window.COLLABORATORI ?? {};
window.Translator = Translator;
window.Notify = new Notifications();
window.moment = moment;

// if(window.COLLABORATORI.userAcl) Object.freeze(window.COLLABORATORI.userAcl);
// if(window.COLLABORATORI.accessAreas) Object.freeze(window.COLLABORATORI.accessAreas);
// if(window.datatablesTranslations) Object.freeze(window.datatablesTranslations);
// if(window.COLLABORATORI.locale) Object.freeze(window.COLLABORATORI.locale);

// jQuery(function () {
	// $("#layoutSidenav_nav .sb-sidenav a.nav-link").each((_idx, el) => {
	// 	if ((el as HTMLAnchorElement).href.includes(location.pathname)) {
	// 		let $element = $(el);
	// 		$element.addClass("active");
	// 		const nested = $element.parents('.collapse');
	// 		nested.siblings('.nav-link[data-target="#'+ nested.attr('id') +'"]').trigger('click');
	// 	} else if(window.location.pathname.replace(/\/(admin|editor)/, '') === '/') {
	// 		$('#layoutSidenav_nav .sb-sidenav a.nav-link[href="/dashboard"]').addClass("active");
	// 	}
	// });

    // Toggle the side navigation
    // $("#sidebarToggle").on("click", function(e) {
    //     e.preventDefault();
	// 	$("body").toggleClass("sb-sidenav-toggled");
	// 	$(".navbar-brand").toggleClass("toggled");
	// 	$(".navbar-brand img.toggled, .navbar-brand img.expanded").toggle();
	// });
	
	// $(".sb-sidenav-toggled main").on('click', function() {
	// 	$('#sidebarToggle').trigger('click');
	// });
	
	//Catch AjaxAuthenticationListener response
	// $(document).ajaxError((_e: JQuery.TriggeredEvent, jqXHR: JQuery.jqXHR<any>) => {
	// 	if (403 === jqXHR.status) {
	// 		window.Notify.alert(window.Translator.trans('generic.sessionExpired'), () => {
	// 			//$(location).attr('href', '/admin/login');
	// 			location.href = location.href.includes('/admin') ? '/admin/login' : '/editor/login';
	// 		});
	// 	}
	// });

	// $('.page-tabs .nav-link').on('click', function(_e) {
	// 	location.hash = '__' + this.id;
	// });

	// if(this.location.hash) $('#' + location.hash.substring(3)).trigger('click');

	// if(window.errorMessage) window.Notify.message(Notifications.Types.ERROR, window.errorMessage);
// });