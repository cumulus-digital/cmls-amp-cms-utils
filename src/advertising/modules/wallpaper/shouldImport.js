export default () => {
	const waiting = (resolve) => {
		const { Logger } = window.__CMLSINTERNAL.libs;
		const log = new Logger('WALLPAPER AD');
		const doc = window.self.document;
		// Do not operate on FSE sites.
		if (doc.body.classList.contains('is-fse-theme')) {
			log.info('FSE detected, will not inject.');
			resolve(false);
			return;
		}
		// Do not operate on mobile.
		if (window.matchMedia('(max-width: 1100px)').matches) {
			log.info('Window is too small, will not inject.');
			resolve(false);
			return;
		}

		const resolveIfNotExists = () => {
			const adTag = window.__CMLSINTERNAL.adTag;
			let hasWallpaper = adTag
				.getSlots()
				.some((slot) =>
					slot.getTargeting('pos').includes('wallpaper-ad')
				);
			if (hasWallpaper) {
				log.info(
					'In-page Wallpaper slot exists, injecting old handler.'
				);
				resolve(() => {
					import(
						/* webpackChunkName: "advertising/wallpaper/wallpaper-1-await-creative" */
						'./old/step1-await-creative.js'
					);
				});

				return false;
			}
			log.info('Injecting wallpaper ad controller.');
			resolve(() => {
				import(
					/* webpackChunkName: "advertising/wallpaper/wallpaper-oop" */
					'./inject-oop.js'
				);
			});
		};

		if (window.__CMLSINTERNAL.adTag) {
			resolveIfNotExists();
		} else {
			window.addEventListener('cmls-adtag-loaded', () => {
				resolveIfNotExists();
			});
		}
	};
	return new Promise(waiting);
};
