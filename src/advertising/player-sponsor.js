/**
 * Send global targeting (cms-sgroups) values as GTM events
 */
import Logger from 'Utils/Logger';
import { waitForPlayer, isInIframe } from 'Utils/playerTools';
import domReady from 'Utils/domReady';

((window) => {
	const scriptName = 'PLAYER-SPONSOR',
		nameSpace = 'playerSponsor',
		version = '0.2',
		elementId = 'CMLSPlayerSponsorship';
	let zIndexInterval = null;

	const log = new Logger(`${scriptName} ${version}`);

	/**
	 * If we're not the top window, assume we're on a second click in
	 * the TuneGenie iframe and activate or refresh the sponsor adtag
	 * in the parent window.
	 */
	if (isInIframe()) {
		log.info('Inside iframe, checking for parent slot');
		if (!window.top?._CMLS?.[nameSpace]) {
			log.info(`${nameSpace} does not exist in top window!`);
			return;
		}
		if (!window.top.document.getElementById(elementId)) {
			log.info('Initializing in parent');
			window.top._CMLS[nameSpace].init();
			return;
		}
		log.info('Refreshing parent window slot');
		if (window.top?._CMLS?.adPath) {
			window.top._CMLS.adPath.refresh(window.top._CMLS[nameSpace].slot);
		} else {
			window.top.addEventListener('cmls-adpath-discovered', () => {
				window.top._CMLS.adPath.refresh(
					window.top._CMLS[nameSpace].slot
				);
			});
		}
		//window.parent._CMLS[nameSpace].init();
		return;
	}

	window._CMLS = window._CMLS || {};
	window._CMLS[nameSpace] = {
		slot: null,
		inject: () => {
			const me = this;
			waitForPlayer().then(() => {
				if (window.top.document.getElementById(elementId)) {
					log.info('Sponsor ad is already injected.');
					return;
				}

				// Don't inject on smaller screens
				/*
				if (window.matchMedia('(max-width: 800px)').matches) {
					log.info('Device width is too narrow, exiting.');
					return;
				}
				*/

				const playerFrame = window.document.querySelector(
					'iframe[name="pwm_bar"]'
				);
				if (!playerFrame) {
					log.info('Could not determine player frame.');
					return;
				}

				const injectPoint = playerFrame.parentNode;
				if (!injectPoint) {
					log.info('Injection point could not be found.');
					return;
				}

				// Append styles for positioning ad slot
				const styleEl = window.document.createElement('style');
				styleEl.id = `${elementId}Style`;
				styleEl.innerHTML = `
						#${elementId}-wrapper {
							box-sizing: border-box;
							position: fixed;
							z-index: 200000;
							width: 100%;
							max-width: 1120px;
							height: 65px;
							bottom: 0;
							left: 50%;
							transform: translateX(-50%);
							padding-right: 175px;
							padding-bottom: 3px;
							pointer-events: none;
							display: flex;
							align-items: center;
							justify-content: end;
						}
							#${elementId} {
								pointer-events: all;
								width: fit-content;
								height: fit-content;
								display: flex;
								align-items: center;
								justify-content: end;
							}
							#${elementId} > div {
								width: fit-content;
								height: fit-content;
								display: flex;
								align-items: center;
								justify-content: end;
							}
							@media (max-width: 800px) {
								#${elementId}-wrapper {
									bottom: 65px;
									left: 0;
									transform: none;
									padding-right: 0;
									padding-bottom: 0;
								}
							}
					`;
				injectPoint.appendChild(styleEl);

				// Inject ad slot
				const wrapper = window.top.document.createElement('div');
				wrapper.id = `${elementId}-wrapper`;
				const div = window.top.document.createElement('div');
				div.id = elementId;
				wrapper.appendChild(div);
				injectPoint.appendChild(wrapper);

				window._CMLS.adTag.queue(() => {
					log.info('Defining slot', elementId);
					/*
					window._CMLS.adTag.defineSlot(
						[window._CMLS.adPath, [120, 60], elementId],
						true,
						{ pos: 'playersponsorlogo' },
						true
					);
					*/
					let sizeMap = [
						[
							[800, 0],
							[
								[120, 60],
								[300, 50],
								[320, 50],
							],
						],
						[
							[0, 0],
							[
								[300, 50],
								[320, 50],
							],
						],
					];
					me.slot = window._CMLS.adTag.defineSlot({
						adUnitPath: window._CMLS.adPath,
						size: [
							[120, 60],
							[300, 50],
							[320, 50],
						],
						sizeMap: sizeMap,
						div: elementId,
						collapse: true,
						targeting: {
							pos: 'playersponsorlogo',
							noprebid: 'noprebid',
						},
						prebid: true,
					});

					if (!me.slot) {
						log.warn('Error defining slot!');
					}

					window._CMLS.adTag.display(
						elementId,
						window._CMLS.adTag.isInitialLoadDisabled()
					);
					zIndexInterval = setTimeout(() => {
						const playerBar = window.document.querySelector(
							'#' + window.top?.tgmp?.divId
						);
						if (playerBar) {
							const slotDiv = window.document.querySelector(
								`#${elementId}-wrapper`
							);
							let zIndex =
								window.getComputedStyle(playerBar).zIndex + 1;
							if (zIndex > 2147483647) {
								zIndex = 2147483647;
							}
							slotDiv.style.zIndex = zIndex;
						}
					}, 2000);
				});
			});
		},
		init: () => {
			domReady(() => {
				if (window?._CMLS?.adPath) {
					window._CMLS[nameSpace].inject();
				} else {
					window.addEventListener('cmls-adpath-discovered', () =>
						window._CMLS[nameSpace].inject()
					);
				}
			});
		},
	};

	window._CMLS[nameSpace].init();
})(window.self);
