import config from './config.json';

((window) => {
	const { Logger, triggerEvent } = window.__CMLSINTERNAL.libs;
	const { scriptName, version, networkId } = config;
	const log = new Logger(`${scriptName} ${version}`);

	function registerAdPath() {
		const adTag = window.__CMLSINTERNAL.adTag;

		log.debug('Checking for ad path');
		const slots = adTag.getSlots();

		log.debug(`Testing ${slots.length} slots`);
		if (slots.length) {
			slots.some((slot) => {
				const p = slot?.getAdUnitPath();
				if (p && p.indexOf(`/${networkId}/`) > -1) {
					log.debug(
						'Found in-network slot',
						slot.getSlotElementId(),
						p
					);
					window._CMLS = window._CMLS || {};
					window._CMLS.adPath = p;
					window.__CMLSINTERNAL.adPath = p;
					log.info(
						'Ad path discovered',
						window.__CMLSINTERNAL.adPath
					);
					triggerEvent(
						window,
						'cmls-adpath-discovered',
						window.__CMLSINTERNAL.adPath
					);
					return true;
				}
			});
		} else {
			log.warn('Found no slots!');
		}
	}

	if (window?.__CMLSINTERNAL?.adTag?.isReady()) {
		registerAdPath();
	} else {
		window.addEventListener('cmls-adtag-loaded', () => registerAdPath());
	}
})(window.self);
