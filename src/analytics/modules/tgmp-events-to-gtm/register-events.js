/**
 * Fire GTM/analytics events on streaem play
 */
((window, undefined) => {
	const { detectPlayer, waitForPlayer } = window._CMLS.libs.playerTools;
	const { push: gtmPush } = window._CMLS.libs.GTM;
	const scriptName = 'TGMP-EVENTS-TO-GTM';
	const nameSpace = 'streamTracking';
	const version = '0.1';

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	waitForPlayer().then(() => {
		if (
			window.tgmp?.TGMP_EVENTS?.streamplaying &&
			!window._CMLS[nameSpace]
		) {
			window._CMLS[nameSpace] = window.tgmp.addEventListener(
				window.top.TGMP_EVENTS.streamplaying,
				(e) => {
					if (e === true) {
						log.info('Stream started');
						gtmPush({ event: 'siteplayer-stream-playing' });
					} else if (e === false) {
						log.info('Stream stopped.');
						gtmPush({ event: 'siteplayer-stream-stopped' });
					}
				}
			);
		}
	});
})(window.top);
