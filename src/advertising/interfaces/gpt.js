/**
 * Googletag interface
 */
import DefaultInterface from './DefaultInterface';
import Logger from 'Utils/Logger';

export default class GPTInterface extends DefaultInterface {
	scriptName = 'GPT INTERFACE';
	version = '0.1';
	log = null;

	static identity = 'GPT';

	static detectTag() {
		if (window.self.googletag?.pubadsReady) {
			return true;
		}
	}

	constructor() {
		super();
		this.log = new Logger(`${this.scriptName} v${this.version}`);
	}

	rawInterface() {
		return window.self?.googletag;
	}

	addListener(e, func) {
		const me = this;
		this.queue(() => {
			me.pubads().addEventListener(e, func);
		});
	}

	removeListener(e, func) {
		return this.pubads().removeEventListener(e, func);
	}

	setTargeting(key, val) {
		return this.pubads().setTargeting(key, val);
	}

	/**
	 * @typedef {import('./DefaultInterface.js').DefineSlotOptions} DefineSlotOptions
	 * @param {DefineSlotOptions} options
	 * @returns {object|boolean}
	 */
	defineSlot(options) {
		const settings = Object.assign(
			this.defaultDefineSlotOptions(),
			options
		);
		let slot = this.rawInterface().defineSlot(
			settings.adUnitPath,
			settings.size,
			settings.div
		);

		if (!slot) {
			this.log.error('Failed to create slot!', settings);
			return false;
		}

		if (settings.collapse) {
			if (!Array.isArray(settings.collapse)) {
				settings.collapse = [settings.collapse];
			}
			slot = slot.setCollapseEmptyDiv.apply(settings.collapse);
		}

		settings.targeting = Array.isArray(settings.targetting)
			? settings.targeting
			: [settings.targeting];
		settings.targeting.forEach((target) => {
			for (const k in target) {
				if (target?.hasOwnProperty(k)) {
					slot = slot.setTargeting(k, target[k]);
				}
			}
		});

		if (settings.init) {
			slot = slot.addService(this.pubads());
		}

		this.log.info('Defined slot', {
			slot: this.listSlotData(slot).shift(),
			settings: settings,
		});
		window.GPT_SITE_SLOTS = window.GPT_SITE_SLOTS || {};
		window.GPT_SITE_SLOTS[slot.getSlotElementId()] = slot;

		return slot;
	}

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
	 * @param {object|array} requestSlots
	 */
	refresh(requestSlots) {
		if (!requestSlots) {
			this.log.warn(
				'Refresh called without slots',
				this.listSlotData(requestSlots)
			);
			return;
		}
		const refreshSlots = this.filterSlots(requestSlots);
		if (!refreshSlots?.length) {
			this.log.info('No slots found for refreshing after filtering.');
			return;
		}
		this.log.info(
			'Refresh called for slots',
			this.listSlotData(refreshSlots)
		);
		return this.pubads().refresh(refreshSlots);
	}

	/**
	 * Return API queried information about slots, good for logging
	 * @param {array|object} slots
	 * @returns {array}
	 */
	listSlotData(slots) {
		if (!Array.isArray(slots)) {
			slots = [slots];
		}
		const slotData = [];
		slots.forEach((slot) => {
			const thisSlot = {
				adUnitPath: slot.getAdUnitPath(),
				div: slot.getSlotElementId(),
				targeting: [],
			};
			const targetingKeys = slot.getTargetingKeys();
			if (targetingKeys?.length) {
				for (let k of targetingKeys) {
					thisSlot.targeting.push({ [k]: slot.getTargeting(k) });
				}
			}
			slotData.push(thisSlot);
		});
		return slotData;
	}
}
