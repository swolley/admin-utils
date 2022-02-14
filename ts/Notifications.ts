'use strict';

const toastr = require('toastr');
import { Utils } from './Utils';

type NotificationType = 'warning' | 'info' | 'success' | 'error';

export class Notifications {
    static readonly Types: { [key: string]: NotificationType } = {
        WARNING: 'warning',
        INFO: 'info',
        SUCCESS: 'success',
        ERROR: 'error'
    };

    private $modal: JQuery<HTMLElement>;

    public constructor() {
        let $modal = $('#notifications-modal');
        if (!$modal.length) {
            $('body').prepend(`<!-- custom confirm modal -->
                <div id="notifications-modal" class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="Effettua una scelta" aria-hidden="true">
                    <div class="modal-dialog modal-sm modal-dialog-centered">
                        <div class="modal-content shadow">
                            <div class="modal-body">
                                <div id="notifications-modal-text"></div>
                                <div id="notifications-modal-fields"></div>
                            </div>
                            <div class="modal-footer justify-content-center"></div>
                        </div>
                    </div>
                </div>`
            );

            $modal = $('#notifications-modal');
            $modal.on('hidden.bs.modal', (_e: Event) => this.clearModal());

        }

        this.$modal = $modal;
    }

    public clearModal(): void
    {
        this.$modal.find('#notifications-modal-text').empty();
        this.$modal.find('#notifications-modal-fields').empty();
        this.$modal.find('.modal-footer').empty();
    }

    public getModal(): JQuery<HTMLElement> {
        return this.$modal;
    }

    public getTextContainer(): JQuery<HTMLElement> {
        return this.$modal.find('#notifications-modal-text');
    }

    private notificationToLog(type: NotificationType, text: string, contentToLog?: any) {
        let toLog = [text];
        if(contentToLog) toLog.push(contentToLog);
        switch (type) {
            case 'info':
            case 'success':
                console.info(...toLog);
                break;
            case 'warning':
                console.warn(...toLog);
                break;
            case 'error':
                console.error(...toLog);
                break;
        }
    }

    private create(message: string, fields: string[] = [], buttons: string[] = ['Ok', 'Annulla'], cb?: Function/*, e*/) {
        this.clearModal();
        
        let $footer = this.$modal.find("#notifications-modal .modal-footer");
        let $fields = this.$modal.find("#notifications-modal-fields");
        let $text = this.$modal.find("#notifications-modal-text");

        $text.text(message);

        //buttons
        for (let i = 0; i < buttons.length; i++) {
            $footer.append(`<button type="button" class="btn btn-info" value="${i}">${buttons[i]}</button>`);
        }

        //fields
        for (let i = 0; i < fields.length; i++) {
            $fields.append(`<div class="form-group">
                <label for="field${i}" class="col-form-label">${fields[i]}</label>
                <div>
                    <input type="text" id="field${i}" name="field${i}" class="form-control" />
                </div>
            </div>`);
        }

        $("#notifications-modal button").on("click", (e: Event) => {
            let choice: any = (<HTMLInputElement>e.target).value;
            if (typeof choice === 'string') choice = parseInt(choice);
            if (cb) cb(fields.length ? { fields: $("#notifications-modal-fields").val(), choice, modal: this.$modal } : choice);
            if (!fields.length) this.$modal.modal('hide');
        });

        this.$modal.modal('show');
    }

    public message(type: NotificationType, text: string, title?: string, contentToLog?: any) {
        toastr[type](
            text, 
            title, 
            { 
                positionClass: Utils.Network.isMobile() ? 'toast-bottom-center' : 'toast-top-right',
                newestOnTop: Utils.Network.isMobile(),
                preventDuplicates: true,
                escapeHtml: true,
                timeOut: 3500,
                //closeButton: true
            }
        );
        //alert({ type, title: title || false, text });
        this.notificationToLog(type, text, contentToLog);
    };

    public choose(message: string, buttons: string[] = ['Ok', 'Annulla'], cb?: Function) {
        this.create(message, [], buttons, cb);
    };

    public alert(message: string, cb?: Function) {
        this.create(message, [], ['Chiudi'], cb);
    };

    public prompt(message: string, fields: string[] = [], cb?: Function) {
        this.create(message, fields, ['Ok', 'Annulla'], cb);
    }

    public show(htmlContent?: string|HTMLElement, cb?: Function) {
        this.clearModal();
        if(htmlContent) this.$modal.find("#notifications-modal-text").html(htmlContent);
        this.$modal.modal('show');
        if(cb) cb();
    }
    
    public countdown(domElement: string, seconds: number, start?: number, format: boolean = false, restart: boolean = false): NodeJS.Timeout|null {
        let $badge = $(/*Utils.DOM.getDomElement(*/domElement/*)*/);
        if($badge.length) {
            let curJobsCountdown = start || seconds;
            $badge.text(format ? this.secondsToHoursString(curJobsCountdown) : curJobsCountdown);
            let cb = () => {
                curJobsCountdown--;
                $badge.text(format ? this.secondsToHoursString(curJobsCountdown) : curJobsCountdown);
                if(restart && curJobsCountdown === 0) {
                    curJobsCountdown = seconds;
                } else if(!restart) {
                    clearInterval(interval);
                }
            };
            let interval = setInterval(cb, 1000);
            return interval;
        }

        return null;
    }

    private secondsToHoursString(seconds: number): string {
        let hours = new Date(seconds * 1000).toISOString().substring(11,19);
        while(hours.match(/^00:/)) {
            hours = hours.substring(3);
        }
        return hours[0] === '0' ? hours.substring(1) : hours;
    }
}