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

		log.info('Injecting wallpaper ad controller.');
		resolve(() => {
			import(
				/* webpackChunkName: "advertising/wallpaper/wallpaper-1-await-creative" */
				//'./step1-await-creative.js'
				'./inject-oop.js'
			);
		});
	};
	return new Promise(waiting);
};
