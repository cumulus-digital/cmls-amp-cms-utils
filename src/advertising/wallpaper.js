/**
 * Injects a 1x1 ad tag for west7
 */
import Logger from 'Utils/Logger';
import createElement from 'Utils/createElement';
import domReady from 'Utils/domReady';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

((window) => {
	const scriptName = 'WALLPAPER INJECTOR',
		nameSpace = 'wallpaperInjector',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	const doc = window.document;

	window._CMLS = window._CMLS || {};

	class WallpaperInjector {
		defaults = {
			// ID of wallpaper ad's slot div
			dfpSlotNode: '#div-gpt-ad-1418849849333-16',

			// Node selector for where to inject wallpaper
			injectionNode: '.wrapper-content',

			// Node selector for determining stick position on scroll.
			// Wallpaper will stick once it scrolls to the initial TOP
			// position of this node.
			stickNode: '.wrapper-header',

			// Content area selector
			contentNode: '.wrapper-content > .grid-container',

			// Footer selector
			footerNode: '.wrapper-footer',

			// Node selectors to hide/show along with wallpaper changes.
			obstructiveNode:
				'.takeover-left, .takeover-right, .skyscraper-left, .skyscraper-right, .fs-sidewall-container',
		};
		settings = {};
		cache = {};

		constructor(options = {}) {
			Object.assign(this.settings, this.defaults, options);

			const styleSheet = `
				.${nameSpace}-container {
					display: block !important;
					position: absolute;
					top: 0;
					left: 50%;
					z-index: 0;
					width: 100vw !important;
					height: 0 !important;
					overflow: hidden !important;
					text-align: center;
					transition: opacity 0.5s; height 0.6s, background-color 0.4s;
					opacity: 0;
					transform: translateX(-50%);
				}
				.${nameSpace}-container iframe {
					width: 100%;
					height: 100%;
					border: 0;
				}
				.${nameSpace}-container ~ .grid-container {
					transition: box-shadow 0.6s;
				}
				.${nameSpace}-open {
					height: 100% !important;
					opacity: 1;
				}
				.${nameSpace}-open ~ .grid-container {
					box-shadow: 0 0 20px rgba(0,0,0,0.3);
				}
				.${nameSpace}-fixed {
					position: fixed;
				}
				${this.settings.dfpSlotNode} {
					display: none !important;
				}
			`;
			if (!doc.getElementById(`${nameSpace}Styles`)) {
				const style = createElement.el('style');
				style.innerHTML = styleSheet;
				doc.body.append(style);
			}

			this.refreshCache();
			if (
				!this.cache.dfpSlot ||
				!this.cache.injectionNode ||
				!this.cache.contentNode
			) {
				log.info('Could not locate important DOM nodes, exiting.');
				return;
			}

			const me = this;

			// Watch for slot renders
			window._CMLS.adTag.addListener('slotRenderEnded', (e) => {
				if (e?.slot?.getTargeting('pos')?.includes('wallpaper-ad')) {
					log.info('Caught render event for wallpaper-ad');
					if (e.isEmpty) {
						log.info('Slot was empty, resetting.');
						me.reset();
					} else {
						log.info('Slot contained creative!');
						me.process();
					}
					return;
				}
			});

			me.process();
		}

		refreshCache() {
			Object.assign(this.cache, {
				dfpSlot: doc.querySelector(this.settings.dfpSlotNode),
				injectionNode: doc.querySelector(this.settings.injectionNode),
				stickNode: doc.querySelector(this.settings.stickNode),
				contentNode: doc.querySelector(this.settings.contentNode),
				footerNode: doc.querySelector(this.settings.footerNode),
				obstructiveNodes: doc.querySelectorAll(
					this.settings.obstructiveNode
				),
			});
		}

		checkSum(str, seed = 0) {
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
			return 4294967296 * (2097151 & h2) + (h1 >>> 0);
		}

		hasPassedStickPosition() {
			const scrollTop = window.scrollY;
			const offset = this.cache.injectionNode
				? this.cache.injectionNode.getBoundingClientRect().top +
				  window.scrollY
				: 0;
			if (offset < scrollTop + this.cache.stickAt) {
				return true;
			}
			return false;
		}

		isFixed() {
			const container = this.getContainer();
			return !!container.classList.contains(`${nameSpace}-fixed`);
		}

		refreshStickAtPosition() {
			log.info('Refreshing stick position.');
			this.cache.stickAt = this.cache.stickNode
				? this.cache.stickNode.getBoundingClientRect().top +
				  window.scrollY
				: 0;
			return this.cache.stickAt;
		}

		toggleFixed(fix) {
			const container = this.getContainer();
			if (this.isFixed() && fix === false) {
				log.info('Removing fixed position.');
				container.classList.remove(`${nameSpace}-fixed`);
				container.style.setProperty('top', 0);
			}
			if (!this.isFixed() && fix === true) {
				log.info('Setting position fixed.');
				container.classList.add(`${nameSpace}-fixed`);
				container.style.setProperty('top', this.cache.stickAt);
			}
		}

		trackScroll() {
			const me = this;
			me.refreshStickAtPosition();
			if (me.hasPassedStickPosition()) {
				me.toggleFixed(true);
			} else {
				me.toggleFixed(false);
			}

			me.untrackScroll();

			me.cache.scrollListener = throttle(() => {
				if (me.hasPassedStickPosition()) {
					me.toggleFixed(true);
					return;
				}
				me.toggleFixed(false);
			}, 50);

			me.cache.resizeListener = debounce(() => {
				me.refreshStickAtPosition();
			}, 1000);

			window.addEventListener('scroll', me.cache.scrollListener);
			window.addEventListener('resize', me.cache.resizeListener);

			log.info('Scroll tracking enabled.');
		}

		untrackScroll() {
			if (this.cache.scrollListener) {
				window.removeEventListener('scroll', this.cache.scrollListener);
			}
			if (this.cache.resizeListener) {
				window.removeEventListener('resize', this.cache.resizeListener);
			}
		}

		getContainer(doNotBuild = false) {
			if (this.cache?.container) {
				//return this.cache.container;
			}
			const existing = doc.querySelector(`#${nameSpace}Container`);
			if (existing) {
				this.cache.container = existing;
				return this.cache.container;
			}
			if (doNotBuild) {
				return false;
			}
			log.info('Generating new wallpaper container.');
			this.refreshCache();
			if (!this.cache.injectionNode) {
				log.warn('Could not find injection node!', this.cache);
				return;
			}
			const container = createElement.el('div', {
				id: `${nameSpace}Container`,
				class: `${nameSpace}-container`,
			});
			this.cache.injectionNode.prepend(container);
			this.cache.container = container;
			this.raiseContentArea();
			return this.cache.container;
		}

		getOriginalStyles() {
			if (!this.cache?.originalStyles) {
				const originalStyles = {
					injection: window.getComputedStyle(
						this.cache.injectionNode
					),
					content: window.getComputedStyle(this.cache.contentNode),
					footer: window.getComputedStyle(this.cache.footerNode),
				};
				this.cache.originalStyles = originalStyles;
			}
			return this.cache.originalStyles;
		}

		raiseContentArea() {
			const container = this.getContainer();
			const containerStyle = window.getComputedStyle(container);
			const originalStyles = this.getOriginalStyles();
			log.info('Checking positioning', originalStyles);
			if (
				['relative', 'static'].includes(
					originalStyles?.injection?.position
				)
			) {
				log.info('Setting injection position to relative.');
				this.cache.injectionNode.style.setProperty(
					'position',
					'relative'
				);
			}
			if (
				['reltive', 'static'].includes(
					originalStyles?.content?.position
				)
			) {
				log.info('Setting content node position to relative.');
				this.cache.contentNode.style.setProperty(
					'position',
					'relative'
				);
			}
			if (
				originalStyles?.content?.zIndex === 'auto' ||
				(Number.isInteger(originalStyles?.content?.zIndex) &&
					originalStyles?.content?.zIndex <= containerStyle.zIndex)
			) {
				log.info('Raising content area above wallpeper container.');
				this.cache.contentNode.style.setProperty(
					'z-index',
					containerStyle.zIndex + 1
				);
			}
			if (
				['relative', 'static'].includes(
					originalStyles?.footer?.position
				)
			) {
				log.info('Setting footer area position to relative.');
				this.cache.footerNode.style.setProperty('position', 'relative');
				this.cache.footerNode.style.setProperty(
					'z-index',
					containerStyle.zIndex + 2
				);
			}
		}

		show() {
			const me = this;

			log.info('Displaying wallpaper.');
			const container = this.getContainer();
			container.classList.add(`${nameSpace}-open`);

			this.trackScroll();

			// Disable freestar's side walls
			window.freestar = window.freestar || {};
			window.freestar.config = window.freestar.config || {};
			window.freestar.config.disabledProducts =
				freestar.config.disabledProducts || {};
			window.freestar.config.disabledProducts.sideWall = true;

			// Remove any obstructive nodes
			if (this.cache?.obstructiveNodes?.length) {
				log.info(
					'Dealing with obstructions',
					this.cache.obstructiveNodes
				);
				// Destroy any ad slots in obstructive nodes
				if (window._CMLS?.adTag) {
					// get GPT ad slot IDs inside obstructive nodes
					// by default we include freestar's sidewalls
					const badSlotIds = ['sidewall_left', 'sidewall_right'];
					Array.prototype.forEach.call(
						me.cache.obstructiveNodes,
						(n) => {
							const slotId =
								n.querySelector('[id^="div-gpt-ad"]');
							if (slotId?.id) {
								badSlotIds.push(slotId.id);
							}
						}
					);
					log.info('Bad slot IDs', badSlotIds);
					if (badSlotIds?.length) {
						const slotsToKill = [];
						window._CMLS.adTag
							.pubads()
							.getSlots()
							.forEach((slot) => {
								if (
									badSlotIds.includes(slot.getSlotElementId())
								) {
									slotsToKill.push(slot);
								}
							});
						log.info('Slots to kill', badSlotIds, slotsToKill);
						if (slotsToKill?.length) {
							window._CMLS.adTag
								.rawInterface()
								.destroySlots(slotsToKill);
						}
					}
				} else {
					log.warn('Could not find adTag interface!');
				}
				Array.prototype.forEach.call(this.cache.obstructiveNodes, (n) =>
					n.remove()
				);
			}
		}

		reset() {
			const container = this.getContainer();

			log.info('Resetting.');

			if (container) {
				log.info('Container exists, resetting it.');
				container.style.setProperty(
					'background-color',
					'rgba(0,0,0,0)'
				);
				container.classList.remove(`${nameSpace}-open`);
				container.classList.remove(`${nameSpace}-fixed`);
			}

			const me = this;

			return new Promise(finishRemoval);
			function finishRemoval(resolve, reject) {
				if (container) {
					log.info('Removing container');
					container.remove();
				}

				// re-enable freestar's side walls
				window.freestar = window.freestar || {};
				window.freestar.config = window.freestar.config || {};
				window.freestar.config.disabledProducts =
					freestar.config.disabledProducts || {};
				window.freestar.config.disabledProducts.sideWall = false;

				me.cache.container = null;
				me.untrackScroll();
				resolve();
			}
		}

		process() {
			const me = this;
			domReady(() => {
				me.refreshCache();
				if (!me.cache.contentNode) {
					log.warn('Content node not found, cannot build wallpaper.');
					me.reset();
					return;
				}

				log.info('Checking wallpaper request.');

				const slotIframe = me.cache.dfpSlot.querySelector('iframe');
				if (!slotIframe || !slotIframe.contentWindow) {
					log.warn(
						'No iframe in slot container, exiting.',
						slotIframe
					);
					me.reset();
					return;
				}
				const slotDiv = slotIframe.contentWindow.document.querySelector(
					'#google_image_div,body'
				);
				if (!slotDiv) {
					log.warn('Could not select slot inner div.');
					me.reset();
					return;
				}
				const slotLink = slotDiv.querySelector('a');
				const slotImage = slotDiv.querySelector('.img_ad,img');
				const slotBgColor = slotImage?.getAttribute('alt');

				if (!slotImage) {
					log.warn('No image found in ad slot.');
					me.reset();
					return;
				}

				me.reset().then(() => {
					const container = me.getContainer();

					// Generate a simple hash of the image url and link
					// so we don't inject the same background twice
					const hash = me.checkSum(
						(slotLink.length
							? slotLink.getAttribute('href') +
							  slotLink.getAttribute('target')
							: '') + slotImage.getAttribute('src')
					);
					log.info('Generated request hash.', hash);

					if (hash === container.dataset.hash) {
						log.info('Request is already handled.');
						return;
					}
					container.dataset.hash = hash;

					let bgColor = 'rgba(0,0,0,1)';
					container.style.setProperty('background-color', bgColor);
					if (slotBgColor && /\#[a-z0-9]+/i.test(slotBgColor)) {
						const bgColorTest = slotBgColor.match(/(\#[a-z0-9])/i);
						if (bgColorTest?.length > 1) {
							bgColor = bgColorTest[1];
						}
						container.style.setProperty(
							'background-color',
							bgColor
						);
					} else {
						log.info(
							'No background color in request, will attempt to discover one from image.'
						);
						me.getBackgroundColorFromImage(slotImage).then(
							(color) => {
								const container = me.getContainer();
								log.info(
									'Got updated background color',
									color,
									container
								);
								container.style.setProperty(
									'background-color',
									color
								);
							}
						);
					}

					log.info('Building new wallpaper.', slotLink);

					let link = createElement.el('span');
					if (slotLink?.href) {
						link = createElement.el('a', {
							href: slotLink.getAttribute('href'),
							target: slotLink.getAttribute('target'),
						});
					}

					// if navThroughPlayer library is available, use it
					if (link.href && window._CMLS?.navThroughPlayer) {
						window._CMLS.navThroughPlayer.updateLink(link);
					}

					// Build iframe
					const iframe = createElement.el('iframe', {
						name: `${nameSpace}Iframe`,
						scrolling: 'no',
						marginWidth: 0,
						marginHeight: 0,
						frameborder: 0,
					});

					log.info('Injecting iframe into container');
					container.append(iframe);

					const imgSrc = slotImage.getAttribute('src');
					const backgroundContain = slotImage
						.getAttribute('alt')
						?.includes('contain')
						? 'background-size: 100%'
						: '';
					const iframeStyles = `
							html,body {
								background: transparent;
								margin: 0;
								padding: 0;
								width: 100%;
								height: 100%;
							}
							body {
								background: url('${imgSrc}') no-repeat top center;
								${backgroundContain}
							}
							a {
								display: block;
								width: 100%;
								height: 100%;
								text-decoration: none;
							}
					`;
					const iframeStyleEl = createElement.el('style');
					iframeStyleEl.innerHTML = iframeStyles;

					iframe.addEventListener('load', () => {
						log.info('Injecting wallpaper into iframe.');
						iframe.contentWindow.document.body.append(
							iframeStyleEl
						);
						iframe.contentWindow.document.body.append(link);
					});
					iframe.setAttribute('src', 'about:blank');

					me.show();
				});
			});
		}

		getBackgroundColorFromImage(img = null) {
			if (!img || !img.getAttribute('src')) {
				return;
			}
			return new Promise(processImage);
			function processImage(resolve, reject) {
				const xhr = new XMLHttpRequest();
				xhr.onload = () => {
					const reader = new FileReader();
					reader.onloadend = () => {
						const dataURI = reader.result;
						if (dataURI) {
							log.info('Got data URI for image.', dataURI);
							const image = new Image();
							image.onload = () => {
								const canvas = createElement.el('canvas');
								const context = canvas.getContext('2d');
								const iW =
									image.naturalWidth ||
									image.offsetWidth ||
									image.width;
								const iH =
									image.naturalHeight ||
									image.offsetHeight ||
									image.height;
								const center = {
									x: iW / 2,
									y: iH / 2,
								};

								canvas.width = iW;
								canvas.height = iH;
								context.drawImage(image, 0, 0);

								log.info(
									'Getting color data from image center point.',
									center
								);
								const colorData = context.getImageData(
									center.x,
									center.y,
									1,
									1
								);

								if (colorData?.data) {
									log.info(
										'Got new color data!',
										colorData.data
									);
									const newColor = [
										colorData.data[0],
										colorData.data[1],
										colorData.data[2],
									];
									let bgColor = `rgba(${newColor.join(
										','
									)}, 1)`;
									return resolve(bgColor);
								}
								log.warn(
									'Could not get color data from image.'
								);
								return reject(null);
							};
							image.src = dataURI;
						}
					};
					reader.readAsDataURL(xhr.response);
				};
				xhr.open('GET', img.getAttribute('src'));
				xhr.responseType = 'blob';
				xhr.send();
			}
		}
	}

	domReady(() => {
		// Do not operate on FSE sites.
		if (doc.body.classList.contains('is-fse-theme')) {
			log.info('Is FSE site, will not handle wallpapers.');
			return;
		}
		// Do not operate on mobile.
		if (window.matchMedia('(max-width: 1100px)').matches) {
			log.info('Viewport is too narrow for wallpapers.');
			return;
		}

		if (window?._CMLS?.adPath) {
			window._CMLS[nameSpace] = new WallpaperInjector();
		} else {
			window.addEventListener('cmls-adpath-discovered', () => {
				window._CMLS[nameSpace] = new WallpaperInjector();
			});
		}
	});
})(window.self);
