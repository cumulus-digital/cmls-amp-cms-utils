((window) => {
	const { Logger, h, domReady, playerTools } = window.__CMLSINTERNAL.libs;
	const { addAfterPageFrame } = playerTools;
	const scriptName = 'GPT-INTERSTITIAL';
	const nameSpace = 'gptInterstitial';
	const version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	const doc = window.document;

	const init = () => {
		if (window.self !== window.parent) {
			log.debug('Interstitials only supported in top window.');
			return;
		}

		const adTag = window.__CMLSINTERNAL.adTag;

		adTag.queue(() => {
			const slot = adTag.defineSlot({
				adUnitPath: window._CMLS.adPath,
				targeting: {
					pos: 'interstitial',
					noprebid: 'noprebid',
					never_refresh: 'true',
				},
				init: true,
				prebid: false,
				interstitial: true,
			});

			if (!slot) {
				log.warn('Could not create interstitial slot');
				return;
			}

			slot.setConfig({
				interstitial: {
					triggers: {
						unhideWindow: true,
					},
				},
			});

			adTag.display(slot, adTag.isInitialLoadDisabled());
			log.info(
				'Interstitial slot created.',
				slot.getSlotElementId(),
				slot
			);
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
