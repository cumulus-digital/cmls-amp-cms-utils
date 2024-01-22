export default async () => {
	const hasPlayer =
		await window.__CMLSINTERNAL.libs.playerTools.waitForPlayer();
	if (hasPlayer) {
		return () => {
			import(
				/* webpackChunkName: "functionality/social-listen-live" */
				'./init-button-listener.js'
			);
		};
	}
	return false;
};
