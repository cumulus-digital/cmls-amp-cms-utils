//import './styles.scss';

/**
 * Detect existance of a wallpaper ad and load the handler
 */
((window) => {
	const { h } = window._CMLS.libs;
	const scriptName = 'WALLPAPER DETECTOR';
	const nameSpace = 'wallpaperDetector';
	const version = '0.1';
	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	class WallpaperDetector {
		pos = 'wallpaper-ad';

		constructor() {
			const adTag = window._CMLS.adTag;
			let hasWallpaper = adTag
				.getSlots()
				.some((slot) => this.slotIsWallpaper(slot));

			if (!hasWallpaper) {
				this.buildSlot();
			}

			log.info('Wallpaper detector loaded');

			// Check existing slots
			window._CMLS.adTag.getSlots().some((slot) => {
				if (
					this.slotIsWallpaper(slot) &&
					this.checkSlotForCreative(slot)
				) {
					this.handleCreative(slot);
				}
			});

			// Check future slots
			window._CMLS.adTag.addListener('slotRenderEnded', (e) => {
				const slot = e.slot;
				if (this.slotIsWallpaper(slot)) {
					if (e.isEmpty) {
						window._CMLS?.wallpaperHandler?.reset();
						return;
					}
					if (this.checkSlotForCreative(slot)) {
						this.handleCreative(slot);
					}
				}
			});
		}

		slotIsWallpaper(slot) {
			return slot.getTargeting('pos').includes(this.pos);
		}

		buildSlot() {
			log.info(
				'Wallpaper tag does not exist, need to build an OOP slot.'
			);
			return;
			/*
			const adTag = window._CMLS.adTag;
			const adDiv = createElement.el('div', {
				id: `${elementId}`,
				'aria-hidden': 'true',
			});
			Object.assign(container.style, {
				position: 'relative !important',
				zIndex: '99999999 !important',
				maxWidth: '1020px !important',
				overflow: 'hidden !important',
			});
			*/
		}

		checkSlotForCreative(slot) {
			// Let's double-check the prebid targeting
			if (!slot.getTargeting('prebid')?.includes('noprebid')) {
				slot.setTargeting('noprebid', 'noprebid');
			}

			// Hide legacy slot
			const el = window.document.getElementById(slot.getSlotElementId());
			if (el) {
				el.style.setProperty('display', 'none');
			}

			if (!slot.getResponseInformation()) {
				log.info('Slot was empty.');
				window._CMLS?.wallpaperHandler?.reset();
				return false;
			}

			return true;
		}

		handleCreative(slot) {
			log.info('Slot has creative, passing to handler.');
			window.NO_SIDEWALLS = true;

			if (!window._CMLS.wallpaperHandler) {
				/*
				$script(
					window._CMLS.scriptUrlBase +
						'/advertising/wallpaper-handler.js',
					{ id: 'wallpaper-handler', defer: true }
				);
				*/
				import(
					/* webpackChunkName: 'advertising/wallpaper/wallpaper-2-handle-creative' */
					'./step2-handle-creative.js'
				).then(() => {
					window._CMLS.wallpaperHandler.process(slot);
				});
			} else {
				window._CMLS.wallpaperHandler.process(slot);
			}
			/*
			$script.ready('wallpaper-handler', () => {
				window._CMLS.wallpaperHandler.process(slot);
			});
			*/
			return true;
		}
	}

	if (window?._CMLS?.adPath) {
		window._CMLS[nameSpace] = new WallpaperDetector();
	} else {
		window.addEventListener('cmls-adpath-discovered', () => {
			window._CMLS[nameSpace] = new WallpaperDetector();
		});
	}
})(window.self);
