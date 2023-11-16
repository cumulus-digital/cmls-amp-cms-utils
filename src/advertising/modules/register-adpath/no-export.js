import config from './config.json';

((window) => {
	const { triggerEvent } = window._CMLS.libs;
	const { scriptName, version, networkId } = config;
	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	function registerAdPath() {
		log.debug('Checking for ad path');
		const slots = window?._CMLS?.adTag.getSlots();

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
					log.info('Ad path discovered', window._CMLS.adPath);
					triggerEvent(
						window,
						'cmls-adpath-discovered',
						window._CMLS.adPath
					);
					return true;
				}
			});
		} else {
			log.warn('Found no slots!');
		}
	}

	if (window?._CMLS?.adTag?.isReady()) {
		registerAdPath();
	} else {
		window.addEventListener('cmls-adtag-loaded', () => registerAdPath());
	}
})(window.self);
