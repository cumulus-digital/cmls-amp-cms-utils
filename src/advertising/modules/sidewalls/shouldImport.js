export default () => {
	const scriptName = 'SIDEWALL ADS IMPORTER';
	const nameSpace = 'sidewallAdsImporter';
	const version = '2.1';

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);
	const w = window.self;

	const waiting = (resolve, reject) => {
		setTimeout(() => {
			if (w.NO_SIDEWALLS || w.NO_SIDE_WALLS) {
				log.info('NO_SIDEWALLS configured.');
				resolve(false);
			}

			if (w._CMLS?.disabled?.sideWalls) {
				log.info('_CMLS.disabled.sideWalls configured.');
				resolve(false);
			}

			if (
				w.document.querySelector(
					'.takeover-left div[id^="div-gpt"],.takeover-right div[id^="div-gpt"],.skyscraper-left div[id^="div-gpt"],.skyscraper-right div[id^="div-gpt"]'
				)
			) {
				log.info('Legacy skyscrapers exist');
				resolve(false);
			}

			resolve(() => {
				import(
					/* webpackChunkName: "advertising/sidewalls" */
					'./generate-sidewalls.js'
				);
			});
		}, 1500);
	};
	return new Promise(waiting);
};
