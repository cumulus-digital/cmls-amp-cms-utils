export default async () => {
	const hasPlayer = await window._CMLS.libs.playerTools.waitForPlayer();
	if (hasPlayer) {
		return () => {
			import(
				/* webpackChunkName: "advertising/tgmp-event-targeting" */
				'./register-events.js'
			);
		};
	}
	return false;
};
