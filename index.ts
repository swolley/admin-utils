'use strict';

declare global {
	interface JQuery {
		swipe(options: any): any;
	}
	interface Window {
		Notify: Notifications;
		jQuery: JQueryStatic;
		$: JQueryStatic;
		Translator: Translator.BazingaTranslator;
		moment: Function;
		datatablesTranslations: Object;
	}
}

//#region ------------------------ IMPORTS ------------------------------------------------//
// import '../scss/base.scss';

import $ from 'jquery';
window.$ = window.jQuery = $;
import 'bootstrap';
import Translator from 'bazinga-translator';
import { Notifications } from './ts/Notifications';
import moment from 'moment';
//#endregion

//jquery overrides
$.ajaxSetup({ cache: false, timeout: 5000 });
$.support.transition = false;	//disable jquery transitions
$.fx.off = true;	//disable jquery animations

window.Translator = Translator;
window.Notify = new Notifications();
window.moment = moment;