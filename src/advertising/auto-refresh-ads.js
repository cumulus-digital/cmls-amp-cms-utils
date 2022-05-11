/**
 * Refreshes VISIBLE ads on a timer
 */
import Logger from 'Utils/Logger';
import {
	isVisible as isTabVisible,
	addVisibilityListener,
} from 'Utils/tabVisibility';

((window, undefined) => {
	const scriptName = 'AUTO REFRESH ADS',
		nameSpace = 'autoRefreshAds',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	if (window.location.search.includes('cmlsDisableAdRefresh')) {
		log.info('Disabled by cmlsDisableAdRefresh query');
		return;
	}

	if (window.DISABLE_AUTO_REFRESH_ADS) {
		log.info('Disabled locally with window.DISABLE_AUTO_REFRESH_ADS');
		return;
	}

	window._CMLS = window._CMLS || {};

	// Time to refresh ads in minutes
	window._CMLS.autoRefreshAdsTimer = window?._CMLS?.autoRefreshAdsTimer || 1;

	// Global refresh exclusions
	window._CMLS.autoRefreshAdsExclusion =
		window?._CMLS?.autoRefreshAdsExclusion || [];

	function init() {
		class AutoRefreshAds {
			tabVisible = true;
			timer = null;
			fireTime = null;
			state = 'off';

			constructor(fireTime) {
				if (fireTime && fireTime instanceof Date) {
					this.fireTime = fireTime;
					this.start(this.fireTime);
				}
				const me = this;
				addVisibilityListener(() => {
					// Handle unloading
					if (isTabVisible() === -1) {
						me.tabVisible = false;
					}
					log.info(
						'Caught visibility change',
						me.tabVisible,
						isTabVisible()
					);
					// Pase timer if tab goes away
					if (me.tabVisible && !isTabVisible() === true) {
						me.tabVisible = false;
					}
					// Restart timer if tab returns
					if (!me.tabVisible && isTabVisible() === true) {
						me.tabVisible = true;
					}
				});
				this.tabVisible = isTabVisible() === true ? true : false;
			}

			checkConditions() {
				if (
					window?.top?._CMLS?.autoReload &&
					window.top._CMLS.autoReload.active
				) {
					log.info('AutoReloadPAGE is active, ads will not refresh.');
					return -1;
				}
				if (window.DISABLE_AUTO_REFRESH_ADS) {
					log.info(
						'DISABLE_AUTO_REFRESH_ADS has been set, ads will not refresh.'
					);
					return -1;
				}
				if (!this.tabVisible) {
					log.info('Tab is hidden.');
					return 0;
				}
				return 1;
			}

			checkTimer() {
				const condition = this.checkConditions();
				if (condition === 1) {
					const now = new Date();
					if (Math.random() > 0.8) {
						log.debug({
							headerLength: Infinity,
							message: [
								'Checking timer (This notice is random to reduce noise)',
								[
									now.toLocaleString(),
									this.fireTime.toLocaleString(),
								],
							],
						});
					}
					if (now.getTime() >= this.fireTime.getTime()) {
						this.fire();
						return;
					}
				}
				if (condition === -1) {
					this.stop();
					return;
				}

				this.timer = setTimeout(() => this.checkTimer(), 1000);
			}

			isElVisible(el) {
				if (!el) {
					return false;
				}
				if (typeof jQuery === 'function' && el instanceof jQuery) {
					el = el[0];
				}

				// GPT may collapse an ad we want to refresh and get a new ad from
				// So we'll quickly make it visible to get a read on it
				const styleCache = el.getAttribute('style');
				if (window.getComputedStyle(el).display === 'none') {
					el.setAttribute(
						'style',
						'display:block; width:1px; height:1px'
					);
				}
				const rect = el.getBoundingClientRect();

				el.setAttribute('style', styleCache);

				if (rect?.width > 0 && rect?.height > 0) {
					rect.width = rect?.right - rect?.left;
					rect.height = rect?.bottom - rect?.top;

					if (!rect.width || !rect.height) {
						return false;
					}

					const quarterHeight = rect.height * 0.25;
					const quarterWidth = rect.width * 0.25;

					const check = {
						top: rect?.top + quarterHeight,
						right: rect?.right - quarterWidth,
						bottom: rect?.bottom - quarterHeight,
						left: rect?.left + quarterWidth,
					};

					const winHeight =
						window.innerHeight ||
						window.document.documentElement.clientHeight;
					const winWidth =
						window.innerWidth ||
						window.document.documentElement.clientWidth;

					return (
						check.bottom >= 0 &&
						check.top <= winHeight &&
						check.right >= 0 &&
						check.left <= winWidth
					);
				}

				return false;
			}

			fire() {
				const me = this;
				if (this.checkConditions() === 1) {
					window._CMLS.adTag.queue(() => {
						log.info('Refreshing viewable page ads.');
						me.resetFireTime();

						try {
							const ads = window._CMLS.adTag.pubads().getSlots();
							const visibleSlots = ads.filter((slot) => {
								const ID = slot.getSlotElementId();
								const el = window.document.getElementById(ID);
								if (!el) {
									log.info('Element not found in page', ID);
									return false;
								}
								if (
									window._CMLS.autoRefreshAdsExclusion.includes(
										ID
									)
								) {
									log.info('ID excluded', ID);
									return false;
								}
								if (el && me.isElVisible(el)) {
									return slot;
								}
							});

							if (visibleSlots.length) {
								visibleSlots.forEach((slot) => {
									log.info({
										element: slot.getSlotElementId(),
										ad_id: slot.getSlotId(),
										path: slot.getAdUnitPath(),
										sizes: slot.getSizes(),
										slot: slot,
									});
								});
								window._CMLS.adTag.refresh(visibleSlots);
							} else {
								log.info('No slots visible.');
							}
						} catch (e) {
							log.warn('Failed to refresh ads', e);
						}

						me.start();
					});
					return;
				}

				log.info('Conditions not met, skipping this cycle.');
				me.start();
			}

			checkState() {
				return this.state;
			}

			stop() {
				log.info('Stopping timer.');
				clearTimeout(this.timer);
				this.timer = null;
				this.fireTime = null;
				this.state = false;
			}

			pause() {
				log.info('Pausing timer.', this.fireTime);
				clearTimeout(this.timer);
				this.timer = null;
			}

			restart() {
				log.info('Restarting timer', this.fireTime);
				this.checkTimer();
			}

			start(fireTime) {
				this.stop();

				if (this.checkConditions() === 1) {
					if (fireTime && fireTime instanceof Date) {
						log.info(
							'Start called with an initial fire time',
							fireTime
						);
						this.fireTime = fireTime;
					} else {
						this.resetFireTime();
					}

					log.info(
						'Starting timer, will fire at ' +
							this.fireTime.toLocaleString()
					);
					this.checkTimer();
					this.state = true;
				}

				return this;
			}

			destroy() {
				this.stop();
			}

			getFireTime() {
				return this.fireTime;
			}

			resetFireTime() {
				this.fireTime = new Date(
					new Date().getTime() +
						window._CMLS.autoRefreshAdsTimer * 60000
				);
			}
		}

		try {
			window.parent._CMLS[nameSpace].destroy();
			window._CMLS[nameSpace].destroy();
		} catch (e) {}

		window._CMLS[nameSpace] = new AutoRefreshAds();
		window._CMLS[nameSpace].start();
	}

	if (window?._CMLS?.adPath) {
		init();
	} else {
		window.addEventListener('cmls-adpath-discovered', () => init());
	}
})(window.self);
