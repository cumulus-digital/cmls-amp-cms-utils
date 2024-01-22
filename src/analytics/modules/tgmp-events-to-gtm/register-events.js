/**
 * Fire GTM/analytics events on streaem play
 */
((window, undefined) => {
	const { Logger, GTM, playerTools } = window.__CMLSINTERNAL.libs;
	const { detectPlayer, waitForPlayer } = playerTools;
	const { push: gtmPush } = GTM;
	const scriptName = 'TGMP-EVENTS-TO-GTM';
	const nameSpace = 'streamTracking';
	const version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	waitForPlayer().then(() => {
		if (
			window.tgmp?.TGMP_EVENTS?.streamplaying &&
			!window.__CMLSINTERNAL[nameSpace]
		) {
			window.__CMLSINTERNAL[nameSpace] = window.tgmp.addEventListener(
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
