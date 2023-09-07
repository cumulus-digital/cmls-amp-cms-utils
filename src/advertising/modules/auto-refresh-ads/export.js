/**
 * Auto-refresh ads.
 *
 * Refresh timer is only set on two conditions:
 * 1) impressionViewable is fired on the slot
 * 2) Slot's pos targeting value is in the ALWAYS_REFRESH_POS list
 */

import config from './config.json';

((window, undefined) => {
	const {
		scriptName,
		nameSpace,
		version,
		viewablePercent,
		defaultRefreshInMinutes,
		ALWAYS_REFRESH_POS = [],
	} = config;
	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	// Public access exclusion from refresh
	window._CMLS.autoRefreshAdsExclusion =
		window._CMLS?.autoRefreshAdsExclusion || [];

	// Prevent duplicates from being added to the public exclusion list
	window._CMLS.autoRefreshAdsExclusion.push = (...args) => {
		args.forEach((item) => {
			if (!this.includes(item)) {
				log.info('New ID added to exclusion list', item);
				Array.prototype.push.apply(this, [item]);
			} else {
				log.warn(
					'Attempted to add duplicate item to autoRefreshAdsExclusion list.',
					item
				);
			}
		});
		return this.length;
	};

	const init = () => {
		class adRefresher {
			log = log;

			// Time in minutes to refresh
			every = defaultRefreshInMinutes;

			// Global state conditions
			globalConditions = {
				DISABLED: 'Auto-Refresh-Ads is disabled.',
				PAUSED: 'Auto-Refresh-Ads is paused.',
				RUNNING: 'Auto-Refresh-Ads is running.',
			};

			// Slot conditions
			slotConditions = {
				OK: 'Slot is good to refresh.',
				NEVER: 'Slot is set to never refresh.',
				TARGET_NEVER: `Slot has ${this.TARGET_NEVER_REFRESH} targeting.`,
				ALWAYS: 'Slot is set to always refresh.',
				TARGET_ALWAYS: `Slot has ${this.TARGET_ALWAYS_REFRESH} targeting.`,
				EXCLUDED: 'Slot is excluded by autoRefreshAdsExclusion.',
				DISABLED: 'Refresh is disabled for this slot.',
				HIDDEN: 'Slot is not currently viewable.',
			};

			// Targeting key set for slots which should refresh on the next cycle
			TARGET_REFRESH_KEY = 'refresh';

			// Targeting key set for slots which ALWAYS refresh
			TARGET_ALWAYS_REFRESH_KEY = 'always_refresh';

			// Targeting key set for slots which NEVER refresh
			TARGET_NEVER_REFRESH_KEY = 'never_refresh';

			TARGET_TRUE = 'true';

			// Holds timers for slots
			timers = new Map();

			// Holds the interval
			interval = null;

			constructor(minutes = defaultRefreshInMinutes) {
				this.every = minutes;

				if (
					this.checkGlobalConditions() !==
					this.globalConditions.RUNNING
				) {
					return false;
				}

				const adTag = window._CMLS.adTag;

				adTag.addListener('impressionViewable', (e) => {
					const slot = e.slot;
					log.info(
						'Impression viewable',
						slot.getTargeting('pos'),
						slot.getSlotElementId(),
						slot.getTargeting(this.TARGET_REFRESH_KEY)
					);
					if (this.slotIsExcluded(slot)) {
						return;
					}
					if (!this.slotHasRefreshKey(slot)) {
						this.initSlotTimer(slot);
					}
				});

				// Check existing slots for always refreshers
				adTag.getSlots().forEach((slot) => {
					if (
						!this.slotHasRefreshKey(slot) &&
						this.slotIsAlwaysRefresh(slot) &&
						!this.slotIsExcluded(slot)
					) {
						this.initSlotTimer(slot);
					}
				});

				// Check future slots for always refreshers
				adTag.addListener('slotRenderEnded', (e) => {
					const slot = e.slot;
					if (
						!this.slotHasRefreshKey(slot) &&
						this.slotIsAlwaysRefresh(slot) &&
						!this.slotIsExcluded(slot)
					) {
						this.initSlotTimer(slot);
					}
				});

				this.interval = setInterval(() => {
					this.tick.call(this);
				}, 1000);

				return this;
			}

			/**
			 * Checks the state of the page and browser to determine if ads should refresh
			 */
			checkGlobalConditions() {
				const { DISABLED, PAUSED, RUNNING } = this.globalConditions;
				const autoReloadPage = window._CMLS?.autoReload;
				if (window.DISABLE_AUTO_REFRESH_ADS) {
					log.info(
						'DISABLE_AUTO_REFRESH_ADS is set. Ads will not refresh.'
					);
					return DISABLED;
				}
				if (
					autoReloadPage?.active &&
					autoReloadPage.settings.timeout < this.every * 2
				) {
					log.warn(
						'Auto-Reload-Page timer is less than 2x Auto-Refresh-Ads timer. Ads will not refresh'
					);
					return DISABLED;
				}

				return RUNNING;
			}

			slotIsExcluded(slot) {
				return window._CMLS.autoRefreshAdsExclusion.includes(
					slot.getSlotElementId()
				)
					? this.slotConditions.EXCLUDED
					: false;
			}

			slotIsAlwaysRefresh(slot) {
				const { ALWAYS, TARGET_ALWAYS } = this.slotConditions;
				const pos = slot.getTargeting('pos');
				const targetedAlways = slot
					.getTargeting(this.TARGET_ALWAYS_REFRESH_KEY)
					.includes(this.TARGET_TRUE);
				if (targetedAlways) {
					return TARGET_ALWAYS;
				}
				return ALWAYS_REFRESH_POS.some((check) => pos.includes(check))
					? ALWAYS
					: false;
			}

			slotHasRefreshKey(slot) {
				return slot
					.getTargeting(this.TARGET_REFRESH_KEY)
					.includes(this.TARGET_TRUE);
			}

			initSlotTimer(slot) {
				const id = slot.getSlotElementId();
				const pos = slot.getTargeting('pos');
				const fireTime = new Date(
					new Date().getTime() + this.every * 60000
				);
				const hasTimer = this.timers.has(slot);

				if (hasTimer) {
					return;
				}

				log.info(
					'Setting refresh timer on slot.',
					{ pos, id },
					fireTime.toLocaleString()
				);
				this.timers.set(slot, fireTime);
				slot.setTargeting(this.TARGET_REFRESH_KEY, this.TARGET_TRUE);
			}

			deleteTimer(slot) {
				if (this.timers.has(slot)) {
					this.timers.delete(slot);
				}
			}

			tick() {
				const now = new Date();
				if (now.getTime() % ((this.every * 60000) / 4) < 1000) {
					log.debug('Tick', now.toLocaleString());
				}

				this.timers.forEach((fireTime, slot) => {
					const id = slot.getSlotElementId();
					const pos = slot.getTargeting('pos');
					if (now >= fireTime) {
						log.info('FIRING', { pos, id });
						this.deleteTimer(slot);
						if (slot.getTargeting(this.TARGET_REFRESH_KEY)) {
							slot.clearTargeting(this.TARGET_REFRESH_KEY);
						}
						window._CMLS.adTag.refresh(slot);
					}
				});
			}

			destroy() {
				if (this.interval) {
					clearInterval(this.interval);
					this.interval = null;
				}
			}
		}

		window._CMLS[nameSpace] = new adRefresher();
	};

	if (window._CMLS.adTag) {
		window._CMLS.adTag.queue(() => {
			init();
		});
	} else {
		window.addEventListener('cmls-adtag-loaded', () => {
			window._CMLS.adTag.queue(() => {
				init();
			});
		});
	}
})(window.self);
