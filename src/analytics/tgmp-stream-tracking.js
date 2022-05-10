/**
 * Fire GTM/analytics events on streaem play
 */
import Logger from 'Utils/Logger';
import { push as gtmPush } from 'Utils/GTM';

import { detectPlayer, waitForPlayer } from 'Utils/detectPlayer';

((window, undefined) => {
	const scriptName = 'STREAM TRACKING',
		nameSpace = 'streamTracking',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

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
