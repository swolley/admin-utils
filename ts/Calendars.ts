'use strict';

const allLocales = require('fullcalendar/dist/locale-all.js');
import { Calendar, OptionsInput, View } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap4 from '@fullcalendar/bootstrap';
//import moment from 'moment';
import { Utils } from './Utils';

// window.COLLABORATORI = window.COLLABORATORI ?? {};
// window.COLLABORATORI.calendars = {};

export class Calendars {
	static readonly DEFAULT_CALENDAR_OPTIONS: OptionsInput = {
		locales: allLocales,
		//locale: window.COLLABORATORI.locale as string,
		plugins: [bootstrap4, dayGridPlugin],
		header: {
			left: 'title',
			center: undefined,
			right: 'prev,next today',
		},
		validRange: {
			//start: '2017-05-01',
			end: new Date()
		},
		defaultView: 'dayGridMonth',
		firstDay: 1,
		showNonCurrentDates: false,
		editable: false,
		droppable: false,
		eventLimit: true,
		themeSystem: 'bootstrap',
		displayEventTime: false,
		allDayDefault: true,
		bootstrapFontAwesome: {
			//close: 'fa-times',
			prev: 'fa-chevron-left',
			next: 'fa-chevron-right',
			prevYear: 'fa-angle-double-left',
			nextYear: 'fa-angle-double-right'
		},
		buttonText: {
			today: window.Translator.trans('pages.buttons.today')
		},
		eventRender: function (info: any) {
			info.el.classList.add('status');
			info.el.classList.add(`bg-${info.event.extendedProps.status}`);
		}
	}

	private static mergeOptions(destination?: OptionsInput, target?: any): OptionsInput {
		return Object.assign(destination ?? {}, Calendars.DEFAULT_CALENDAR_OPTIONS, target ?? {});
	}

	/**
	 * @param {string|JQuery<HTMLElement>} domElement table container selector or object
	 * @param {string|null} ajaxUrl	backend route to get data
	 * @param {object|null} options fullcalendar options
	 * @param {callback} cb callback function
	 * @return {Calendar} constructed fullcalendar
	 */
	public static constructFullcalendar(domElement: anyElement): Calendar;
	public static constructFullcalendar(domElement: anyElement, ajaxUrl?: string, options?: OptionsInput, cb?: Function): Calendar {
		options = Calendars.mergeOptions(options);
		if (ajaxUrl) {
			options.events = ajaxUrl;
		} else if (typeof domElement === "string") {
			domElement.replace('#', '').replace(/-/g, '/');
		}

		if (cb) options.datesRender = (arg: { view: View, el: HTMLElement }) => {
			cb(window.moment(arg.view.activeStart), window.moment(arg.view.activeEnd));
		}

		const calendar = new Calendar(Utils.DOM.getDomElement(domElement), options);
		calendar.render();

		return calendar;
	}
}
