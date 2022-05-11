/**
 * Helpers for cross-browser detection and tracking of tab visibility
 */

const visibilityApi = {
	hidden: 'hidden',
	event: 'visibilitychange',
};

if (typeof window.document.mozHidden !== 'undefined') {
	Object.assign(visibilityApi, {
		hidden: 'mozHidden',
		event: 'mozvisibilitychange',
	});
} else if (typeof window.document.msHidden !== 'undefined') {
	Object.assign(visibilityApi, {
		hidden: 'msHidden',
		event: 'msvisibilitychange',
	});
} else if (typeof window.document.webkitHidden !== 'undefined') {
	Object.assign(visibilityApi, {
		hidden: 'webkitHidden',
		event: 'webkitvisibilitychange',
	});
} else if (typeof window.document.oHidden !== 'undefined') {
	Object.assign(visibilityApi, {
		hidden: 'oHidden',
		event: 'ovisibilitychange',
	});
}

export const api = visibilityApi;

/**
 * Detect if the tab is currently visible.
 * @returns {boolean}
 */
export function isVisible() {
	if (window.document.visibilityState) {
		return !(window.document.visibilityState === 'hidden');
	}
	return !window.document[visibilityApi.hidden];
}

/**
 * Add an event listener for tab visibility changes
 * @param {function} callback
 * @param {boolean,object} options Optional options object for listener
 * @returns
 */
export function addVisibilityListener(callback, options = {}) {
	return window.document.addEventListener(
		visibilityApi.event,
		callback,
		options
	);
}

export function removeVisibilityListener(callback) {
	return window.document.removeEventListener(visibilityApi.event, callback);
}
