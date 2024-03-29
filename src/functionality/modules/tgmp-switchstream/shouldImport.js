export default async () => {
	const hasPlayer =
		await window.__CMLSINTERNAL.libs.playerTools.waitForPlayer();
	if (hasPlayer) {
		return () => {
			import(
				/* webpackChunkName: "functionality/tgmp-switchstream" */
				'./export.js'
			);
		};
	}
	return false;
};
