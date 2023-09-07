export default () => {
	const waiting = (resolve) => {
		const doc = window.self.document;
		// Do not operate on FSE sites.
		if (doc.body.classList.contains('is-fse-theme')) {
			resolve(false);
		}
		// Do not operate on mobile.
		if (window.matchMedia('(max-width: 1100px)').matches) {
			resolve(false);
		}

		resolve(() => {
			import(
				/* webpackChunkName: "advertising/wallpaper/wallpaper-1-await-creative" */
				'./step1-await-creative.js'
			);
		});
	};
	return new Promise(waiting);
};
