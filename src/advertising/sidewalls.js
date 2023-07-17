/**
 * Injects "sidewall" ad units
 * Generates and injects two ad units which flank the content area when
 * the device width is large enough to display them.
 */
import Logger from 'Utils/Logger';
import createElement from 'Utils/createElement';
import domReady from '../utils/domReady';

((window, undefined) => {
	const scriptName = 'SIDEWALL ADS',
		nameSpace = 'sidewallAds',
		version = '2.0';

	const log = new Logger(`${scriptName} ${version}`);

	const injectPoint = '.wrapper-content, body > .wp-site-blocks > header + *',
		spacingPoint = '.wrapper-content > .grid-container > *:first-child',
		containerId = 'cmls-sidewalls',
		containerClass = 'cmls-sidewalls',
		sidewallClass = 'cmls-sidewall',
		/**
		 * Width of content area in pixels
		 * @type {Number}
		 */
		contentWidth = 1100;

	let topPad = '0';

	window._CMLS = window._CMLS || {};

	if (!window._CMLS?.[nameSpace]) {
		window._CMLS[nameSpace] = {
			container: null,
			slots: [],
			inject: () => {
				if (window.document.getElementById(containerId)) {
					log.info('Sidewall container already injected.');
					return;
				}

				if (window.NO_SIDEWALLS) {
					log.info('NO_SIDEWALLS configured, exiting.');
					return;
				}

				if (window?._CMLS?.disabled?.sideWalls) {
					log.info('_CMLS.disabled.sideWalls configured, exiting.');
					return;
				}

				if (
					window.document.querySelector(
						'.takeover-left div[id^="div-gpt"],.takeover-right div[id^="div-gpt"],.skyscraper-left div[id^="div-gpt"],.skyscraper-right div[id^="div-gpt"]'
					)
				) {
					log.info('Legacy skyscrapers exist, exiting.');
					return;
				}

				const injectPointNode =
						window.document.querySelector(injectPoint),
					spacingPointNode =
						window.document.querySelector(spacingPoint);

				if (!injectPointNode) {
					log.info('Injection point not found, exiting.');
					return;
				}

				if (
					window.matchMedia(`(max-width: ${contentWidth + 600}px)`)
						.matches
				) {
					log.info('Device width is too narrow, exiting.');
					return;
				}

				const injectPointStyle =
					window.getComputedStyle(injectPointNode);

				// Get distance from header on headway sites
				if (spacingPointNode) {
					const placeBox = spacingPointNode.getBoundingClientRect(),
						distanceBox = injectPointNode.getBoundingClientRect();
					topPad = placeBox.top - distanceBox.top + 'px';
				}

				log.info('Injecting');

				if (
					!injectPointStyle?.position ||
					injectPointStyle.position.toLowerCase() === 'static'
				) {
					injectPointNode.style.position = 'relative';
				}

				let css = `
						.wrapper-header .takeover-right, .wrapper-header .takeover-left,
						.wrapper-header .skyscraper-right, .wrapper-header .skyscraper-left {
							display: none !important;
						}
						.${containerClass} {
							position: absolute;
							left: 50%;
							top: 0;
							width: ${contentWidth}px;
							height: 100%;
							transform: translateX(-50%);
							display: flex;
							justify-content: space-between;
							box-sizing: border-box;
							padding: ${topPad} 10px;
							z-index: 2;
							pointer-events: none
						}
						stn-player .player {
							z-index: 99999
						}
						.${sidewallClass} {
							position: sticky;
							top: ${topPad};
							width: fit-content;
							height: fit-content;
							pointer-events: all
						}
						#cmls-sidewall-left {
							transform: translateX(-100%);
						}
						#cmls-sidewall-right {
							margin-left: auto;
							transform: translateX(100%);
						}
					`;

				if (!window.document.getElementById(`${containerId}Style`)) {
					const styleEl = createElement.el('style', {
						id: `${containerId}Style`,
					});
					styleEl.innerHTML = css;
					injectPointNode.appendChild(styleEl);
				}

				const wrapper = createElement.el('div', {
					id: containerId,
					class: containerClass,
				});
				const leftDiv = createElement.el('div', {
					id: 'cmls-sidewall-left',
					class: sidewallClass,
				});
				const rightDiv = createElement.el('div', {
					id: 'cmls-sidewall-right',
					class: sidewallClass,
				});
				wrapper.appendChild(leftDiv);
				wrapper.appendChild(rightDiv);
				injectPointNode.appendChild(wrapper);
			},
			display: () => {
				// Create slots!
				window._CMLS.adTag.queue(() => {
					let sizeMap = [
						// WidthxHeight can support up to 300x600
						[
							[contentWidth + 300, 0],
							[
								[160, 600],
								[300, 600],
							],
						],

						// WidthxHeight can only support 160x600
						[[contentWidth + 160, 0], [[160, 600]]],

						// Height can only support 300x250
						// Disabled for now...
						// [[contentWidth + 300, 0], [[300, 250]]],

						// No sidewalls otherwise.
						[[0, 0], []],
					];

					const slotCommon = {
						adUnitPath: `${window._CMLS.adPath}/sidewallLeft`,
						size: [
							[160, 600],
							[300, 600],
						],
						sizeMap: sizeMap,
						div: 'cmls-sidewall-left',
						collapse: true,
						targeting: {
							pos: 'left',
						},
						prebid: true,
					};

					log.info('Defining slot cmlsSidewallLeft');
					window._CMLS.adTag.defineSlot(slotCommon);

					log.info('Defining slot cmls-sidewall-right');
					window._CMLS.adTag.defineSlot({
						...slotCommon,
						adUnitPath: `${window._CMLS.adPath}/sidewallRight`,
						div: 'cmls-sidewall-right',
						targeting: {
							pos: 'right',
						},
					});

					if (window.GPT_SITE_SLOTS['cmls-sidewall-left']) {
						log.info('Calling display for cmls-sidewall-left');
						window._CMLS.adTag.display(
							'cmls-sidewall-left',
							window._CMLS.adTag.isInitialLoadDisabled()
						);
					}
					if (window.GPT_SITE_SLOTS['cmls-sidewall-right']) {
						log.info('Calling display for cmls-sidewall-right');
						window._CMLS.adTag.display(
							'cmls-sidewall-right',
							window._CMLS.adTag.isInitialLoadDisabled()
						);
					}
				});
			},
			init: () => {
				domReady(() => {
					window._CMLS[nameSpace].inject();
					if (window._CMLS.adPath) {
						window._CMLS[nameSpace].display();
					} else {
						window.addEventListener(
							'cmls-adpath-discovered',
							() => {
								window._CMLS[nameSpace].display();
							}
						);
					}
				});
			},
		};
	}

	window._CMLS[nameSpace].init();
})(window.self, undefined);
