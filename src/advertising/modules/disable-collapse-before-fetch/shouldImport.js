export default () => {
	return () => {
		import(
			/* webpackChunkName: "advertising/disable-collapse-before-fetch" */
			'./export.js'
		);
	};
};
