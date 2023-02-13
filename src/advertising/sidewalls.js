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
		nameSpace = 'sideWallInjector',
		version = '0.1',
		injectPoint = '.wrapper-content, body > .wp-site-blocks > header + *',
		elementClass = 'cmls-sidewalls',
		contentWidth = '1070px',
		sizeMapBuffer = 400,
		doc = window.document;

	const log = new Logger(`${scriptName} ${version}`);

	domReady(() => {
		if (window?.freestar?.queue) {
			log.info('Freestar enabled, exiting.');
			return;
		}

		if (
			doc.querySelector(
				'.takeover-left div[id^="div-gpt"],.takeover-right div[id^="div-gpt"],.skyscraper-left div[id^="div-gpt"],.skyscraper-right div[id^="div-gpt"]'
			)
		) {
			log.info('Legacy skyscrapers exist, exiting.');
			return;
		}

		if (doc.querySelector(`.${elementClass}`)) {
			log.info('Tags already exists, exiting.');
			return;
		}

		if (!doc.querySelector(injectPoint)) {
			log.info('Injection point not found, exiting.');
			return;
		}

		if (
			window.matchMedia(
				`(max-width: ${parseInt(contentWidth) + sizeMapBuffer}px)`
			).matches
		) {
			log.info('Device width is too narrow, exiting.');
			return;
		}

		function init() {
			if (window?.freestar?.queue) {
				log.info('Freestar enabled, exiting.');
				return;
			}

			if (doc.querySelector('.wallpaperInjectorContainer')) {
				log.info('Wallpaper is visible, exiting');
				return;
			}

			// Get padding-top of inject point
			const topPad =
				window.getComputedStyle(doc.querySelector(injectPoint))
					.paddingTop || '10px';

			const template = `
				<div id="cmls-sidewall-left" class="cmls-sidewall"></div>
				<div id="cmls-sidewall-right" class="cmls-sidewall"></div>
				<style>
					.cmls-sidewalls { position: absolute; left: 50%; top: 0; width: ${contentWidth}; height: 100%; transform: translateX(-50%); display: flex; justify-content: space-between; box-sizing: border-box; padding: ${topPad} 10px; }
					.cmls-sidewall { position: sticky; top: ${topPad}; width: fit-content; height: fit-content; }
					#cmls-sidewall-left { transform: translateX(-100%); }
					#cmls-sidewall-right { margin-left: auto; transform: translateX(100%); }
				</style>
			`;
			const container = createElement.el('div', {
				class: 'cmls-sidewalls',
			});
			container.innerHTML = template;
			doc.querySelector(injectPoint).prepend(container);

			// Define slots
			window._CMLS.adTag.queue(() => {
				log.info('Defining sidewalls');
				var gt = window._CMLS.adTag.rawInterface();
				if (!gt.sizeMapping) {
					return;
				}
				var sizeMap = gt
					.sizeMapping()
					.addSize(
						[parseInt(contentWidth) + sizeMapBuffer, 0],
						[
							[160, 600],
							[300, 600],
						]
					)
					.addSize([0, 0], [])
					.build();
				window._CMLS.adTag
					.defineSlot(
						[
							window._CMLS.adPath + '/sidewallLeft',
							[
								[160, 600],
								[300, 600],
							],
							'cmls-sidewall-left',
						],
						true,
						{ pos: 'left' },
						true
					)
					.defineSizeMapping(sizeMap);
				window._CMLS.adTag.display(
					'cmls-sidewall-left',
					window._CMLS.adTag.isInitialLoadDisabled()
				);

				window._CMLS.adTag
					.defineSlot(
						[
							window._CMLS.adPath + '/sidewallRight',
							[
								[160, 600],
								[300, 600],
							],
							'cmls-sidewall-right',
						],
						true,
						{ pos: 'right' },
						true
					)
					.defineSizeMapping(sizeMap);
				window._CMLS.adTag.display(
					'cmls-sidewall-right',
					window._CMLS.adTag.isInitialLoadDisabled()
				);
			});
		}

		if (window?._CMLS?.adPath) {
			init();
		} else {
			window.addEventListener('cmls-adpath-discovered', () => init());
		}
	});
})(window.self);
