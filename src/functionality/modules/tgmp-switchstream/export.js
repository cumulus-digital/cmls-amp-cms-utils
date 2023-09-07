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
(($, window, undefined) => {
	const { detectPlayer, waitForPlayer, addAfterPageFrame } =
		window._CMLS.libs.playerTools;
	const domReady = window._CMLS.libs.domReady;

	const scriptName = 'TGMP SWITCHSTREAM';
	const nameSpace = 'tgmpSwitchStream';
	const version = '0.6';

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	const initSelectors = [
		'.tgmp-switchstream',
		'.tgmp-switchstream a',
		'[alt*="tgmp-switchstream"]',
		'[alt*="tgmp-switchstream"] a',
		'[href*="tgmp-switchstream"]',
		'[href*="tgmp-switchstream"] a',
	];

	class SwitchStreamHandler {
		key = 'tgmp-switchstream';

		constructor() {
			window.top.tgmp_default_brand =
				window.top.tgmp_default_brand ||
				'' + window.top?.tgmp?.options?.brand;
			window.top.tgmp_default_theme =
				window.top.tgmp_default_theme ||
				'' + window.top?.tgmp?.options?.theme;
		}

		getCommandSource(el) {
			if (el?.className?.includes(this.key)) {
				return 'class';
			}
			if (el?.getAttribute('alt')?.includes(this.key)) {
				return 'alt';
			}
			if (el?.href?.includes(key)) {
				return 'href';
			}
			return false;
		}

		parseCommand(el) {
			const source = this.getCommandSource(el);
			if (!source) {
				return false;
			}
			const command = {
				brand: '',
				theme: '',
				autostart: false,
			};
			const options = el.getAttribute(source);
			let brandTest = options.match(/tgmp\-streamid\-([a-z0-9]+)/i),
				themeTest = options.match(/tgmp\-theme-([\#a-z0-9]+)/i),
				autostartTest = options.match(/tgmp\-autostart/i);
			if (brandTest?.length > 1) {
				command.brand = brandTest.pop();
			}
			if (themeTest?.length > 1) {
				command.theme = themeTest.pop();
			}
			if (autostartTest) {
				command.autostart = true;
			}
			return command;
		}

		switch(
			brand = '',
			theme = '',
			autostart = true,
			userInitStart = 'true'
		) {
			if (!detectPlayer() && typeof window?.tgmp?.update !== 'function') {
				log.warn(
					'Switch stream request received without initialized player.'
				);
				return;
			}

			if (Object.prototype.toString.call(brand) === '[object Object]') {
				userInitStart = brand?.userInitStart || userInitStart;
				autostart = brand?.autostart || autostart;
				theme = brand?.theme || theme;
				brand = brand?.brand;
			}
			if (autostart === false) {
				userInitStart = 'false';
			}
			if (!brand) {
				brand = window.top.tgmp_default_brand;
			}
			if (!theme) {
				theme = window.top.tgmp_default_theme;
			}

			log.info('Received stream switch request', {
				brand,
				theme,
				userInitStart,
			});
			window.tgmp.update({ brand, theme, userInitStart });
		}
	}

	if (!$) {
		log.warn('jQuery not available');
		return;
	}

	window._CMLS.switchStreamInstance = new SwitchStreamHandler();
	window._CMLS.switchStream = window._CMLS.switchStreamInstance.switch;
	// Backwards compatibility:
	window._CMLS.switchTGMPStream = (
		id = '',
		autostart = false,
		theme = ''
	) => {
		window._CMLS.switchStream(id, theme, autostart);
	};

	waitForPlayer().then(() => {
		$(window.document.body)
			.off(`click.${nameSpace}`)
			.on(`click.${nameSpace}`, initSelectors.join(','), (e) => {
				if (detectPlayer()) {
					e.preventDefault();
					const command =
						window._CMLS.switchStreamInstance.parseCommand(
							e.currentTarget
						);
					if (command) {
						log.info('Received command', command);
						window._CMLS.switchStream(command);
					}
				}
			});

		addAfterPageFrame(() => {
			$(window.document.body).off(`click.${nameSpace}`);
		});
	});
})(window?.jQuery, window.self);
