/**
 * Tools related to TuneGenie player
 */
import triggerEvent from 'Utils/triggerEvent';
import domReady from 'Utils/domReady';

let player = null;
let counter = 0;

export const detectPlayer = () => {
	const bodyClass = 'cmls-player-active';
	let hasPlayer = false,
		checkingWindow = false;
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
	addAfterPageFrame(() => {
		detectPlayer();
	});
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
	[window.self, window.parent, window.top].forEach((w) => {
		let pageFrame = w.document.querySelector(
			'iframe[name="pwm_pageFrame"]'
		);
		if (pageFrame) {
			return pageFrame.contentWindow;
		}
	});
	return window.top;
};

/**
 * Detects if the current window is in an iframe
 * @returns {boolean}
 */
export const isInIframe = () => {
	return window.self !== window.top || window.self.name === 'pwm_pageFrame';
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
