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

	defineSlot(options, collapse = false, targeting = [], init = true) {
		let slot = this.rawInterface().defineSlot.apply(null, options);

		if (!slot) {
			this.log.error('Failed to create slot!', arguments);
			return false;
		}

		if (collapse) {
			slot = slot.setCollapseEmptyDiv(true);
		}

		targeting = Array.isArray(targeting) ? targeting : [targeting];
		targeting.forEach((target) => {
			for (const k in target) {
				if (target.hasOwnProperty(k)) {
					slot = slot.setTargeting(k, target[k]);
				}
			}
		});

		if (init) {
			slot = slot.addService(this.pubads());
		}

		this.log.info(
			'Defined slot',
			slot.getSlotElementId(),
			slot.getSlotId()
		);

		return slot;
	}
}
