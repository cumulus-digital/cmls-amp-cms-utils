import config from './config.json';

((window) => {
	const { h, domReady, Logger } = window.__CMLSINTERNAL.libs;
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
		matchMedia = '(max-width: 800px)';
		maxZIndex = 2147483647;
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
				log.info('Refreshing');
				this.adTag.refresh(this.slot);
				this.updateZindex();
			} else {
				this.inject();
			}
		}

		/**
		 * Get the slot container if it exists
		 * @returns {Element|undefined}
		 */
		hasDiv() {
			return this.context.document.getElementById(this.elementId);
		}

		updateZindex() {
			const adDiv = this.hasDiv();
			if (!adDiv) return;

			const els = this.context.document.querySelectorAll('body > *');
			const currentZ =
				parseInt(this.context.getComputedStyle(adDiv)?.zIndex) || 0;
			let newZ = 0;

			[...els].some((el) => {
				const style = this.context.getComputedStyle(el);
				if (style.zIndex && style.zIndex !== 'auto') {
					const elZ = parseInt(style.zIndex);
					if (elZ >= this.maxZIndex) {
						newZ = this.maxZIndex;
						return true;
					}
					newZ = Math.min(newZ, parseInt(style.zIndex));
				}
			});

			if (currentZ !== newZ && newZ > currentZ) {
				log.debug('Adjusting z-index', { currentZ, newZ });
				adDiv.style.setProperty('z-index', newZ, 'important');
			}
		}

		inject() {
			// Don't inject on desktop
			if (!window.matchMedia(this.matchMedia).matches) {
				log.info('Will not inject on desktop.');
				return;
			}

			if (this.hasDiv()) {
				log.info('Already injected');
				return;
			}

			log.debug('Injecting ad slot');

			const adDiv = <div id={this.elementId} />;
			adDiv.classList.add('player-inactive');

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

			log.info('Injected slot, initializing ad tag.');

			this.adTag.queue(() => {
				const destroySlots = [];
				this.adTag.getSlots().forEach((slot) => {
					if (slot.getSlotElementId() === this.elementId) {
						destroySlots.push(slot);
					}
				});
				if (destroySlots.length) {
					log.info('Destroying existing slots', destroySlots);
					this.adTag.destroySlots(destroySlots);
				}

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
					targeting: {
						pos: ['playersponsorlogo', 'mobile-sticky-bottom'],
					},
					prebid: true,
				});

				if (!this.slot) {
					log.warn('Failed to define slot!');
					return;
				}

				this.adTag.addListener('slotRenderEnded', (e) => {
					if (e.isEmpty || e.slot !== this.slot) return;

					log.debug('Slot returned creative.');
					this.hasDiv().classList.add('delivered');
					this.updateZindex();
				});

				this.adTag.display(
					this.elementId,
					this.adTag.isInitialLoadDisabled()
				);
			});
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
