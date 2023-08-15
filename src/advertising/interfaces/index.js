/**
 * Adtag interface detection
 *
 * All interfaces must inherit from the DefaultInterface
 */

import Logger from 'Utils/Logger';
import triggerEvent from 'Utils/triggerEvent';
import domReady from 'Utils/domReady';

import APSInterface from './aps-gpt';
import GPTInterface from './gpt';

// Detectors must be registered in order for their detection to be run.
// The first successful detector wins.
const registeredDetectors = [APSInterface, GPTInterface];

((window, undefined) => {
	const scriptName = 'ADTAG DETECTION',
		nameSpace = 'adTagDetection',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	window._CMLS = window._CMLS || {};
	window._CMLS[nameSpace] = {
		registeredDetectors: registeredDetectors,
	};

	const runDetectors = (detectLoop = 0) => {
		if (window._CMLS.adTag || detectLoop > 60) {
			return;
		}
		log.info(`Running registered detectors (Loop: ${detectLoop})`);
		let detected = false;
		for (const TagInterface of window._CMLS[nameSpace]
			.registeredDetectors) {
			if (!TagInterface.identity || !TagInterface.detectTag) {
				log.error('Invalid interface', TagInterface);
				break;
			}
			log.info('Checking registered detector', TagInterface.identity);
			if (TagInterface.detectTag()) {
				detected = true;
				window._CMLS.adTag = new TagInterface();
				break;
			}
		}
		if (detected) {
			log.info('Interface detected', window._CMLS.adTag.identity);
			triggerEvent(window, 'cmls-adtag-loaded', true);
			return;
		}
		log.warn('No interface detected, re-running detection in 0.15 seconds');
		setTimeout(() => runDetectors(detectLoop + 1), 150);
	};

	domReady(() => {
		log.info('Initializing.');
		runDetectors();
	});
})(window.self);
