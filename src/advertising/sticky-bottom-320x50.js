/**
 * Send global targeting (cms-sgroups) values as GTM events
 */
import Logger from 'Utils/Logger';
import createElement from 'Utils/createElement';
import { waitForPlayer } from 'Utils/playerTools';
import domReady from 'Utils/domReady';

((window) => {
	const scriptName = 'STICKY-BOTTOM-320x50',
		nameSpace = 'stickyBottomAd',
		version = '0.1',
		elementId = 'CmlsStickyBottom';

	const log = new Logger(`${scriptName} ${version}`);

	window._CMLS = window._CMLS || {};
	window._CMLS[nameSpace] = {
		inject: () => {
			if (window.self.document.getElementById(elementId)) {
				log.info('Sponsor ad slot already injected');
				return;
			}

			// Don't inject on smaller screens
			if (window.matchMedia('(max-width: 800px)').matches) {
				log.info('Device width is too narrow, exiting.');
				return;
			}

			let css = `
				#${elementId}-wrapper {
					background: rgba(0,0,0,0.5);
					display: flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					position: fixed;
					z-index: 2147483647;
					left: 0;
					bottom: 0;
					width: 100%;
					height: auto;
					pointer-events: none;
				}
					#${elementId} {
						display: flex;
						align-items: center;
						justify-content: center;
						box-sizing: border-box;
						width: fit-content;
						height: fit-content;
						pointer-events: all;
					}
					#${elementId} > div {
						display: flex;
						align-items: center;
						justify-content: center;
						width: fit-content;
						height: fit-content;
					}

				.cmls-player-tunegenie #${elementId}-wrapper {
					bottom: 65px;
				}
					.cmls-player-tunegenie #${elementId} {
						padding: 5px;
					}
				@media (min-width: 800px) {
					.cmls-player-tunegenie #${elementId}-wrapper {
						background: transparent;
						max-width: 1120px;
						height: 65px;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						padding-right: 175px;
						padding-bottom: 2px;
						justify-content: end;
					}
						.cmls-player-tunegenie #${elementId} {
							padding: 0;
						}
						.cmls-player-tunegenie #${elementId},
						.cmls-player-tunegenie #${elementId} > div {
							justify-content: end;
						}
				}
			`;

			createElement;
			const styleEl = createElement.el('style', {
				id: `${elementId}Style`,
			});
			styleEl.innerHTML = css;
			window.document.body.appendChild(styleEl);

			const wrapper = createElement.el('div', {
				id: `${elementId}-wrapper`,
			});
			const div = createElement.el('div', { id: elementId });

			wrapper.appendChild(div);
			window.document.body.appendChild(wrapper);

			window._CMLS.adTag.queue(() => {
				log.info('Defining slot', elementId);
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
						[],
						/*
						[
							[300, 50],
							[320, 50],
						],
						*/
					],
				];

				window._CMLS.adTag
					.defineSlot({
						adUnitPath: window._CMLS.adPath,
						size: [
							[120, 60],
							[300, 50],
							[320, 50],
						],
						div: elementId,
						collapse: true,
						targeting: {
							pos: 'playersponsorlogo',
						},
						prebid: true,
					})
					.defineSizeMapping(sizeMap);

				window._CMLS.adTag.display(
					elementId,
					window._CMLS.adTag.isInitialLoadDisabled()
				);
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

	waitForPlayer().then(() => {
		window._CMLS[nameSpace].init();
	});
})(window.self);
