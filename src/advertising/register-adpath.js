/**
 * Discover and store the current site's ad path
 */
import Logger from 'Utils/Logger';
import triggerEvent from 'Utils/triggerEvent';

const scriptName = 'REGISTER-AD-PATH';
const version = '0.1';
const network = '6717';

const log = new Logger(`${scriptName} ${version}`);

function registerAdPath() {
	log.info('Checking for ad path');
	const pa = window?._CMLS?.adTag.rawInterface().pubads();
	const slots = pa?.getSlots();

	log.info(`Testing ${slots.length} slots`);
	if (slots.length) {
		slots.some((slot) => {
			const p = slot?.getAdUnitPath();
			if (p && p.indexOf(`/${network}/`) > -1) {
				log.info('Found in-network slot', slot.getSlotElementId(), p);
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

if (window?._CMLS?.adTag?.rawInterface().pubadsReady) {
	registerAdPath();
} else {
	window.addEventListener('cmls-adtag-loaded', () => registerAdPath());
}
