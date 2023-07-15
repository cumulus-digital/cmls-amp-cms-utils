/**
 * Allows a site to opt-in to auto-reloading their homepage on a timer
 *
 * Opt-in with the following code snippet:
 * <script>
 * window._CMLS = window._CMLS || { autoReload: [] };
 * window._CMLS.autoReload.push({ timeout: 8 });
 * </script>
 */
import Logger from 'Utils/Logger';
import {
	detectPlayer,
	getPageWindow,
	addAfterPageFrame,
} from 'Utils/playerTools';
import domReady from 'Utils/domReady';

((window, undefined) => {
	const scriptName = 'AUTO-RELOAD PAGE',
		nameSpace = 'autoReloadPage',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	window._CMLS = window._CMLS || {};

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
			let win = window;
			if (detectPlayer()) {
				win = getPageWindow();
			}
			log.info('Checking condition', this.settings.condition, win.name);
			return win.document.querySelector(this.settings.condition);
		}

		start(options = {}) {
			if (!options instanceof Object) {
				log.error('Received malformed options');
				return;
			}
			this.settings = Object.assign(this.settings, options);

			this.stop();

			if (!this.checkCondition()) {
				log.info('Condition check failed, timer will not start');
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
			if (Date.now() > this.timeout.getTime()) {
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
			const protocol = window.location.protocol;
			const hostname = window.location.hostname;
			let url = window.location.href.replace(
				`${protocol}//${hostname}`,
				''
			);

			if (url.length < 1) {
				url = '/';
			}

			if (detectPlayer()) {
				const win = getPageWindow();
				if (win.tgmp) {
					log.info('Reloading page through TuneGenie Player.');
					win.tgmp.updateLocation(url);
					return;
				}
			}
			window.location.href = url;
		}

		push(options) {
			log.info('Received request after initialization.', options);
			this.start(options);
		}
	}

	domReady(() => {
		if (
			window?._CMLS?.autoReload &&
			window._CMLS.autoReload instanceof Array &&
			window._CMLS.autoReload.length
		) {
			window._CMLS.autoReload = new AutoReloadPage(
				window._CMLS.autoReload.pop()
			);
		} else {
			window._CMLS = window._CMLS || {};
			window._CMLS.autoReload = new AutoReloadPage();
		}
	});

	// Stop timer after TG navigates away
	addAfterPageFrame(() => {
		if (window?._CMLS?.autoReload instanceof AutoReloadPage) {
			window._CMLS.autoReload.stop();
		}
	});
})(window.self);
