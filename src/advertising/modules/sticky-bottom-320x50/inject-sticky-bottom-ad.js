/**
 * Send global targeting (cms-sgroups) values as GTM events
 */
import config from './config.json';

((window) => {
	const { h, domReady, Logger, playerTools } = window.__CMLSINTERNAL.libs;
	const { waitForPlayer, detectPlayer, addAfterPageFrame } = playerTools;

	const { scriptName, nameSpace, version, elementId } = config;

	const log = new Logger(`${scriptName} ${version}`);

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
		adTag = context.__CMLSINTERNAL.adTag;
		zIndexInterval;

		constructor() {
			this.elementId = elementId;
			this.context = context;
			this.adTag = context.__CMLSINTERNAL.adTag;

			this.stub = <div id={`${this.elementId}-stub`} />;

			this.inject();
		}

		refresh() {
			if (this.slot && this.adTag) {
				log.info('Refreshing.');
				this.adTag.refresh(this.slot);
				this.updateZindex();
			} else {
				this.inject();
			}
		}

		hasDiv() {
			return this.context.document.getElementById(this.elementId);
		}

		updateZindex() {
			const adDiv = this.context.document.getElementById(this.elementId);
			const playerbar = this.context.document.getElementById('playerbar');
			const pageframe = this.context.document.querySelector(
				'iframe[name="pwm_pageFrame"]'
			);

			if (!adDiv) return;

			let playerbarZ = playerbar
				? this.context.getComputedStyle(playerbar)?.zIndex || 0
				: 0;

			if (playerbarZ) {
				playerbarZ = parseInt(playerbarZ) || 0;
			}

			let pageframeZ = pageframe
				? this.context.getComputedStyle(pageframe)?.zIndex || 0
				: 0;

			if (pageframeZ) {
				pageframeZ = parseInt(pageframeZ) || 0;
			}

			let currentZ = this.context.getComputedStyle(adDiv)?.zIndex || 0;

			if (currentZ) {
				currentZ = parseInt(currentZ) || 0;
			}

			let newZ = playerbarZ - 1;
			if (
				this.context.matchMedia('(min-width: 800px)').matches &&
				detectPlayer() === 'tunegenie'
			) {
				newZ = playerbarZ + 1;
			}
			//Math.max(currentZ, playerbarZ - 1);

			if (currentZ != newZ) {
				log.debug('Adjusting ad div z-index', { currentZ, newZ });
				adDiv.style.setProperty('z-index', newZ, 'important');
			}
		}

		inject() {
			// Don't inject on desktop without a player
			if (
				window.matchMedia('(min-width: 800px)').matches &&
				detectPlayer() !== 'tunegenie'
			) {
				log.debug(
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
				log.debug('Injecting');

				const adDiv = <div id={this.elementId} />;

				waitForPlayer().then(() => {
					adDiv.classList.add(
						'player-active',
						`player-${detectPlayer()}`
					);
					if (detectPlayer() === 'tunegenie') {
						this.zIndexInterval = setInterval(
							this.updateZindex.bind(this),
							1000
						);
					}
				});

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

				this.context.document.body.append(adDiv, this.stub);
				this.context.document.body.classList.add('has-sticky-320x50');

				log.info('Injected');

				this.adTag.queue(() => {
					this.adTag.getSlots().forEach((slot) => {
						if (slot.getSlotElementId() === this.elementId) {
							log.info('Destroying existing slot.');
							this.adTag.destroySlots([slot]);
							//return true;
						}
					});

					log.info('Defining new ad slot', this.elementId);
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
						adUnitPath: `${this.context.__CMLSINTERNAL.adPath}/stickyBottomAd`,
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

					this.adTag.addListener('slotRenderEnded', (e) => {
						if (!e.isEmpty && e.slot === this.slot) {
							log.debug('Slot returned creative.');

							if (this.context !== window.self) {
								log.debug(
									'Inside iframe, adding stub to inside page.'
								);
								const inside_stub = this.stub.cloneNode(true);
								// Apply outside stub's styles to inside stub
								const stub_style = context.getComputedStyle(
									this.stub
								);
								for (let i = 0; i < stub_style.length; i++) {
									inside_stub.style[stub_style[i]] =
										stub_style.getPropertyValue(
											stub_style[i]
										);
								}
								window.self.document.body.append(inside_stub);
								window.self.document.body.classList.add(
									'has-sticky-320x50'
								);
							}
						}
					});

					this.adTag.display(
						this.elementId,
						this.adTag.isInitialLoadDisabled()
					);
				});
			}
		}
	}

	const instantiate = () => {
		if (context?.__CMLSINTERNAL?.[nameSpace]?.hasDiv()) {
			context.__CMLSINTERNAL[nameSpace].refresh();
			return;
		}
		context.__CMLSINTERNAL[nameSpace] = new StickyBottomAd();
	};

	if (window?.__CMLSINTERNAL?.adPath) {
		instantiate();
	} else {
		window.addEventListener('cmls-adpath-discovered', () => {
			instantiate();
		});
	}
})(window.self);
