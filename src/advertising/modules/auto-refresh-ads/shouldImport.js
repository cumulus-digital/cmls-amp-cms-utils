export default () => {
	const waiting = (resolve, reject) => {
		if (
			window.self.location.search.includes('cmlsDisableAdRefresh') ||
			window.self.DISABLE_AUTO_REFRESH_ADS
		) {
			resolve(false);
		}
		resolve(() => {
			import(
				/* webpackChunkName: "advertising/auto-refresh-ads" */
				'./export.js'
			);
		});
	};
	return new Promise(waiting);
};
