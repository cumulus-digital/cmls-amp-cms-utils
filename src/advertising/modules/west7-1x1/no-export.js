((window) => {
	const { h, domReady } = window._CMLS.libs;
	const scriptName = 'WEST7-1X1';
	const nameSpace = 'west71x1';
	const version = '0.1';
	const elementId = 'gpt-w7mtag';

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	const doc = window.document;

	const init = () => {
		if (doc.getElementById(elementId)) {
			return;
		}

		const tag = (
			<div
				id={elementId}
				style="line-height:0; font-size: 0; height: 0"
			/>
		);
		doc.body.appendChild(tag);
		log.info('Slot injected');

		window._CMLS.adTag.queue(() => {
			const slot = window._CMLS.adTag.defineSlot({
				adUnitPath: window._CMLS.adPath,
				size: [[1, 1]],
				div: elementId,
				collapse: true,
				targeting: {
					pos: 'w7m',
					noprebid: 'noprebid',
					never_refresh: 'true',
				},
				prebid: false,
			});
			slot &&
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
