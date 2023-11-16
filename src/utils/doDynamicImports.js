import domReady from './domReady';
const urlBase = window._CMLS.scriptUrlBase;

export default (imports) => {
	const log = new window._CMLS.Logger('DYNAMIC IMPORT');
	const waitForDomReady = [];
	const immediate = [];

	imports.forEach((im) => {
		if (!im?.loadImmediately) {
			waitForDomReady.push(im);
			return;
		} else {
			immediate.push(im);
		}
	});

	const getPath = async (im) => {
		if (typeof im === 'object') {
			if (im?.check) {
				let checked = false;
				if (typeof im.check === 'function') {
					checked = await im.check();
				} else {
					checked = im.check;
				}
				if (checked) {
					return im?.path || false;
				}
				return false;
			}
			if (im?.path) {
				return im.path;
			}
		}
		if (typeof im === 'string' || im instanceof String) {
			return im;
		}
		return false;
	};

	immediate.forEach(async (im) => {
		if (im.hasOwnProperty('check')) {
			const checked = await im.check();
			if (checked) {
				log.debug('Loading', im?.name || im.check?.name || im);
				checked();
			}
		}
	});

	if (waitForDomReady.length) {
		domReady(() => {
			waitForDomReady.forEach(async (im) => {
				if (im.hasOwnProperty('check')) {
					const checked = await im.check();
					if (checked) {
						log.debug(
							'Loading (DR)',
							im?.name || im.check?.name || im
						);
						checked();
					}
				}
			});
		});
	}
};
