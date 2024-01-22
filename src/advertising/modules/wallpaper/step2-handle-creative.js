//import './style-inner.scss';

((window, undefined) => {
	const { h, Logger, lodash } = window.__CMLSINTERNAL.libs;
	const { throttle, debounce } = lodash;

	const scriptName = 'WALLPAPER HANDLER';
	const nameSpace = 'wallpaperHandler';
	const classBase = 'cmls-wallpaper';
	const version = '0.1';
	const log = new Logger(`${scriptName} ${version}`);

	const doc = window.document;

	const defaults = {
		// Selector of injection node
		injectTo: '.wrapper-content',

		// Selector of content area
		contentArea: '.wrapper-content > .grid-container',

		// Selectors that should always be above the content area
		alwaysAbove: '.wrapper-header, .wrapper-footer',

		// Selectors of elements considered "obstructions",
		// which will be hidden or removed.
		// Note - We will discover ad tags within these nodes and destroy them!
		obstructions:
			'.takeover-left,.takeover-right,.skyscraper-left,.skyscraper-right,.fs-sidewall-container,.cmls-sidewalls',

		// Callback before displaying
		preDisplay: null,

		// Callback after display
		postDisplay: null,
	};

	function WallpaperHandler(options = {}) {
		// Cache elements
		this.refreshNodeCache = () => {
			Object.assign(this.nodeCache, {
				injectTo: doc.querySelector(settings.injectTo),
				contentArea: doc.querySelector(settings.contentArea),
				alwaysAbove: [...doc.querySelectorAll(settings.alwaysAbove)],
				obstructions: [...doc.querySelectorAll(settings.obstructions)],
			});
			if (!this.nodeCache.injectTo || !this.nodeCache.contentArea) {
				log.warn(this.nodeCache);
				this.reset();
				throw new Error('Could not locate important DOM nodes!');
			}
		};

		// Generate a reproducible hash from a string
		this.generateHash = (str, seed = 0) => {
			let h1 = 0xdeadbeef ^ seed,
				h2 = 0x41c6ce57 ^ seed;
			for (let i = 0, ch; i < str.length; i++) {
				ch = str.charCodeAt(i);
				h1 = Math.imul(h1 ^ ch, 2654435761);
				h2 = Math.imul(h2 ^ ch, 1597334677);
			}
			h1 =
				Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
				Math.imul(h2 ^ (h2 >>> 13), 3266489909);
			h2 =
				Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
				Math.imul(h1 ^ (h1 >>> 13), 3266489909);
			return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
		};

		// Generate the container for our wallpaper
		this.getContainer = (doNotBuild = false) => {
			const id = `${classBase}-container`;
			const className = `${classBase}-container`;
			const existing = doc.getElementById(id);
			if (existing) {
				this.nodeCache.container = existing;
				return this.nodeCache.container;
			}
			if (doNotBuild) {
				return false;
			}
			log.debug('Generating new container');
			this.refreshNodeCache();
			const container = <div id={id} class={className} />;
			container.attachShadow({ mode: 'open' });

			const style = import(
				/* webpackChunkName: 'advertising/wallpaper/style-inner' */
				'./style-inner.scss'
			).then((style) => {
				if (style?.default?.use)
					style.default.use({ target: container.shadowRoot });
			});

			this.nodeCache.injectTo.prepend(container);
			this.nodeCache.container = container;
			this.raiseContentArea();
			return this.nodeCache.container;
		};

		// Get the computed styles of the content area
		this.getComputedStyles = () => {
			if (computedStyles) {
				return computedStyles;
			}
			Object.assign(computedStyles, {
				injectTo: window.getComputedStyle(this.nodeCache.injectTo),
				contentArea: window.getComputedStyle(
					this.nodeCache.contentArea
				),
				alwaysAbove: this.nodeCache.alwaysAbove.map((n) =>
					window.getComputedStyle(n)
				),
			});
		};

		// Raise the content area above our container
		this.raiseContentArea = () => {
			const container = this.getContainer();
			const containerStyle = window.getComputedStyle(container);
			const containerZindex = parseInt(containerStyle.zIndex) || 0;
			const computedStyles = this.getComputedStyles();

			for (key in computedStyles) {
				if (
					['relative', 'static'].includes(
						computedStyles[key]?.position
					)
				) {
					log.debug(`Setting ${key} position to relative.`);
					this.nodeCache[key]?.style?.setProperty(
						'position',
						'relative'
					);
				}
				if (
					computedStyles[key]?.zIndex === 'auto' ||
					(Number.isInteger(computedStyles[key]?.zIndex) &&
						parseInt(computedStyles[key]?.zIndex) <=
							containerZindex)
				) {
					this.nodeCache[key]?.style?.setProperty(
						'z-index',
						containerZindex + 10
					);
				}
			}
		};

		this.clearObstructions = () => {
			log.debug('Clearing obstructions.', this.nodeCache.obstructions);
			const adTag = window.__CMLSINTERNAL?.adTag;

			// Handle our sidewalls
			window.NO_SIDEWALLS = true;
			if (window.__CMLSINTERNAL?.sidewallAds?.destroy) {
				window.__CMLSINTERNAL?.sidewallAds?.destroy();
			}

			if (this.nodeCache.obstructions?.length) {
				this.nodeCache.obstructions.forEach((obstruction) => {
					// Destroy any ad slots in obstructions
					if (adTag) {
						const badSlots = [];
						const adEls = [
							...obstruction.querySelectorAll(
								'[id^="div-gpt-ad"],[data-google-query-id],iframe[id^="google_ads_iframe"]'
							),
						];
						if (adEls?.length) {
							adEls.forEach((adEl) => {
								let ad = adEl;
								if (ad.nodeName === 'iframe') {
									ad = adEl.parentNode;
								}
								badSlots.push(ad.id);
							});
						}
						if (badSlots.length) {
							log.debug('Found ads in obstructions', badSlots);
							const slotsToKill = [];
							adTag.getSlots().forEach((slot) => {
								if (
									badSlots.includes(slot.getSlotElementId())
								) {
									slotsToKill.push(slot);
								}
							});
							if (slotsToKill.length) {
								log.debug(
									'Found ad slots to kill',
									slotsToKill
								);
								adTag.destroySlots(slotsToKill);
							}
						}
					}
					obstruction.remove();
				});
			}
		};

		this.reset = () => {
			log.debug('Resetting.');
			const container = this.getContainer(true);
			if (container) {
				container.style.setProperty(
					'--background-color',
					'rgba(0,0,0,0)'
				);
				container.classList.remove(`${classBase}-open`);
				container.removeAttribute('data-hash');
				container.innerHTML = '';
			}
		};

		this.showContainer = () => {
			log.debug('Displaying wallpaper');
			this.getContainer().classList.add(`${classBase}-open`);
			if (typeof settings.postDisplay === 'function') {
				settings.postDisplay.call(this);
			}
		};

		// Process a slot
		this.process = (slot) => {
			log.debug('Processing request');

			const container = this.getContainer();

			const responseInfo = slot.getResponseInformation();
			const hash = [
				'advertiserId',
				'campaignId',
				'creativeId',
				'lineItemId',
			]
				.map((key) => {
					return responseInfo?.[key];
				})
				.join('');
			//const hash = this.generateHash(hashContent);

			log.debug('Generated hash', hash);

			if (hash === container.getAttribute('data-hash')) {
				log.info('Received creative which is already displaying.');
				return;
			}

			this.refreshNodeCache();

			const slotDiv = doc.getElementById(slot.getSlotElementId());
			if (!slotDiv) {
				log.warn('Could not select slot element');
				this.reset();
				return;
			}

			const slotIframe = slotDiv.querySelector('iframe');
			if (!slotIframe) {
				log.warn('Could not select slot iframe');
				this.reset();
				return;
			}
			if (
				!slotIframe.contentWindow ||
				slotIframe.getAttribute('data-is-safeframe') === 'true'
			) {
				log.warn(
					'Could not get slot iframe window, is this a safe frame?'
				);
				this.reset();
				return;
			}

			const slotInnerDiv =
				slotIframe.contentWindow.document.querySelector(
					'#google_image_div, body'
				);
			if (!slotInnerDiv) {
				log.warn('Could not get slot inner element');
				this.reset();
				return;
			}

			let slotLink = slotInnerDiv.querySelector(
				'a[target="_blank"],a[target="_top"]'
			);
			let slotImage = slotInnerDiv.querySelector('.img_ad');
			if (!slotImage) {
				slotImage = slotInnerDiv.querySelector(
					'img[src]:not([width="1"]):not([width="0"])'
				);
				if (!slotImage) {
					log.warn('No image found in ad slot');
					this.reset();
					return;
				}
			}

			// Links are sometimes relative to the current site
			const slotLinkHref = slotLink.getAttribute('href');
			const currentLocation = new URL(window.location.href);
			const baseUrl = currentLocation.origin;
			const slotLinkUrl = new URL(slotLinkHref, baseUrl);

			this.reset();
			container.setAttribute('data-hash', hash);

			if (typeof settings.preDisplay === 'function') {
				settings.preDisplay.call(this);
			}

			// Let creative set link target, but if not,
			// relative links get _top, remote get _blank.
			let target = slotLink.getAttribute('target');
			if (!target) {
				target = slotLinkUrl.origin === baseUrl ? '_top' : '_blank';
			}

			const link = slotLink ? (
				<a
					href={slotLink.getAttribute('href')}
					target={target}
					rel={target === '_blank' ? 'noopener' : ''}
				/>
			) : (
				<span />
			);

			// If navThroughPlayer library is available, attach to our link
			if (link.href && window.__CMLSINTERNAL?.navThroughPlayer) {
				window.__CMLSINTERNAL.navThroughPlayer.updateLink(link);
			}

			log.debug('Building wallpaper into container', slotLink, slotImage);

			const wrapper = <div class="wrap">{link}</div>;
			container.shadowRoot.append(wrapper);

			if (slotImage.getAttribute('alt')?.includes('contain')) {
				container.style.setProperty('--background-size: 100%');
			}

			container.style.setProperty(
				'--background-image',
				`url(${slotImage.getAttribute('src')})`
			);

			// Background color may come from creative itself
			const colorRegexp = new RegExp(
				'(#[a-z0-9]+)?(rgba([0-9,s]+))?',
				'i'
			);
			const slotBgColor = slotImage.getAttribute('alt');
			if (slotBgColor && colorRegexp.test(slotBgColor)) {
				const bgColorTest = slotBgColor.match(colorRegexp);
				if (bgColorTest?.length) {
					log.debug(
						'Setting background color from creative attribute',
						bgColorTest[1]
					);
					container.style.setProperty(
						'--background-color',
						bgColorTest[1]
					);
				}

				this.showContainer();
			} else {
				this.getBackgroundColorFromImage(slotImage).then((color) => {
					log.debug('Setting background color from image', color);
					container.style.setProperty('--background-color', color);

					this.showContainer();
				});
			}
		};

		this.getBackgroundColorFromImage = (img) => {
			if (!img || !img.getAttribute('src')) {
				return 'transparent';
			}

			log.debug('Generating background color from creative');

			const processImage = (resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = () => {
					const reader = new FileReader();
					reader.onloadend = () => {
						const dataURI = reader.result;
						if (dataURI) {
							log.debug('Got data URI for image');
							const image = new Image();
							image.onload = () => {
								const canvas = <canvas />;
								const context = canvas.getContext('2d');
								const imageWidth =
									image.naturalWidth ||
									image.offsetWidth ||
									image.width;
								const imageHeight =
									image.naturalHeight ||
									image.offsetHeight ||
									image.height;
								const center = {
									x: imageWidth / 2,
									y: imageHeight / 2,
								};
								canvas.width = imageWidth;
								canvas.height = imageHeight;
								context.drawImage(image, 0, 0);

								log.debug(
									'Getting color from image center point',
									center
								);
								const colorData = context.getImageData(
									center.x,
									center.y,
									1,
									1
								);
								if (colorData?.data) {
									log.debug('Got color!', colorData.data);
									const newColor = colorData.data.slice(0, 3);
									return resolve(
										`rgba(${newColor.join(',')}, 1)`
									);
								}
								log.warn('Could not get color data from image');
								return reject(null);
							};
							image.setAttribute('src', dataURI);
						}
					};
					reader.readAsDataURL(xhr.response);
				};
				xhr.open('GET', img.getAttribute('src'));
				xhr.responseType = 'blob';
				xhr.send();
			};
			return new Promise(processImage);
		};

		log.info('Handler loaded.');

		this.nodeCache = {};
		const computedStyles = {};
		const me = this;
		const settings = Object.assign(
			defaults,
			{
				preDisplay: this.clearObstructions,
				postDisplay: this.clearObstructions,
			},
			options
		);

		// Inject stylesheet
		import(
			/* webpackChunkName: 'advertising/wallpaper/style-outer' */
			'./styles.scss'
		).then((style) => {
			if (style?.default?.use) style.default.use();
		});

		this.refreshNodeCache();
	}

	if (!window.__CMLSINTERNAL[nameSpace]) {
		window.__CMLSINTERNAL[nameSpace] = new WallpaperHandler();
	}
})(window.self);
