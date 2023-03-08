/**
 * Amazon UAW/APS header bidder interface
 */
import GPTInterface from './gpt';
import Logger from 'Utils/Logger';

export default class APSInterface extends GPTInterface {
	scriptName = 'APS-GPT INTERFACE';
	version = '0.1';
	log = null;

	static identity = 'APS-GPT';

	static detectTag() {
		if (super.detectTag() && window?.apstag) {
			return true;
		}
	}

	constructor() {
		super();
		this.log = new Logger(`${this.scriptName} v${this.version}`);
	}

	/**
	 * @typedef {import('./DefaultInterface.js').DefineSlotOptions} DefineSlotOptions
	 */

	/**
	 * Define a slot and apply options, targeting, init, etc.
	 * If slot has prebid enabled, add to GPT_PREBID_SLOTS array
	 * @param {DefineSlotOptions} options Options for defineSlot
	 * @return {object}
	 */
	defineSlot(options) {
		const settings = Object.assign(
			this.defaultDefineSlotOptions(),
			options
		);
		const slot = super.defineSlot(settings);
		if (settings.prebid && slot && slot.getSlotElementId()) {
			window.GPT_PREBID_SLOTS = window.GPT_PREBID_SLOTS || {};
			window.GPT_PREBID_SLOTS[slot.getSlotElementId()] = slot;
		}
		return slot;
	}

	/**
	 * Refresh given slots. If slot is in GPT_PREBID_SLOTS, route through prebid for new bids
	 * @param {object|array} requestSlots
	 */
	refresh(requestSlots) {
		const me = this;
		if (!requestSlots) {
			me.log.warn(
				'Refresh called without slots',
				me.listSlotData(requestSlots)
			);
			return;
		}
		me.log.info(
			'Refresh requested for slots',
			me.listSlotData(requestSlots)
		);
		const refreshSlots = me.filterSlots(requestSlots);
		if (!refreshSlots?.length) {
			me.log.info('No slots found for refreshing after filtering.');
			return;
		}
		const prebidSlots = [];
		if (window?.apstag) {
			refreshSlots.forEach((slot) => {
				me.log.info('Checking', slot.getSlotElementId());
				if (window?.GPT_PREBID_SLOTS?.[slot.getSlotElementId()]) {
					prebidSlots.push(slot);
				}
			});
		}
		if (prebidSlots.length) {
			me.log.info(
				'Found prebid slots for refresh',
				this.listSlotData(prebidSlots)
			);
			window.apstag.fetchBids(
				{
					slots: prebidSlots,
					timeout: 2e3,
				},
				function (bids) {
					me.queue(() => {
						window.apstag.setDisplayBids();
						me.log.info(
							'Refreshing slots after bids received',
							me.listSlotData(refreshSlots)
						);
						me.pubads().refresh(refreshSlots);
					});
				}
			);
		} else {
			me.log.info('Refreshing slots', me.listSlotData(refreshSlots));
			return me.pubads().refresh(refreshSlots);
		}
	}
}
