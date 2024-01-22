/**
 * Tracks tab visibility changes and fires GTM events
 */
((window, undefined) => {
	const { Logger, GTM, playerTools, tabVisibility } =
		window.__CMLSINTERNAL.libs;
	const { addVisibilityListener, isVisible } = tabVisibility;
	const { addAfterPageFrame } = playerTools;
	const { push: gtmPush } = GTM;
	const scriptName = 'TABVISIBILITY-TO-GTM';
	const nameSpace = 'gtmTabVisibilityEvent';
	const version = '0.2';

	const log = new Logger(`${scriptName} ${version}`);

	let start = Date.now();

	const listenerAbort = new AbortController();
	addVisibilityListener(
		() => {
			const changeTime = Math.round((Date.now() - start) / 10000);
			log.info(
				'Event fired',
				isVisible() === true ? 'visible' : 'hidden',
				changeTime
			);
			gtmPush({
				event: 'page-visibility',
				'page-visible': isVisible() === true ? true : false,
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
