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
		this.log = new Logger(`GPT INTERFACE v${this.version}`);
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
			slot = slot.addServices(this.pubads());
		}

		this.log.info(
			'Defined slot',
			slot.getSlotElementId(),
			slot.getSlotId(),
			settings
		);
		window.GPT_SITE_SLOTS = window.GPT_SITE_SLOTS || {};
		window.GPT_SITE_SLOTS[slot.getSlotElementId()] = slot;

		return slot;
	}
}
