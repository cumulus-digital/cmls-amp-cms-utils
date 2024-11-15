export default async () => {
	const hostname = window.location.hostname;
	const hostnameParts = hostname.split('.');
	if (hostnameParts.length > 2) {
		hostnameParts[0] = 'player';
	} else {
		hostnameParts.unshift('player');
	}
	const hasSoCastLink = window.document.querySelector(
		`a[href="http://${hostnameParts.join('.')}/"], a[href="https://${hostnameParts.join('.')}/"]`
	);
	if (hasSoCastLink) {
		return () => {
			import(
				/* webpackChunkName: "functionality/social-listen-live" */
				'./init-button-listener.js'
			);
		};
	}
	return false;
};
// export default async () => {
// 	const hasPlayer =
// 		await window.__CMLSINTERNAL.libs.playerTools.waitForPlayer();
// 	if (hasPlayer) {
// 		return () => {
// 			import(
// 				/* webpackChunkName: "functionality/social-listen-live" */
// 				'./init-button-listener.js'
// 			);
// 		};
// 	}
// 	return false;
// };
