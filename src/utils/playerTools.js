/**
 * Tools related to TuneGenie player
 */
import triggerEvent from 'Utils/triggerEvent';
import domReady from 'Utils/domReady';
import Logger from 'Utils/Logger';

const log = new Logger('PlayerTools');
let player = null;
let counter = 0;
let page_frame_name = 'pwm_pageFrame';
let page_frame_names = {
	tunegenie: 'pwm_pageFrame',
	cumulus: 'cmls_siteframe',
};

window._CMLS = window._CMLS || {};
window._CMLS.playerTools = window._CMLS.playerTools || {};

/**
 * Select the first iframe that matches our page_frame_names
 */
const querySelectorPageFrames = (w) =>
	w.document.querySelector(
		Object.values(page_frame_names)
			.map((name) => `iframe[name="${name}"]`)
			.join(',')
	);

/**
 * Detect if a known streaming player is enabled
 * @returns {false|string}
 */
export const detectPlayer = () => {
	const bodyClass = 'has-detected-player';
	if (player) {
		return player;
	}
	let hasPlayer = false;
	[window.self, window.parent, window.top].some((w) => {
		if (w?.tgmp || window.frames[page_frame_names.tunegenie]) {
			hasPlayer = 'tunegenie';
			return true;
		}
		if (w?.cmls_player || window.frames[page_frame_names.cumulus]) {
			hasPlayer = 'cumulus';
			return true;
		}
	});
	log.debug('HASPLAYER?', hasPlayer);
	/*
	[window.self, window.parent, window.top].forEach((w) => {
		if (w.tgmp || Object.values(page_frame_names).includes(w.name)) {
			hasPlayer = true;
			if (!w.document.body.classList.contains(bodyClass)) {
				w.document.body.classList.add(bodyClass);
			}
		}
	});
	*/
	if (hasPlayer) {
		document.body.classList.add(bodyClass);
		document.body.classList.add(`player-${hasPlayer}`);
		player = hasPlayer;
		return player;
	}
	addAfterPageFrame(detectPlayer);
	return false;
};
window._CMLS.playerTools.detectPlayer = detectPlayer;

export const navigateThroughPlayer = (url) => {
	const player = detectPlayer();
	if (player === 'tunegenie' && window.tgmp.updateLocation) {
		window.tgmp.updateLocation(url);
	} else if (player === 'cumulus' && window.cmls_player.updateLocation) {
		window.cmls_player.updateLocation(url);
	} else {
		window.self.location.href = url;
	}
};
window._CMLS.playerTools.navigateThroughPlayer = navigateThroughPlayer;

export const waitForPlayer = () => {
	const waiting = (resolve, reject) => {
		if (detectPlayer()) {
			triggerEvent(window, 'cmls-player-detected', player);
			resolve(detectPlayer());
		} else if (counter > 20) {
			resolve(false);
			return;
			//reject(false);
		} else {
			counter++;
			setTimeout(waiting.bind(this, resolve, reject), 500);
		}
	};
	return new Promise(waiting);
};
window._CMLS.playerTools.waitForPlayer = waitForPlayer;

/**
 * Return the window of the page frame if it exists, else window.self
 */
export const getPlayerFrame = () => {
	let pageFrame = false;
	[window.self, window.parent, window.top].some((w) => {
		if (Object.values(page_frame_names).includes(w.name)) {
			pageFrame = w;
			return w;
		}
		let frame_test = querySelectorPageFrames(w);
		if (frame_test?.contentWindow) {
			pageFrame = frame_test.contentWindow;
			return frame_test.contentWindow;
		}
	});
	if (pageFrame?.document) {
		return pageFrame;
	}

	return window.self;
};
window._CMLS.playerTools.getPlayerFrame = getPlayerFrame;

/**
 * Detects if the current window is in an iframe
 * @returns {boolean}
 */
export const isInIframe = () => {
	if (window.self !== window.top) return true;
	if (window.self.name in page_frame_names) return true;
	return false;
	return window.self !== window.top || window.self.name === page_frame_name;
};
window._CMLS.playerTools.isInIframe = isInIframe;

/**
 * Runs callback when the a player generates an iframe.
 * Useful for deregistering stuff since that's loading the next page
 * but the original window context remains
 */
const onAfterPageFrame = [];
let loadedWithPageFrame = false;
let pageFrameCreated = false;
const bodyWatch = new MutationObserver((mutationsList, observer) => {
	const runCallbacks = () => {
		for (const cb of onAfterPageFrame) {
			if (typeof cb === 'function') {
				cb();
			}
		}
		bodyWatch.disconnect();
	};
	for (const mutation of mutationsList) {
		if (mutation.type === 'childList') {
			let pageFrame;
			// Get top most window that contains a page_frame_name
			[window.top, window.parent, window.self].some((w) => {
				if (
					Object.values(page_frame_names).some(
						(name) => w?.frames?.[name]
					)
				) {
					pageFrame = w;
					return true;
				}
			});
			if (pageFrame) {
				const detectedPlayer = detectPlayer();
				if (detectedPlayer === 'tunegenie') {
					pageFrameCreated = true;
				}
				if (
					detectedPlayer === 'cumulus' &&
					document.body.classList.contains('iframe-loaded')
				) {
					pageFrameCreated = true;
				}
				if (pageFrameCreated) {
					runCallbacks();
				}
			}
		}
	}
});
domReady(() => {
	let hasFrame = false;
	[window.self, window.parent, window.top].some((w) => {
		if (w?.tgmp || window.frames[page_frame_names.tunegenie]) {
			hasFrame = 'tunegenie';
			return true;
		}
		if (window.frames[page_frame_names.cumulus]) {
			hasFrame = 'cumulus';
			return true;
		}
	});
	if (
		hasFrame &&
		(hasFrame === 'tunegenie' ||
			(hasFrame === 'cumulus' &&
				document.body.classList.contains('iframe-loaded')))
	) {
		log.debug('Page loaded with active page frame');
		loadedWithPageFrame = true;
	}
	bodyWatch.observe(window.top.document.body, {
		childList: true,
	});
});

/**
 * Add a callback to run when pageFrame is created
 * @param {function} cb
 */
export const addAfterPageFrame = (cb) => {
	if (typeof cb === 'function') {
		onAfterPageFrame.push(cb);
	}
};
window._CMLS.playerTools.addAfterPageFrame = addAfterPageFrame;
