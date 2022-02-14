'use strict';

export class WorkersHelper {
	private file: string;
	constructor(file: string/*, onUpdate*/) {
		if (!file) throw new Error('Service worker file is missing');
		this.file = file;
	}

	public register(onUpdate: CallableFunction): Promise<void> {
		//if (typeof onUpdate !== 'function') throw new Error('onUpdate function is missing');
		navigator.serviceWorker.ready.then((reg: any) => { if(reg && reg.sync) reg.sync.register('sendQueue'); });

		return navigator.serviceWorker.register(this.file, { updateViaCache: 'none' }).then((reg: ServiceWorkerRegistration) => {
			console.log(`Service worker (${this.file}) is registered successfully`);
			this.monitorUpdates(reg, onUpdate);
			navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
		}, () => console.warn(`Unable to register the service worker (${this.file})`))
	}

	private isInstalled(worker: ServiceWorker|null, onUpdate: CallableFunction) {
		this.getWrokerState(worker).then(state => { if ('installed' === state) onUpdate(worker); });
	}

	private monitorUpdates(reg: ServiceWorkerRegistration, onUpdate: CallableFunction) {
		// page was not installed using a service worker
		if (!navigator.serviceWorker.controller) return;
		// update is ready and waitting
		if (reg.waiting) onUpdate(reg.waiting);
		// service worker is not installed yet wait until its state is resolved
		if (reg.installing) {
			this.isInstalled(reg.installing, onUpdate);
			return;
		}
		// update was found event
		reg.addEventListener('updatefound', () => this.isInstalled(reg.installing, onUpdate));
	}

	private getWrokerState(worker: ServiceWorker|null): Promise<unknown> {
		return new Promise((resolve) => {
			if(worker) worker.addEventListener('statechange', () => resolve(worker.state))
		});
	}
}