((window) => {
	const { Logger, h, domReady, playerTools } = window.__CMLSINTERNAL.libs;
	const { addAfterPageFrame } = playerTools;
	const scriptName = 'WEST7-1X1';
	const nameSpace = 'west71x1';
	const version = '0.1';
	const elementId = 'gpt-w7mtag';

	const log = new Logger(`${scriptName} ${version}`);

	const doc = window.document;

	const init = () => {
		if (doc.getElementById(elementId)) {
			return;
		}

		const adTag = window.__CMLSINTERNAL.adTag;

		const tag = (
			<div
				id={elementId}
				style="line-height:0; font-size: 0; height: 0"
			/>
		);
		doc.body.appendChild(tag);
		log.debug('Slot injected');

		adTag.queue(() => {
			const slot = adTag.defineSlot({
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
			if (!slot) {
				log.warn('Could not define slot!');
				return;
			}

			adTag.display(elementId, adTag.isInitialLoadDisabled());
			log.info('Slot initialized');

			addAfterPageFrame(() => {
				adTag.destroySlots([slot]);
			});
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
