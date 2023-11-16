export default () => {
	const waiting = (resolve) => {
		const doc = window.self.document;
		const elementId = 'gpt-pushdown';

		if (!doc.querySelector('body.home')) {
			resolve(false);
		}

		if (doc.querySelector(`#${elementId}`)) {
			log.info('Tag already exists, exiting.');
			resolve(false);
		}

		resolve(() => {
			import(
				/* webpackChunkName: "advertising/pushdown/pushdown-1-generate-tag" */
				'./step1-generate-tag.js'
			);
		});
	};
	return new Promise(waiting);
};
