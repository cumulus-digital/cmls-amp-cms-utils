((window) => {
	const { h, domReady, Logger } = window.__CMLSINTERNAL.libs;
	const scriptName = 'WALLPAPER AD';
	const nameSpace = 'wallpaperAd';
	const version = '0.4';
	const log = new Logger(`${scriptName} ${version}`);

	class WallpaperAd {
		pos = 'wallpaper-ad';
		elementId = 'gpt-wallpaper-ad';
		injectPoint =
			'.wrapper-content, body > .wp-site-blocks > header + *, body > main';
		obstructions =
			'.takeover-left,.takeover-right,.skyscraper-left,.skyscraper-right,.fs-sidewall-container,.cmls-sidewalls';

		matchMedia = '(max-width: 1100px)';

		/** @type {Window} */
		context;
		adTag;
		slot;

		/** @type {HTMLDivElement} */
		container;
		/** @type {HTMLDivElement} */
		div;

		nosidewalls;

		constructor() {
			log.info('Initializing');
			this.context = window.self;
			this.adTag = window.__CMLSINTERNAL.adTag;

			this.adTag.getSlots().some((slot) => {
				if (slot.getTargeting('pos').includes(this.pos)) {
					this.adTag.destroySlots([slot]);
					return true;
				}
			});

			if (!window.matchMedia(this.matchMedia).matches) {
				domReady(() => this.generateSlot());
			} else {
				window.matchMedia(this.matchMedia).addEventListener(
					'change',
					() => {
						if (!window.matchMedia(this.matchMedia).matches) {
							domReady(() => this.generateSlot());
						}
					},
					{ once: true }
				);
			}
		}

		generateSlot() {
			const injectPoint = this.context.document.querySelector(
				this.injectPoint
			);
			if (!injectPoint) {
				log.warn('Could not locate inject point!');
				return;
			}

			if (this.slot) {
				log.info('Slot already generated');
				return;
			}

			log.info('Generating slot');

			const style = import(
				/* webpackChunkName: 'advertising/wallpaper/oop-style' */
				'./style-oop.scss'
			).then((style) => {
				if (style?.default?.use)
					style.default.use({ target: this.context.document.body });
			});

			this.container = <div id={`${this.elementId}-container`} />;
			this.div = <div id={this.elementId} />;
			this.container.append(this.div);
			injectPoint.prepend(this.container);

			this.adTag.queue(() => {
				this.slot = this.adTag.defineSlot({
					outOfPage: true,
					adUnitPath: window.__CMLSINTERNAL.adPath + '/wallpaper',
					div: this.elementId,
					size: [[1, 1]],
					collapse: true,
					targeting: { pos: this.pos, noprebid: 'noprebid' },
					prebid: false,
				});
				if (!this.slot) {
					log.error('Could not define slot!');
					return;
				}

				this.adTag.addListener('slotRenderEnded', (e) => {
					if (e.slot !== this.slot) return;
					if (e.isEmpty) {
						this.context.document.body.classList.remove(
							'has-wallpaper-ad'
						);
						this.container.classList.remove('delivered');
						return;
					}
					if (window._CMLS.autoRefreshAdsExclusion) {
						window._CMLS.autoRefreshAdsExclusion.push(
							this.elementId
						);
					}
					this.clearObstructions();
					this.context.document.body.classList.add(
						'has-wallpaper-ad'
					);
					this.container.classList.add('delivered');
					const iframe = this.div.querySelector('iframe');
					if (iframe) {
						// check if iframe is loaded
						if (iframe.readyState === 'complete') {
							this.centerIframeContent();
						} else {
							iframe.addEventListener('load', () => {
								this.centerIframeContent();
							});
						}
					}
				});

				this.adTag.display(
					this.div,
					this.adTag.isInitialLoadDisabled()
				);
				log.info('Slot created.');
			});
		}

		centerIframeContent() {
			const iframe = this.div.querySelector('iframe');
			if (iframe) {
				const iDoc = iframe.contentWindow.document;
				if (!iDoc) {
					log.error('Could not get iframe document!');
					return;
				}
				const a = iDoc.querySelector('a[href*="/pcs/click"]');
				if (a) {
					a.style.display = 'flex';
					a.style.justifyContent = 'center';
					a.style.width = '100%';
					a.style.height = '100%';
					if (a.style.backgroundColor) {
						iDoc.body.style.backgroundColor =
							a.style.backgroundColor;
					}
				}
				const bgcolor = iDoc.querySelector('[data-bgcolor]');
				if (bgcolor) {
					iDoc.body.style.backgroundColor = bgcolor.dataset.bgcolor;
				}
			}
		}

		clearObstructions() {
			window.NO_SIDEWALLS = true;
			if (window.__CMLSINTERNAL?.sidewallAds?.destroy) {
				window.__CMLSINTERNAL.sidewallAds.destroy();
			}

			const obstructions = this.context.document.querySelectorAll(
				this.obstructions
			);
			if (obstructions?.length) {
				const ads = [];
				obstructions.forEach((obstruction) => {
					const adEls = obstruction.querySelectorAll(
						'[id^="div-gpt-ad"],[data-google-query-id],iframe[id^="google_ads_iframe"]'
					);
					if (adEls?.length) {
						adEls.forEach((adEl) => {
							let ad = adEl;
							if (ad.nodeName === 'iframe') {
								ad = adEl.parentNode;
							}
							ads.push(ad.id);
						});
					}
				});
				if (ads.length) {
					const slots = [];
					this.adTag.getSlots().forEach((slot) => {
						if (ads.includes(slot.getSlotElementId())) {
							slots.push(slot);
						}
					});
					if (slots.length) {
						log.debug('Destroying ads in obstructions.', slots);
						this.adTag.destroySlots(slots);
					}
				}
				log.debug('Removing obstructions.', obstructions);
				obstructions.forEach((obstruction) => {
					obstruction.remove();
				});
			}
		}
	}

	if (window?.__CMLSINTERNAL?.adPath) {
		window.__CMLSINTERNAL[nameSpace] = new WallpaperAd();
	} else {
		window.addEventListener('cmls-adpath-discovered', () => {
			window.__CMLSINTERNAL[nameSpace] = new WallpaperAd();
		});
	}
})(window.self);
