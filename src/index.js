import Logger from './utils/Logger';

((window) => {
	window._CMLS = window._CMLS || {};

	const urlParams = new URLSearchParams(window.location.search);

	/**
	 * Basic single-page cmlsDebug in URL params
	 */
	if (urlParams.has('cmlsDebug')) {
		window._CMLS.debug = true;
	}

	/**
	 * cmlsEnableDebug in the URL will turn on debug for the entire session
	 */
	if (urlParams.has('cmlsEnableDebug')) {
		window.sessionStorage.setItem('cmlsDebug', 'yes');
	}

	/**
	 * Disable debug with cmlsDisableDebug
	 */
	if (urlParams.has('cmlsDisableDebug')) {
		window.sessionStorage.removeItem('cmlsDebug');
	}

	const log = new Logger('COMMON');

	log.info({
		message: `
    CMLS LIBRARY LOADED!   .__
  ____  __ __  _____  __ __|  |  __ __  ______
_/ ___\\|  |  \\/     \\|  |  \\  | |  |  \\/  ___/
\\  \\___|  |  /  Y Y  \\  |  /  |_|  |  /\___  \\
 \\___  >____/|__|_|  /____/|____/____//____  >
     \\/            \\/     Site Scripts     \\/
	`,
		headerLength: Infinity,
	});
})(window, undefined);

require('./functionality');
require('./advertising');
require('./analytics');

// Leave GTM sGroup events 'till the end
require('./analytics/gtm-cms-sgroups');
