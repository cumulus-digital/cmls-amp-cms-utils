/**
 * Send global targeting (cms-sgroups) values as GTM events
 */
import config from './config.json';

((window) => {
	const { h, domReady } = window._CMLS.libs;
	const { waitForPlayer, detectPlayer, addAfterPageFrame } =
		window._CMLS.libs.playerTools;

	const { scriptName, nameSpace, version, elementId } = config;

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	// We need to operate in the topmost window with _CMLS lib
	let context = window.self;
	[window.top, window.parent, window.self].some((w) => {
		if (w?._CMLS) {
			context = w;
			return true;
		}
	});

	class StickyBottomAd {
		elementId = elementId;
		slot = null;
		context = context;
		adTag = context._CMLS.adTag;

		constructor() {
			this.elementId = elementId;
			this.context = context;
			this.adTag = context._CMLS.adTag;

			this.inject();
		}

		refresh() {
			if (this.slot && this.adTag) {
				this.adTag.refresh(this.slot);
			}
		}

		hasDiv() {
			return this.context.document.getElementById(this.elementId);
		}

		inject() {
			// Don't inject on desktop without a player
			if (
				window.matchMedia('(min-width: 800px)').matches &&
				detectPlayer() !== 'tunegenie'
			) {
				log.info(
					'No TuneGenie player detected on desktop, wait for player before re-injecting.'
				);
				waitForPlayer().then(() => {
					if (detectPlayer() === 'tunegenie') {
						this.inject();
					}
				});
				return;
			}

			if (!this.hasDiv()) {
				log.info('Injecting...');

				const adDiv = <div id={this.elementId} />;

				let raiseDivCount = 0,
					raiseDivInterval;
				const raiseAdDiv = () => {
					if (raiseDivCount > 15) {
						clearInterval(raiseDivInterval);
						raiseDivInterval = null;
						return;
					}
					if (
						window.matchMedia('(min-width: 800px)').matches &&
						detectPlayer() === 'tunegenie'
					) {
						const playerbar =
							this.context.document.getElementById('playerbar');
						if (playerbar) {
							const computedStyle =
								this.context.getComputedStyle(playerbar);
							if (computedStyle?.zIndex) {
								const newZ = parseInt(computedStyle.zIndex) + 1;
								if (
									!adDiv.style.zIndex ||
									adDiv.style.zIndex < newZ
								) {
									log.info(
										'Raising ad div z-index above player',
										newZ,
										adDiv.style.zIndex
									);
									adDiv.style.setProperty(
										'z-index',
										newZ,
										'important'
									);
								}
							}
						}
					}
					raiseDivCount += 1;
				};

				waitForPlayer().then(() => {
					adDiv.classList.add('player-active');
					if (
						window.matchMedia('(min-width: 800px)').matches &&
						detectPlayer() === 'tunegenie'
					) {
						raiseAdDiv();
						raiseDivInterval = setInterval(() => {
							raiseAdDiv();
						}, 1000);
					}
				});

				/*
				const style = createElement.el('link', {
					id: `${this.elementId}-style`,
					rel: 'stylesheet',
					href:
						window._CMLS.scriptUrlBase +
						'/advertising/sticky-bottom-320x50.css',
				});
				this.context.document.body.append(style);
				*/
				const style = import(
					/*
						webpackChunkName: 'advertising/sticky-bottom-320x50/style'
					*/
					'./style.scss'
				).then((style) => {
					if (style?.default?.use)
						style.default.use({
							target: this.context.document.body,
						});
				});

				const stub = <div id={`${this.elementId}-stub`} />;

				this.context.document.body.append(adDiv, stub);
				this.context.document.body.classList.add('has-sticky-320x50');
			}

			this.adTag.queue(() => {
				this.adTag.getSlots().some((slot) => {
					if (slot.getSlotElementId() === this.elementId) {
						log.info('Destroying existing slot.');
						this.adTag.destroySlots([slot]);
						return true;
					}
				});

				log.info('Defining ad slot', this.elementId);
				const sizeMap = [
					[
						[800, 0],
						[
							[120, 60],
							[300, 50],
							[320, 50],
						],
					],
					[
						[0, 0],
						[
							[300, 50],
							[320, 50],
						],
					],
				];
				this.slot = this.adTag.defineSlot({
					adUnitPath: `${this.context._CMLS.adPath}/stickyBottomAd`,
					size: [
						[120, 60],
						[300, 50],
						[320, 50],
					],
					sizeMap: sizeMap,
					div: this.elementId,
					collapse: true,
					targeting: { pos: 'playersponsorlogo' },
					prebid: true,
				});

				if (!this.slot) {
					log.warn('Slot creation failed!');
					return;
				}

				this.adTag.display(
					this.elementId,
					this.adTag.isInitialLoadDisabled()
				);
			});
		}
	}

	const instantiate = () => {
		if (context._CMLS[nameSpace] instanceof StickyBottomAd) {
			context._CMLS[nameSpace].refresh();
			return;
		}
		context._CMLS[nameSpace] = new StickyBottomAd();
	};

	if (window?._CMLS?.adPath) {
		instantiate();
	} else {
		window.addEventListener('cmls-adpath-discovered', () => {
			instantiate();
		});
	}
})(window.self);
