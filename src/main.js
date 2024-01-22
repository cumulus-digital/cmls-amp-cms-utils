window._CMLS = window._CMLS || {};
window.__CMLSINTERNAL = window.__CMLSINTERNAL || {};

import Logger from 'Utils/Logger';
window.__CMLSINTERNAL.Logger = Logger;
window.__CMLSINTERNAL.commonLog = new window.__CMLSINTERNAL.Logger('COMMON');

/**
 * Store script URL
 */
const scriptUrl = document.currentScript.src;
window.__CMLSINTERNAL.scriptUrl = scriptUrl;
const scriptUrlBase = scriptUrl.replace('/main.js', '');
window.__CMLSINTERNAL.scriptUrlBase = window.__CMLSINTERNAL.scriptUrl.replace(
	'/main.js',
	''
);

// Load vendor bundle
// import(
// 	/* webpackPreload: true, webpackIgnore: true */
// 	scriptUrlBase + '/vendors.js'
// );

import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

import * as playerTools from 'Utils/playerTools';
import getBasicPost from 'Utils/getBasicPost';
import createElement from 'Utils/createElement';
import { h, Fragment } from 'Utils/createElement';
import domReady from 'Utils/domReady';
import * as GTM from 'Utils/GTM';
import * as tabVisibility from 'Utils/tabVisibility';
import triggerEvent from 'Utils/triggerEvent';
import doDynamicImports from 'Utils/doDynamicImports';

window.__CMLSINTERNAL.libs = {
	//	$script,
	Logger,
	doDynamicImports,
	playerTools,
	getBasicPost,
	createElement,
	h,
	Fragment,
	domReady,
	GTM,
	tabVisibility,
	triggerEvent,
	lodash: {
		throttle,
		debounce,
	},
};

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

window.__CMLSINTERNAL.commonLog.info({
	message: `
URL BASE: ${window.__CMLSINTERNAL.scriptUrlBase}
                      __
 ______ ____ _  __ __/ /_ _____
/ __/ // /  ' \\/ // / / // (_-<
\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/
          MAIN LIBRARY LOADED`,
	headerLength: Infinity,
});

// import(
// 	/* webpackIgnore: true */ window._CMLS.scriptUrlBase +
// 		'/functionality.js'
// );
require(/* webpackPreload: true, webpackChunkName: 'functionality' */ './functionality');
