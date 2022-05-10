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
		version = '0.1';

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
	window._CMLS.switchStream = (brand = '', theme = '', autostart = true) => {
		log.info({ brand, theme, autostart });
		if (detectPlayer() && typeof window?.tgmp?.update === 'function') {
			window.tgmp.update({ brand, theme, autostart });
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
			$(window)
				.off(`click.${nameSpace}`)
				.on(`click.${nameSpace}`, (e) => {
					if (!detectPlayer()) {
						return;
					}
					if (e.target.matches(triggers)) {
						e.preventDefault();
						const attr = getCommandSource(e.target);
						if (attr) {
							const command = parseCommand(e.target, attr);
							log.info('Received command click', command);
							if (typeof window?.tgmp?.update === 'function') {
								window.tgmp.update(command);
							}
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
