/**
 * Tools related to TuneGenie player
 */
import triggerEvent from 'Utils/triggerEvent';
import domReady from 'Utils/domReady';
import Logger from 'Utils/Logger';

let player = null;
let counter = 0;
let page_frame_css_class = 'pwm_pageFrame';

window._CMLS = window._CMLS || {};
window._CMLS.playerTools = window._CMLS.playerTools || {};

export const detectPlayer = () => {
	const bodyClass = 'cmls-player-active';
	let hasPlayer = false;
	[window.self, window.parent, window.top].forEach((w) => {
		if (w.tgmp) {
			hasPlayer = true;
			if (!w.document.body.classList.contains(bodyClass)) {
				w.document.body.classList.add(bodyClass);
			}
		}
	});
	if (hasPlayer) {
		player = 'tunegenie';
		return player;
	}
	addAfterPageFrame(detectPlayer);
};
window._CMLS.playerTools.detectPlayer = detectPlayer;

export const navigateThroughPlayer = (url) => {
	if (detectPlayer()) {
		window.tgmp.updateLocation(url);
	}
};
window._CMLS.playerTools.navigateThroughPlayer = navigateThroughPlayer;

export const waitForPlayer = () => {
	return new Promise(waiting);
	function waiting(resolve, reject) {
		if (detectPlayer()) {
			triggerEvent(window, 'cmls-player-detected', player);
			resolve(detectPlayer());
		} else if (counter > 20) {
			return;
			//reject(false);
		} else {
			counter++;
			setTimeout(waiting.bind(this, resolve, reject), 500);
		}
	}
};
window._CMLS.playerTools.waitForPlayer = waitForPlayer;

/**
 * Return the window of the page frame if it exists, else window.self
 */
export const getPageWindow = () => {
	const log = new Logger('PlayerTools');

	[window.self, window.parent, window.top].forEach((w) => {
		if (w.name === page_frame_css_class) {
			return w;
		}
		let pageFrame = w.document.querySelector(
			`iframe[name="${page_frame_css_class}"]`
		);
		if (pageFrame) {
			log.info('Found page frame', pageFrame.name);
			return pageFrame.contentWindow;
		}
	});
	return window.self;
};
window._CMLS.playerTools.getPageWindow = getPageWindow;

/**
 * Detects if the current window is in an iframe
 * @returns {boolean}
 */
export const isInIframe = () => {
	return (
		window.self !== window.top || window.self.name === page_frame_css_class
	);
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
		`iframe[name="${page_frame_css_class}"]`
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
