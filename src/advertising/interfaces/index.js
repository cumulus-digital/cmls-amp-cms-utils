/**
 * Adtag interface detection
 */
import Logger from 'Utils/Logger';
import triggerEvent from 'Utils/triggerEvent';
import domReady from 'Utils/domReady';

import APSInterface from './aps-gpt';
import GPTInterface from './gpt';

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

	let detectLoop = 0;
	const runDetectors = () => {
		detectLoop++;
		if (window._CMLS.adTag || detectLoop > 60) {
			return;
		}
		log.info(`Running registered detectors (Loop: ${detectLoop})`);
		for (const TagInterface of window._CMLS[nameSpace]
			.registeredDetectors) {
			if (!TagInterface.identity || !TagInterface.detectTag) {
				log.error('Invalid interface', TagInterface);
				return false;
			}
			log.info('Checking registered detector', TagInterface.identity);
			if (TagInterface.detectTag()) {
				log.info('Interface detected', TagInterface.identity);
				window._CMLS.adTag = new TagInterface();
				triggerEvent(window, 'cmls-adtag-loaded', true);
				return;
			}
		}
		log.warn('No interface detected, re-running detection in 0.5 seconds');
		setTimeout(() => runDetectors(), 500);
	};

	domReady(() => {
		log.info('Initializing.');
		runDetectors();
	});
})(window.self);
