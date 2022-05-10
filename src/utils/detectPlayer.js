/**
 * Detect if site has player
 */
import triggerEvent from 'Utils/triggerEvent';
import domReady from 'Utils/domReady';

let player = null;
let counter = 0;

export const detectPlayer = () => {
	if (window.top.tgmp) {
		player = 'tunegenie';
		return player;
	}
};

export const navigateThroughPlayer = (url) => {
	if (detectPlayer()) {
		window.tgmp.updateLocation(url);
	}
};

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

/**
 * Retrieve the window object of the current document, if it is the top-level
 * window or in TG's iframe
 */
export const getPageWindow = () => {
	const pageFrame = window.top.document.querySelector(
		'iframe[name="pwm_pageFrame"]'
	);
	if (pageFrame) {
		return pageFrame.contentWindow;
	}
	return window.top;
};

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
			const pageFrame = window.top.document.querySelector(
				'iframe[name="pwm_pageFrame"]'
			);
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
		'iframe[name="pwm_pageFrame"]'
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
