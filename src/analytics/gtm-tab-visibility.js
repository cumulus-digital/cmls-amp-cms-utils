/**
 * Tracks tab visibility changes and fires GTM events
 */
import Logger from 'Utils/Logger';
import { addVisibilityListener, isVisible } from 'Utils/tabVisibility';
import { addAfterPageFrame } from 'Utils/detectPlayer';
import { push as gtmPush } from 'Utils/GTM';

((window, undefined) => {
	const scriptName = 'GTM TAB VISIBILITY EVENT',
		nameSpace = 'gtmTabVisibilityEvent',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	let start = Date.now();

	const listenerAbort = new AbortController();
	addVisibilityListener(
		() => {
			const changeTime = Math.round((Date.now() - start) / 10000);
			log.info(
				'Event fired',
				isVisible() ? 'visible' : 'hidden',
				changeTime
			);
			gtmPush({
				event: 'page-visibility',
				'page-visible': isVisible(),
				'page-visible-time-change': changeTime,
			});
			start = Date.now();
		},
		{
			signal: listenerAbort.signal,
		}
	);
	addAfterPageFrame(() => {
		listenerAbort.abort();
	});
})(window.self);
