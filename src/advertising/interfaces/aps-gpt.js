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
	 * @param {DefineSlotOptions} options Options for defineSlot
	 * @return {object}
	 */
	defineSlot(options) {
		const settings = Object.assign(
			this.defaultDefineSlotOptions(),
			options
		);
		if (settings?.prebid === false && !settings?.targeting?.noprebid) {
			settings.targeting.noprebid = 'noprebid';
		}
		const slot = super.defineSlot(settings);
		return slot;
	}

	filterPrebidSlots(slots) {
		const me = this;
		if (!slots) {
			me.log.warn('filterPrebidSlots called without slots');
			return;
		}
		if (!Array.isArray(slots)) {
			slots = [slots];
		}
		slots = me.filterSlots(slots);
		const filteredSlots = {
			prebid: [],
			noprebid: [],
			all: slots,
		};
		slots.forEach((slot) => {
			me.log.info('Checking', slot.getSlotElementId());
			let isPrebid = false;
			const allowedWidths = [160, 300, 320, 728, 970];
			const allowedHeights = [50, 90, 100, 250, 600];

			// Only allow expected sizes in prebid
			const sizes = slot.getSizes();
			if (sizes?.length) {
				sizes.forEach((size) => {
					if (
						allowedWidths.includes(size.width) &&
						allowedHeights.includes(size.height)
					) {
						isPrebid = true;
					}
				});
			} else {
				isPrebid = false;
			}

			// Exclude slots with 'noprebid' targeting parameters
			if (slot.getTargeting('noprebid')?.length) {
				isPrebid = false;
			}

			if (isPrebid) {
				filteredSlots.prebid.push(slot);
			} else {
				filteredSlots.noprebid.push(slot);
			}
		});

		return filteredSlots;
	}

	/**
	 * Refresh given slots, handling both prebid and noprebid slots
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

		const refreshSlots = me.filterPrebidSlots(requestSlots);
		if (!refreshSlots?.all?.length) {
			me.log.info('No slots found for refreshing after filtering.');
			return;
		}

		if (refreshSlots?.prebid?.length) {
			me.log.info(
				`🏷 Requesting bids for ${refreshSlots.prebid.length} prebid slots`,
				this.listSlotData(refreshSlots.prebid)
			);

			const apsconfig = {
				slots: refreshSlots.prebid,
				params: {
					adRefresh: '1',
				},
			};

			const fetchBids = (apsconfig) => {
				me.log.info('fetchBids called', apsconfig);
				window.apstag.fetchBids(apsconfig, (bids) => {
					me.queue(() => {
						window.apstag.setDisplayBids();
						me.log.info(
							'🏷 Refreshing prebid slots after bids received',
							me.listSlotData(refreshSlots.prebid),
							bids
						);
						me.pubads().refresh(refreshSlots.prebid);
					});
				});
			};

			fetchBids(apsconfig);
		}

		if (refreshSlots?.noprebid?.length) {
			me.log.info(
				'Refreshing noprebid slots',
				me.listSlotData(refreshSlots.noprebid)
			);
			return me.pubads().refresh(refreshSlots.noprebid);
		}
	}

	/**
	 * Check if a slot has been requested
	 * @param {object} slot
	 * @return {Boolean} Returns true if slot has already been requested
	 */
	wasSlotRequested(slot) {
		const me = this;
		if (super.wasSlotRequested(slot)) {
			return true;
		}
		// Slots with an amznbid key are queued for refresh on-page already
		if (slot.getTargeting('amznbid')?.length) {
			me.log.info('Has amznbid targeting', me.listSlotData(slot));
			return true;
		}
		return false;
	}
}
