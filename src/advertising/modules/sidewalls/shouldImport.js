import config from './config.json';

const scriptName = 'SIDEWALL ADS IMPORTER';
const nameSpace = 'sidewallAdsImporter';
const version = '2.1';

const log = new window._CMLS.Logger(`${scriptName} ${version}`);
const w = window.self;

export function areSidewallsAllowed() {
	if (w.NO_SIDEWALLS || w.NO_SIDE_WALLS) {
		log.info('NO_SIDEWALLS configured.');
		return false;
	}

	if (w._CMLS?.disabled?.sideWalls) {
		log.info('_CMLS.disabled.sideWalls configured.');
		return false;
	}

	if (w.document.querySelector(config.legacySelector)) {
		log.info('Legacy skyscrapers exist');
		return false;
	}

	return true;
}

export default () => {
	const waiting = (resolve, reject) => {
		setTimeout(() => {
			if (!areSidewallsAllowed()) {
				resolve(false);
				return;
			}

			resolve(() => {
				import(
					/* webpackChunkName: "advertising/sidewalls" */
					'./generate-sidewalls.js'
				);
			});
		}, config.timeToWait);
	};
	return new Promise(waiting);
};
