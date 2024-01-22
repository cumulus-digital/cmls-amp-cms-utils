import config from './config.json';

export default () => {
	const { scriptName, nameSpace, version, elementId } = config;
	const { Logger, playerTools } = window.__CMLSINTERNAL.libs;

	const log = new Logger(`${scriptName} ${version}`);

	const { waitForPlayer, detectPlayer } = playerTools;

	const doImport = () => {
		import(
			/* webpackChunkName: 'advertising/sticky-bottom-320x50' */
			'./inject-sticky-bottom-ad.js'
		);
	};

	const waiting = (resolve, reject) => {
		if (
			window.matchMedia('(min-width: 800px)').matches &&
			detectPlayer() !== 'tunegenie'
		) {
			log.debug(
				'No TuneGenie player detected on desktop, wait for player before re-injecting.'
			);
			waitForPlayer().then(() => {
				if (detectPlayer() === 'tunegenie') {
					resolve(doImport);
				} else {
					log.info(
						'Current player does not support sticky ad on desktop.'
					);
					resolve(false);
				}
			});
		} else {
			resolve(doImport);
		}
	};
	return new Promise(waiting);
};
