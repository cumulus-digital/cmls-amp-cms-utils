export default async () => {
	const hasPlayer = await window._CMLS.libs.playerTools.waitForPlayer();
	if (hasPlayer) {
		return () => {
			import(
				/* webpackChunkName: "advertising/local-nav-through-player" */ './process-ad-slots.js'
			);
		};
	}
	return false;
};
