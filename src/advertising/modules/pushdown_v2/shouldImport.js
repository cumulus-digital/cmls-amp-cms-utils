export default () => {
	const waiting = (resolve) => {
		const doc = window.self.document;

		// Do not operate on FSE sites.
		if (!doc.body.classList.contains('home')) {
			resolve(false);
		}

		resolve(() => {
			import(
				/* webpackChunkName: "advertising/pushdown/step1-pushdown-generator" */
				'./step1-pushdown-generator.js'
			);
		});
	};
	return new Promise(waiting);
};
