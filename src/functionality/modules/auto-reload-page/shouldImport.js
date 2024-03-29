export default () => {
	return new Promise((resolve) => {
		const w = window.self;
		const condition = 'body.home';

		if (
			w?._CMLS?.autoReload &&
			w._CMLS.autoReload instanceof Array &&
			w._CMLS.autoReload.length &&
			!!w?.document?.body?.matches(condition)
		) {
			resolve(() => {
				import(
					/* webpackChunkName: "functionality/auto-reload-page" */
					'./init-page-reload.js'
				);
			});
		} else {
			resolve(false);
		}
	});
};
