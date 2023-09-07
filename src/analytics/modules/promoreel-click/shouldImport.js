export default () => {
	return new Promise((resolve) => {
		if (window.self.document.querySelector('body.home .sliderItem')) {
			resolve(() => {
				import(
					/* webpackChunkName: "analytics/promoreel-click" */
					'./track-pr-clicks.js'
				);
			});
		}
		resolve(false);
	});
};
