const { navigateThroughPlayer } = require('../../../utils/playerTools');

const { detectPlayer, addAfterPageFrame } = window._CMLS.libs.playerTools;

const scriptName = 'AUTO-RELOAD PAGE';
const nameSpace = 'autoReloadPage';
const version = '0.3';
const log = new window._CMLS.Logger(`${scriptName} ${version}`);

((window, undefined) => {
	const w = window;
	w._CMLS = w._CMLS || {};

	class AutoReloadPage {
		defaults = {
			condition: 'body.home',
			timeout: 8,
		};
		settings = {};
		timer = null;
		timeout = null;
		active = false;

		constructor(options = false) {
			if (options instanceof Object) {
				log.info('Instantiated with options', options);
				this.settings = Object.assign(this.defaults, options);
				this.start();
			}
		}

		checkCondition() {
			const win = window.self,
				pathname = win.location.pathname;
			return !!(pathname.length < 1 || pathname === '/');
			return !!win?.document?.body?.matches(this.settings.condition);
		}

		start(options = {}) {
			if (!options instanceof Object) {
				log.error('Received malformed options');
				return;
			}
			this.settings = Object.assign(
				this.defaults,
				this.settings,
				options
			);

			this.stop();

			if (!this.checkCondition()) {
				log.info('Condition check failed, timer will not start', {
					tag: window.self.document.body,
					must_match: this.settings.condition,
				});
				return;
			}

			this.timeout = new Date(Date.now() + this.settings.timeout * 60000);

			this.timer = setInterval(() => this.tick(), 1000);
			this.active = true;

			log.info(
				'Timer initialized',
				this.timeout?.toISOString() || this.timeout.toUTCString()
			);
		}

		stop() {
			if (this.timer) {
				log.info('Stopping timer');
				clearInterval(this.timer);
				this.timer = null;
				this.active = false;
			}
		}

		tick() {
			const now = new Date();
			if (Math.random() > 0.95) {
				log.debug({
					headerLength: Infinity,
					message: [
						'Checking timer (This notice is random to reduce noise)',
						[now.toLocaleString(), this.timeout.toLocaleString()],
					],
				});
			}
			if (now.getTime() > this.timeout.getTime()) {
				this.fire();
			}
		}

		fire() {
			this.stop();

			if (!this.checkCondition()) {
				log.info(
					'Condition check failed, timer will not fire or restart.'
				);
				return;
			}

			// Generate url
			const protocol = w.location.protocol;
			const hostname = w.location.hostname;
			let url = w.location.href.replace(`${protocol}//${hostname}`, '');

			if (url.length < 1) {
				url = '/';
			}

			// Force clear the autoRefreshAdsExclusion list
			if (
				typeof window._CMLS?.clearAutoRefreshAdsExclusion === 'function'
			) {
				window._CMLS.clearAutoRefreshAdsExclusion();
			}

			if (detectPlayer()) {
				log.info('Reloading page through player.');
				navigateThroughPlayer(url);
				return;
			}
			w.location.href = url;
		}

		push(options) {
			log.info('Received request after initialization.', options);
			this.start(options);
		}
	}

	const autoReloadPageInstance = new AutoReloadPage();
	const autoReload = {
		push(options) {
			log.info('Received request', options);
			autoReloadPageInstance.push(options);
		},
	};

	w._CMLS.autoReload = new AutoReloadPage(w._CMLS.autoReload.pop());

	// Stop timer after TG navigates away
	addAfterPageFrame(() => {
		autoReloadPageInstance.stop();
		/*
		if (w?._CMLS?.autoReload instanceof AutoReloadPage) {
			w._CMLS.autoReload.stop();
			delete w._CMLS.autoReload;
		}
		*/
	});
})(window.self);
