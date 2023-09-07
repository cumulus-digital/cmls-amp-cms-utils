export default async () => {
	const hasPlayer = await window._CMLS.libs.playerTools.waitForPlayer();
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
