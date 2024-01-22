const { Logger, playerTools } = window.__CMLSINTERNAL.libs;
const {
	detectPlayer,
	waitForPlayer,
	navigateThroughPlayer,
	addAfterPageFrame,
} = playerTools;

const scriptName = 'SOCIAL LISTEN LIVE LINK';
const nameSpace = 'socialListenLive';
const version = '0.2';
const log = new Logger(`${scriptName} ${version}`);

(($, window, undefined) => {
	const selectors = [
		'.block-type-social a:has([alt="Listen Live!!"])',
		'.block-type-social a:has([title="Listen Live!!"])',
		'.block-type-social a[alt="Listen Live!!"]',
		'.block-type-social a[title="Listen Live!!"]',
		'.nav-listenlive a, .nav-listenlive img',
		'.cmlistenlive-start',
	];

	waitForPlayer().then(() => {
		log.debug('Attaching click listener to our selectors', selectors);
		$(window.document.body)
			.off(`click.${nameSpace}`)
			.on(`click.${nameSpace}`, selectors.join(','), (e) => {
				const player = detectPlayer();
				if (!player) {
					log.warn('No player detected!');
					return;
				}

				if (player === 'cumulus' && window.cmls_player.play) {
					e.preventDefault();
					log.info('Caught a listen live request');
					window.cmls_player.play();
					return;
				}

				if (player === 'tunegenie') {
					e.preventDefault();
					log.info('Caught a listen live request');
					window._CMLS.switchStream({
						brand: window.top?.tgmp_default_brand,
						theme: window.top?.tgmp_default_theme,
						autostart: true,
					});
					return;
				}
			});
		addAfterPageFrame(() => {
			$(window).off(`click.${nameSpace}`);
		});
	});
})(jQuery, window.self);
