import config from './config.json';

const { scriptName, nameSpace, version } = config;

export default () => {
	const log = new window._CMLS.Logger(`${scriptName} Loader ${version}`);
	const waiting = (resolve, reject) => {
		if (
			window.self.location.search.includes('cmlsDisableAdRefresh') ||
			window.self.DISABLE_AUTO_REFRESH_ADS
		) {
			log.info('Disabled for this site. Expand to view disablers.', {
				'window.DISABLE_AUTO_REFRESH_ADS set':
					!!window.self.DISABLE_AUTO_REFRESH_ADS,
				'cmlsDisableAdRefresh in URL':
					window.self.location.search.includes(
						'cmlsDisableAdRefresh'
					),
			});
			resolve(false);
		}
		resolve(() => {
			import(
				/* webpackChunkName: "advertising/auto-refresh-ads" */
				'./export.js'
			);
		});
	};
	return new Promise(waiting);
};
