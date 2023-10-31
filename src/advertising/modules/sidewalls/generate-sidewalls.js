/**
 * Injects "sidewall" ad units
 * Generates and injects two ad units which flank the content area when
 * the device width is large enough to display them.
 */
import { areSidewallsAllowed } from './shouldImport';
import config from './config.json';
//import './styles.scss';

((window, undefined) => {
	const { h, domReady } = window._CMLS.libs;

	const {
		scriptName,
		nameSpace,
		version,
		injectPoint,
		spacingPoint,
		containerId,
		containerClass,
		sidewallClass,
		contentWidth,
	} = config;
	let { topPad } = config;

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	window._CMLS = window._CMLS || {};

	if (!window._CMLS?.[nameSpace]) {
		window._CMLS[nameSpace] = {
			container: null,
			slots: [],
			isDisabled: () => {
				if (!areSidewallsAllowed()) {
					return true;
				}

				const injectPointNode =
					window.document.querySelector(injectPoint);

				if (!injectPointNode) {
					log.info('Injection point not found, exiting.');
					return true;
				}

				if (
					window.matchMedia(`(max-width: ${contentWidth + 320}px)`)
						.matches
				) {
					log.info('Device width is too narrow, exiting.');
					return true;
				}

				return false;
			},
			inject: () => {
				if (window.document.getElementById(containerId)) {
					log.info('Sidewall container already injected.');
					return;
				}

				if (window._CMLS[nameSpace].isDisabled()) {
					return;
				}

				const injectPointNode =
						window.document.querySelector(injectPoint),
					spacingPointNode =
						window.document.querySelector(spacingPoint),
					injectPointStyle = window.getComputedStyle(injectPointNode);

				// Get distance from header on headway sites
				if (spacingPointNode) {
					const placeBox = spacingPointNode.getBoundingClientRect(),
						distanceBox = injectPointNode.getBoundingClientRect();
					topPad = placeBox.top - distanceBox.top;
					if (topPad < 0 || topPad > 50) {
						topPad = 15;
					}
				}

				log.info('Injecting');

				if (
					!injectPointStyle?.position ||
					injectPointStyle.position.toLowerCase() === 'static'
				) {
					injectPointNode.style.position = 'relative';
				}

				const style = import(
					/* webpackPreload: true, webpackChunkName: 'advertising/sidewalls/style' */
					'./styles.scss'
				).then((style) => {
					if (style?.default?.use)
						style.default.use({ target: injectPointNode });
				});
				/*
				if (!window.document.getElementById(`${scriptName}-style`)) {
					const css = createElement.el('link', {
						rel: 'stylesheet',
						id: `${scriptName}-style`,
						href:
							window._CMLS.scriptUrlBase +
							'/advertising/sidewalls.css',
					});
					injectPointNode.append(css);
				}
				*/
				const wrapper = (
					<div
						id={containerId}
						style={topPad ? `--top_pad: ${topPad}px` : null}
					>
						<div
							id={`${sidewallClass}-left`}
							class={sidewallClass}
						/>
						<div
							id={`${sidewallClass}-right`}
							class={sidewallClass}
						/>
					</div>
				);

				/*
				if (topPad) {
					log.info('TOPPAD', topPad);
					wrapper.style.setProperty('--top_pad', topPad + 'px');
				}
				*/

				injectPointNode.appendChild(wrapper);
			},
			display: () => {
				if (window._CMLS[nameSpace].isDisabled()) {
					return;
				}

				// Create slots!
				window._CMLS.adTag.queue(() => {
					let sizeMap = [
						// WidthxHeight can support up to 300x600
						[
							[contentWidth + 600, 0],
							[
								[160, 600],
								[300, 600],
							],
						],

						// WidthxHeight can only support 160x600
						[[contentWidth + 320, 0], [[160, 600]]],

						// Height can only support 300x250
						// Disabled for now...
						// [[contentWidth + 300, 0], [[300, 250]]],

						// No sidewalls otherwise.
						[[0, 0], []],
					];

					const slotCommon = {
						adUnitPath: `${window._CMLS.adPath}/sidewallLeft`,
						size: [[160, 600]],
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
					if (!window._CMLS[nameSpace].isDisabled()) {
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
					}
				});
			},
		};
	}

	window._CMLS[nameSpace].init();
})(window.self);
