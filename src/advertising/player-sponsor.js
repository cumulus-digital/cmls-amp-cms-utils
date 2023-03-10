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
	 * the TuneGenie iframe and activate the sponsor adtag in the parent window.
	 */
	if (isInIframe()) {
		log.info('Inside iframe, will assume parent has taken care of this.');
		//window.parent._CMLS[nameSpace].init();
		return;
	}

	window._CMLS = window._CMLS || {};
	window._CMLS[nameSpace] = {
		inject: () => {
			waitForPlayer().then(() => {
				if (window.top.document.getElementById(elementId)) {
					log.info('Sponsor ad is already injected.');
					return;
				}

				// Don't inject on smaller screens
				if (window.matchMedia('(max-width: 800px)').matches) {
					log.info('Device width is too narrow, exiting.');
					return;
				}

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
						#${elementId} {
							position: fixed;
							z-index: 200000;
							width: 120px;
							height: 60px;
							bottom: 4px;
							left: 50%;
							transform: translateX(+275px);
						}
							@media (max-width: 1120px) {
								#${elementId} {
									left: auto;
									right: 160px;
									transform: none;
								}
							}
					`;
				injectPoint.appendChild(styleEl);

				// Inject ad slot
				const div = window.top.document.createElement('div');
				div.id = elementId;
				injectPoint.appendChild(div);

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
					window._CMLS.adTag.defineSlot({
						adUnitPath: window._CMLS.adPath,
						size: [[120, 60]],
						div: elementId,
						collapse: true,
						targeting: {
							pos: 'playersponsorlogo',
							noprebid: 'noprebid',
						},
						prebid: false,
					});
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
								`#${elementId}`
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
