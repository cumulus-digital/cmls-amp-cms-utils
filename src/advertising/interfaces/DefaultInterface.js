/**
 * Default adtag interface for others to inherit from
 */
import Logger from 'Utils/Logger';

/**
 * @typedef {object} DefineSlotOptions
 * @property {string} adUnitPath Full ad unit path with network and unit code
 * @property {array} size Slot sizes
 * @property {string} div ID of the div that will contain the slot
 * @property {boolean} [collapse = true] Enable collapseEmptyDiv for the slot
 * @property {object=} targeting Set targeting parameters for slot as key: value, may be an array of objects
 * @property {boolean} [init = true] Initialize the slot with pubads service
 * @property {boolean} [prebid = false] Route slot through prebid wrapper
 */

export default class DefaultInterface {
	scriptName = 'DEFAULT ADTAG INTERFACE';
	nameSpace = 'defaultAdtagInterface';
	parentNameSpace = 'adTagDetection';
	version = 'x';

	static identity = 'DEFAULT';

	/**
	 * The interface defines the method by which it detects if it
	 * should be the one used.
	 */
	static detectTag() {}

	constructor() {
		this.logger = new Logger(`${this.scriptName} v${this.version}`);
	}

	/**
	 * Returns the raw ad tag interface
	 */
	rawInterface() {}

	/**
	 * Adtag's command queue
	 */
	queue(callback) {
		return this.rawInterface().cmd.push(callback);
	}

	/**
	 * Not all interfaces will have pubads()
	 */
	pubads() {
		return this.rawInterface().pubads();
	}

	/**
	 * Sets global targeting parameters
	 * @param {string} key
	 * @param {string} val
	 */
	setTargeting(key, val) {}

	/**
	 * Detect if initial load is disabled
	 * @returns {boolean}
	 */
	isInitialLoadDisabled() {
		return this.pubads().isInitialLoadDisabled();
	}

	/**
	 * Default options for defineSlot
	 * @returns {DefineSlotOptions}
	 */
	defaultDefineSlotOptions() {
		return {
			adUnitPath: null,
			size: [],
			div: null,
			collapse: true,
			targeting: [],
			init: true,
			prebid: false,
		};
	}

	/**
	 * Define a slot and apply options, targeting, init, etc
	 * @param {DefineSlotOptions} options Options for defineSlot
	 * @return {object}
	 */
	defineSlot(options) {
		return {};
	}

	/**
	 * Queues the display of a given slot ID
	 * @param {string} ID div ID for ad slot
	 * @param {Boolean} forceLoad force a call to refresh() on the slot
	 */
	display(ID, forceLoad = false) {}

	/**
	 * Refresh given slots
	 * @param {object|array} requestSlots
	 */
	refresh(requestSlots) {}

	/**
	 * Filter given slots for those that return element IDs
	 * @param {array} requestSlots
	 */
	filterSlots(requestSlots) {
		if (!requestSlots) {
			this.log.warn('Filter called without slots', requestSlots);
			return;
		}
		if (!Array.isArray(requestSlots)) {
			requestSlots = [requestSlots];
		}
		const refreshSlots = [];
		requestSlots.forEach((slot) => {
			if (slot?.getSlotElementId()) {
				refreshSlots.push(slot);
			}
		});
		if (refreshSlots.length) {
			return refreshSlots;
		}
		return false;
	}

	/**
	 * Return API queried information about slots, good for logging
	 * @param {array|object} slots
	 * @returns {array}
	 */
	listSlotData(slots) {
		return [];
	}

	/**
	 * Interfaces to ad tag's event listeners
	 */
	addListener() {}
	removeListener() {}
}
