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
		if (slot && slot.getSlotElementId()) {
			if (settings?.prebid) {
				// gpt interface stores slots in GPT_SITE_SLOTS global,
				// prebid slots need to be removed and added to GPT_PREBID_SLOTS global.
				if (window?.GPT_SITE_SLOTS?.[slot.getSlotElementId()]) {
					delete window.GPT_SITE_SLOTS[slot.getSlotElementId()];
				}
				window.GPT_PREBID_SLOTS = window.GPT_PREBID_SLOTS || {};
				window.GPT_PREBID_SLOTS[slot.getSlotElementId()] = slot;
			} else if (!settings?.targeting?.noprebid) {
				// Enforce noprebid targeting on generated slots if prebid is false
				// and a noprebid targeting key has NOT been set.
				slot.setTargeting('noprebid', 'noprebid');
			}
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
			me.log.warn('Refresh called without slots');
			return;
		}
		if (!Array.isArray(requestSlots)) {
			requestSlots = [requestSlots];
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
		const prebidSlots = [],
			noPrebidSlots = [];
		// Check if slots should refresh bids
		if (window?.apstag) {
			refreshSlots.forEach((slot) => {
				me.log.info('Checking', slot.getSlotElementId());
				// Exclude any slots with 'noprebid' targeting parameters
				const noPrebid = slot.getTargeting('noprebid');
				if (noPrebid?.length && noPrebid[0].toString() !== 'false') {
					noPrebidSlots.push(slot);
					return;
				}
				// Exclude any slots with a width or height less than 3
				const sizes = slot.getSizes();
				sizes.forEach((size) => {
					if (size?.width < 3 || size?.height < 3) {
						noPrebidSlots.push(slot);
						return;
					}
				});
				// Legacy, use the GPT_*_SLOTS globals
				if (
					window?.GPT_PREBID_SLOTS?.[slot.getSlotElementId()] ||
					!window?.GPT_SITE_SLOTS?.[slot.getSlotElementId()]
				) {
					prebidSlots.push(slot);
					return;
				}
				noPrebidSlots.push(slot);
			});
		}
		if (prebidSlots.length) {
			me.log.info(
				'🏷 Requesting bids for prebid slots',
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
							'🏷 Refreshing prebid slots after bids received',
							me.listSlotData(prebidSlots),
							bids
						);
						me.pubads().refresh(prebidSlots);
					});
				}
			);
		}
		if (noPrebidSlots.length) {
			me.log.info(
				'Refreshing noprebid slots',
				me.listSlotData(noPrebidSlots)
			);
			return me.pubads().refresh(noPrebidSlots);
		}
	}
}
