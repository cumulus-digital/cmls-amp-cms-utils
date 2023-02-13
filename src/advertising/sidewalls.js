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
		doc = window.document;

	const log = new Logger(`${scriptName} ${version}`);

	domReady(() => {
		if (window?.freestar?.loaded) {
			log.info('Freestar enabled, exiting.');
			return;
		}

		if (
			doc.querySelector(
				'.takeover-left,.takeover-right,.skyscraper-left,.skyscraper-right'
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

		if (window.matchMedia('(max-width: 1499px)').matches) {
			log.info('Device width is too narrow, exiting.');
			return;
		}

		function init() {
			if (window?.freestar?.loaded) {
				log.info('Freestar enabled, exiting.');
				return;
			}

			if (doc.querySelector('.wallpaperInjectorContainer')) {
				log.info('Wallpaper is visible, exiting');
				return;
			}

			const template = `
				<div id="cmls-sidewall-left" class="cmls-sidewall"></div>
				<div id="cmls-sidewall-right" class="cmls-sidewall"></div>
				<style>
					.cmls-sidewalls { position: absolute; left: 50%; top: 0; width: 1500px; height: 100%; transform: translateX(-50%); display: flex; justify-content: space-between; box-sizing: border-box; padding: 10px; }
					.cmls-sidewall { position: sticky; top: 10px; width: fit-content; height: fit-content; }
					#cmls-sidewall-right { margin-left: auto; }
				</style>
			`;
			const container = createElement.el('div', {
				class: 'cmls-sidewalls',
			});
			container.innerHTML = template;
			doc.querySelector(injectPoint).append(container);

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
						[1500, 0],
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
					.defineSizeMap(sizeMap);
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
