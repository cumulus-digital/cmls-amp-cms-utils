/**
 * Easily create links which switch the stream in the TG player bar
 * using classes, alt attribute, or url parameters on the element.
 *
 * Keywords:
 * tgmp-switchstream    Enables the action
 * tgmp-streamid-XXXX   Stream ID ("XXXX") to switch to
 * tgmp-autostart       Optional. Attempt to auto-start the new stream
 * tgmp-theme-######    Optional. Color theme to apply to new streeam
 *
 * Example:
 * <a href="#" class="tgmp-switchstream tgmp-streamid-wxyz tgmp-theme-550000 tgmp-autostart">Switch Stream</a>
 */
import Logger from 'Utils/Logger';
import {
	detectPlayer,
	waitForPlayer,
	navigateThroughPlayer,
	addAfterPageFrame,
} from 'Utils/playerTools';
import domReady from '../utils/domReady';

(($, window, undefined) => {
	const scriptName = 'TGMP SWITCHSTREAM',
		nameSpace = 'tgmpSwitchStream',
		version = '0.2';

	const log = new Logger(`${scriptName} ${version}`);

	if (!$) {
		log.warn('jQuery not available');
		return;
	}

	const selectors = [
		'.tgmp-switchstream',
		'[alt*="tgmp-switchstream"]',
		'[href*="tgmp-switchstream"]',
	];

	/**
	 * Determine the source attribute for config
	 * @param {Element} el
	 */
	const getCommandSource = (el) => {
		const key = 'tgmp-switchstream';
		if (el.className.includes(key)) {
			return 'class';
		}
		if (el.getAttribute('alt')?.includes(key)) {
			return 'alt';
		}
		if (el.href?.includes(key)) {
			return 'href';
		}
	};

	const parseCommand = (el, attr) => {
		const command = {
			brand: '',
			theme: '',
			autostart: false,
		};
		const options = el.getAttribute(attr);
		let brandTest = options.match(/tgmp\-streamid\-([a-z0-9]+)/i),
			themeTest = options.match(/tgmp\-theme-([\#a-z0-9]+)/i),
			autostartTest = options.match(/tgmp\-autostart/i);
		if (brandTest.length > 1) {
			command.brand = brandTest.pop();
		}
		if (themeTest.length > 1) {
			command.theme = themeTest.pop();
		}
		if (autostartTest) {
			command.autostart = true;
		}
		return command;
	};

	window._CMLS = window._CMLS || {};
	window._CMLS.switchStream = (
		brand = '',
		theme = '',
		autostart = true,
		userInitStart = 'true'
	) => {
		if (Object.prototype.toString.call(brand) === '[object Object]') {
			userInitStart = brand?.userInitStart || userInitStart;
			autostart = brand?.autostart || autostart;
			theme = brand?.theme || theme;
			brand = brand?.brand;
		}
		if (autostart === false) {
			userInitStart = 'false';
		}

		window.top.tgmp_default_brand =
			window.top.tgmp_default_brand ||
			'' + window.top?.tgmp?.options?.brand;
		window.top.tgmp_default_theme =
			window.top.tgmp_default_theme || window.top?.tgmp?.options?.theme;

		if (!brand) {
			brand = window.top.tgmp_default_brand;
		}
		if (!theme) {
			theme = window.top.tgmp_default_theme || ['#000'];
		}

		log.info({ brand, theme, userInitStart });
		if (detectPlayer() && typeof window?.tgmp?.update === 'function') {
			window.tgmp.update({ brand, theme, userInitStart });
			/*
			if (autostart || userInitStart === 'true') {
				window.tgmp.playStop;
				log.info('Auto-starting stream.');
				setTimeout(function () {
					window.tgmp.playStream();
				}, 200);
			}
			*/
		}
	};
	// Backwards compatibility
	window._CMLS.switchTGMPStream = (
		id = '',
		autostart = false,
		theme = ''
	) => {
		window._CMLS.switchStream(id, theme, autostart);
	};

	domReady(() => {
		waitForPlayer().then(() => {
			window.top.tgmp_default_brand =
				window.top.tgmp_default_brand ||
				'' + window.top?.tgmp?.options?.brand;
			window.top.tgmp_default_theme =
				window.top.tgmp_default_theme ||
				window.top?.tgmp?.options?.theme;

			const triggers = selectors.join(',');
			log.info('Attaching click handler to our selectors.', selectors);
			$(window.document.body)
				.off(`click.${nameSpace}`)
				.on(`click.${nameSpace}`, triggers, (e) => {
					if (detectPlayer()) {
						e.preventDefault();
						const attr = getCommandSource(e.currentTarget);
						log.info('Caught click', e, triggers, attr);
						if (attr) {
							const command = parseCommand(e.currentTarget, attr);
							log.info('Received command', command);
							window._CMLS.switchStream(command);
							/*
							if (typeof window?.tgmp?.update === 'function') {
								log.info('Executing command', command);
								window.tgmp.update(command);
							}
							*/
						}
					}
				});

			// Remove listener after pageFrame builds
			addAfterPageFrame(() => {
				$(window).off(`click.${nameSpace}`);
			});
		});
	});
})(window?.jQuery, window.self);
