/**
 * Tools related to TuneGenie player
 */
import triggerEvent from 'Utils/triggerEvent';
import domReady from 'Utils/domReady';
//import Logger from 'Utils/Logger';

let player = null;
let counter = 0;
let page_frame_name = 'pwm_pageFrame';
let page_frame_names = {
	tunegenie: 'pwm_pageFrame',
	cumulus: 'cmls_siteframe',
};

window._CMLS = window._CMLS || {};
window._CMLS.playerTools = window._CMLS.playerTools || {};

export const detectPlayer = () => {
	const bodyClass = 'cmls-player-active';
	if (player) {
		return player;
	}
	let hasPlayer = false;
	let w = window.self;
	while (w !== false || hasPlayer !== false) {
		if (w?.tgmp || window.frames[page_frame_names.tunegenie]) {
			hasPlayer = 'tunegenie';
			break;
		}
		if (window.frames[page_frame_names.cumulus]) {
			hasPlayer = 'cumulus';
			break;
		}
		if (w === window.top) {
			w = false;
			break;
		}
		if (!w.parent) {
			break;
		}
		w = w.parent;
	}
	window._CMLS.commonLog.debug('HASPLAYER?', hasPlayer);
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
		player = hasPlayer;
		return player;
	}
	addAfterPageFrame(detectPlayer);
	return false;
};
window._CMLS.playerTools.detectPlayer = detectPlayer;

export const navigateThroughPlayer = (url) => {
	const player = detectPlayer();
	if (player === 'tunegenie') {
		window.tgmp.updateLocation(url);
	}
	if (player === 'cumulus') {
		if (window.self !== window.parent) {
			window.parent.location.href = url;
		}
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
export const getPageWindow = () => {
	let pageFrame = false;
	const check_for_frame = [window.self, window.parent, window.top].some(
		(w) => {
			if (w.name === page_frame_name) {
				pageFrame = w;
				return w;
			}
			let frame_test = w.document.querySelector(
				`iframe[name="${page_frame_name}"]`
			);
			if (frame_test?.contentWindow) {
				pageFrame = frame_test.contentWindow;
				return frame_test.contentWindow;
			}
		}
	);
	if (pageFrame?.document) {
		return pageFrame;
	}

	return window.self;
};
window._CMLS.playerTools.getPageWindow = getPageWindow;

/**
 * Detects if the current window is in an iframe
 * @returns {boolean}
 */
export const isInIframe = () => {
	return window.self !== window.top || window.self.name === page_frame_name;
};
window._CMLS.playerTools.isInIframe = isInIframe;

/**
 * Runs callback when the TG player generates the pageFrame.
 * Useful for deregistering stuff since that's loading the next page
 * but the original window context remains
 */
const onAfterPageFrame = [];
let loadedWithPageFrame = false;
let pageFrameCreated = false;
const bodyWatch = new MutationObserver((mutationsList, observer) => {
	for (const mutation of mutationsList) {
		if (mutation.type === 'childList') {
			let pageFrame;
			// Get top most window with pwm_pageFrame
			[window.top, window.parent, window.self].some((w) => {
				if (w?.frames?.pwm_pageFrame) {
					pageFrame = w;
					return true;
				}
			});
			if (pageFrame) {
				pageFrameCreated = true;
				for (const cb of onAfterPageFrame) {
					if (typeof cb === 'function') {
						cb();
					}
				}
				bodyWatch.disconnect();
			}
		}
	}
});
domReady(() => {
	loadedWithPageFrame = !!window.top.document.querySelector(
		`iframe[name="${page_frame_name}"]`
	);
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
