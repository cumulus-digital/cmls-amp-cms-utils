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
					this.context.document.body.classList.add(
						'has-wallpaper-ad'
					);
					this.container.classList.add('delivered');
					this.handleCreative(e.slot);
				});

				this.adTag.display(
					this.div,
					this.adTag.isInitialLoadDisabled()
				);
				log.info('Slot created.');
			});
		}

		handleCreative(slot) {
			this.clearObstructions();

			const iframe = this.div.querySelector('iframe');
			if (!iframe) {
				log.warn('Could not find iframe!');
				return;
			}

			const iDoc = iframe.contentWindow.document;
			if (!iDoc) {
				log.error('Could not get iframe document!');
				return;
			}

			this.centerIframeContent(iframe);
			this.getBackgroundColorFromImage(iframe);
		}

		centerIframeContent(iframe) {
			const iDoc = iframe.contentWindow.document;
			const a = iDoc.querySelector('a[href*="/pcs/click"]');
			if (a) {
				a.style.display = 'flex';
				a.style.justifyContent = 'center';
				a.style.width = '100%';
				a.style.height = '100%';
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

		getBackgroundColorFromImage(iframe) {
			const iDoc = iframe.contentWindow.document;
			const a = iDoc.querySelector('a[href*="/pcs/click"]');
			if (
				a.style.backgroundColor &&
				a.style.backgroundColor !== 'none' &&
				a.style.backgroundColor !== 'transparent'
			) {
				log.info('Using background color from a tag.');
				iDoc.body.style.backgroundColor = a.style.backgroundColor;
				return;
			}

			const bgcolor = iDoc.querySelector('[data-bgcolor]');
			if (bgcolor) {
				log.info('Using background color from data-bgcolor attribute.');
				iDoc.body.style.backgroundColor = bgcolor.dataset.bgcolor;
				return;
			}

			// Get color from center of image
			log.debug('Attempting to discover color from image...');
			const slot_img = iDoc.querySelector(
				'.img_ad,img[src]:not([width="1"]):not([width="0"])'
			);
			if (!slot_img) {
				log.debug('Could not find .img_ad!');
				return;
			}

			const xhr = new XMLHttpRequest();
			xhr.onload = () => {
				if (xhr.status !== 200) {
					log.debug('Could not get image data!');
					return;
				}
				const reader = new FileReader();
				reader.onloadend = () => {
					const dataURI = reader.result;
					if (!dataURI) {
						log.debug('Could not get data URI for image');
						return;
					}

					const img = new Image();
					img.onload = () => {
						const canvas = <canvas />;
						const context = canvas.getContext('2d');
						const imageWidth =
							img.naturalWidth || img.offsetWidth || img.width;
						const imageHeight =
							img.naturalHeight || img.offsetHeight || img.height;
						const center = {
							x: imageWidth / 2,
							y: imageHeight / 2,
						};
						canvas.width = imageWidth;
						canvas.height = imageHeight;
						context.drawImage(img, 0, 0);

						const colorData = context.getImageData(
							center.x,
							center.y,
							1,
							1
						);
						if (!colorData.data) {
							log.debug('Could not get color data');
							return;
						}

						const newColor = colorData.data.slice(0, 3);
						log.info('Setting background color to', newColor);
						iDoc.body.style.backgroundColor = `rgb(${newColor.join(',')})`;
					};
				};
			};
			xhr.open('GET', slot_img.src);
			xhr.responseType = 'blob';
			xhr.send();
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
