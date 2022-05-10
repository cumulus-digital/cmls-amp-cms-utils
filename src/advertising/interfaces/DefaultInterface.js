/**
 * Default adtag interface for others to inherit from
 */
import Logger from 'Utils/Logger';

export default class DefaultInterface {
	#scriptName = 'DEFAULT ADTAG INTERFACE';
	#nameSpace = 'defaultAdtagInterface';
	#parentNameSpace = 'adTagDetection';
	#version = 'x';

	static identity = 'DEFAULT';

	/**
	 * The interface defines the method by which it detects if it
	 * should be the one used.
	 */
	static detectTag() {}

	constructor() {
		this.logger = new Logger(`DEFAULT ADTAG INTERFACE v${this.version}`);
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
		return this.rawInterface()?.cmd
			? this.rawInterface().cmd.push(callback)
			: { cmd: [callback] };
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
	 * Define a lot and apply options, targeting, and init
	 * @param {array} options Options for defineSlot. [ path, [sizes], ID ]
	 * @param {Boolean} collapse Apply collapseEmptyDiv
	 * @param {array|object} targeting Define targeting parameters for the slot [{key: value}]
	 * @param {Boolean} init True to add pubads service and initialize the slot
	 * @return {object}
	 */
	defineSlot(options, collapse, targeting, init) {}

	/**
	 * Queues the display of a given slot ID
	 * @param {string} ID div ID for ad slot
	 * @param {Boolean} forceLoad force a call to refresh() on the slot
	 */
	display(ID, forceLoad = false) {
		const me = this;
		this.queue(() => {
			this.log.info('Calling display', ID, forceLoad);
			me.rawInterface().display(ID);
			if (forceLoad) {
				const slot = me
					.pubads()
					.getSlots()
					.find((slot) => slot.getSlotElementId() === ID);
				if (slot) {
					me.refresh(slot);
				}
			}
		});
	}

	/**
	 * Refresh given slots
	 * @param {object|array} slots
	 */
	refresh(slots) {
		if (!slots) {
			this.log.warn('Refresh called without slots', slots);
			return;
		}
		if (!Array.isArray(slots)) {
			slots = [slots];
		}
		slots.forEach((slot) => {
			this.log.info('Refresh called for slot', slot.getSlotElementId());
		});
		return this.pubads().refresh(slots);
	}

	/**
	 * Interfaces to ad tag's event listeners
	 */
	addListener() {}
	removeListener() {}
}
