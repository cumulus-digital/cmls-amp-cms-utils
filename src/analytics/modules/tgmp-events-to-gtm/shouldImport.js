export default async () => {
	const hasPlayer =
		await window.__CMLSINTERNAL.libs.playerTools.waitForPlayer();
	if (hasPlayer) {
		return () => {
			import(
				/* webpackChunkName: "analytics/tgmp-events-to-gtm" */
				'./register-events.js'
			);
		};
	}
	return false;
};
