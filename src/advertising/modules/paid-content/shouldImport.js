export default () => {
	const waiting = (resolve) => {
		const { getBasicPost } = window.__CMLSINTERNAL.libs;
		if (
			window.self.NO_PAIDCONTENT ||
			window.self.NO_PAID_CONTENT ||
			!getBasicPost()
		) {
			resolve(false);
		}
		resolve(() => {
			import(
				/* webpackChunkName: "advertising/paid-content" */
				'./inject-content.js'
			);
		});
	};
	return new Promise(waiting);
};
