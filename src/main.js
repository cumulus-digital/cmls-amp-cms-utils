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
                      __
 ______ ____ _  __ __/ /_ _____
/ __/ // /  ' \\/ // / / // (_-<
\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/
          MAIN LIBRARY LOADED`,
		headerLength: Infinity,
	});
})(window, undefined);

require('./functionality');
