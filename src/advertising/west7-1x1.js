/**
 * Injects a 1x1 ad tag for west7
 */
import Logger from 'Utils/Logger';
import createElement from 'Utils/createElement';
import domReady from 'Utils/domReady';

((window) => {
	const scriptName = 'WEST7-1X1',
		nameSpace = 'west71x1',
		version = '0.1',
		elementId = 'gpt-w7mtag';

	const log = new Logger(`${scriptName} ${version}`);

	const doc = window.document;

	const init = () => {
		if (doc.getElementById(elementId)) {
			return;
		}

		const tag = createElement.el('div', {
			id: elementId,
			style: 'line-height:0;font-size:0;height:0',
		});
		doc.body.appendChild(tag);
		log.info('Slot injected');

		window._CMLS.adTag.queue(() => {
			/*
			const slot = window._CMLS.adTag.defineSlot(
				[window._CMLS.adPath, [[1, 1]], elementId],
				true,
				{ pos: 'w7m' },
				true,
				false
			);
			*/
			const slot = window._CMLS.adTag.defineSlot({
				adUnitPath: window._CMLS.adPath,
				size: [[1, 1]],
				div: elementId,
				collapse: true,
				targeting: { pos: 'w7m', noprebid: 'noprebid' },
				prebid: false,
			});
			window._CMLS.adTag.display(
				elementId,
				window._CMLS.adTag.isInitialLoadDisabled()
			);
			log.info('Slot initialized');
		});
	};

	domReady(() => {
		if (window?._CMLS?.adPath) {
			init();
		} else {
			window.addEventListener('cmls-adpath-discovered', () => init());
		}
	});
})(window.self);
