/**
 * On old CMS sites, allows a button in the masthead social links
 * to start the TG player via an alt, title, or class attribute
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
	const scriptName = 'SOCIAL LISTEN LIVE LINK',
		nameSpace = 'socialListenLive',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	if (!$) {
		log.warn('jQuery not available');
		return;
	}

	const selectors = [
		'.block-type-social a:has([alt="Listen Live!!"])',
		'.block-type-social a:has([title="Listen Live!!"])',
		'.block-type-social a[alt="Listen Live!!"]',
		'.block-type-social a[title="Listen Live!!"]',
		'.nav-listenlive a, .nav-listenlive img',
		'.cmlistenlive-start',
	];

	domReady(() => {
		waitForPlayer().then(() => {
			log.info('Attaching click listener to our selectors', selectors);
			$(window.document.body)
				.off(`click.${nameSpace}`)
				.on(`click.${nameSpace}`, selectors.join(','), (e) => {
					if (detectPlayer()) {
						e.preventDefault();
						if (
							window.top?.tgmp_default_brand &&
							window.top?.tgmp?.options?.brand !==
								window.top?.tgmp_default_brand
						) {
							window.top.tgmp.update({
								brand: window.top.tgmp_default_brand,
								theme: window.top?.tgmp_default_theme,
								//autostart: true,
							});
						}
						log.info('Caught a listen live request');
						window.tgmp.playStream();
					}
				});
			addAfterPageFrame(() => {
				$(window).off(`click.${nameSpace}`);
			});
		});
	});
})(window?.jQuery, window.self);
