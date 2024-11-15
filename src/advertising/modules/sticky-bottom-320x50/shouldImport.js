import config from './config.json';

export default () => {
	const { scriptName, nameSpace, version, elementId } = config;
	const { Logger } = window.__CMLSINTERNAL.libs;

	const log = new Logger(`${scriptName} ${version}`);

	const doImport = () => {
		import(
			/* webpackChunkName: 'advertising/sticky-bottom-320x50' */
			'./inject-sticky-bottom-ad.js'
		);
	};

	const match = '(max-width: 800px)';
	if (window.matchMedia(match).matches) {
		doImport();
	} else {
		log.info(
			'Will not init on desktop, waiting for matchMedia change to check again.',
			match
		);
		window.matchMedia(match).addEventListener(
			'change',
			() => {
				if (window.matchMedia(match).matches) {
					doImport();
				} else {
					log.info('Will not init on desktop.'.match);
				}
			},
			{ once: true }
		);
	}
};
