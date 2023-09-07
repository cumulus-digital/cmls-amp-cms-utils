const { getBasicPost } = window._CMLS.libs;

const scriptName = 'SHAREBUTTONS';
const nameSpace = 'shareButtons';
const version = '0.2';
const log = new window._CMLS.Logger(`${scriptName} ${version}`);

export default () => {
	if (document.body.classList.contains('visual-editor-mode-design')) {
		log.info('Headway visual editor detected.');
		return;
	}

	if (window.NO_ADDTHIS_HERE) {
		log.info('Share buttons prevented by window.NO_ADDTHIS_HERE');
		return;
	}

	if (window.document.body.classList.contains('home')) {
		log.info('Homepage detected.');
		return;
	}

	if (window.document.querySelector('div[class*="addthis_"]')) {
		log.info('Local already has inline addThis container.');
		return;
	}
	if (window.document.querySelector('script[src*="addthis.com"]')) {
		log.info('Local already has addthis script.');
		return;
	}
	if (window.document.querySelector('script[src*="addtoany.com"]')) {
		log.info('Local already has AddToAny script.');
		return;
	}

	if (!getBasicPost(['page-template-default'])) {
		return;
	}

	return () => {
		import(
			/* webpackChunkName: "functionality/sharebuttons" */
			'./inject-share-buttons.js'
		);
	};
};

// export default () => {
// 	return new Promise((resolve) => {
// 		if (document.body.classList.contains('visual-editor-mode-design')) {
// 			log.info('Headway visual editor detected.');
// 			resolve(false);
// 		}

// 		if (window.NO_ADDTHIS_HERE) {
// 			log.info('Share buttons prevented by window.NO_ADDTHIS_HERE');
// 			resolve(false);
// 		}

// 		if (window.document.body.classList.contains('home')) {
// 			log.info('Homepage detected.');
// 			resolve(false);
// 		}

// 		if (window.document.querySelector('div[class*="addthis_"]')) {
// 			log.info('Local already has inline addThis container.');
// 			resolve(false);
// 		}
// 		if (window.document.querySelector('script[src*="addthis.com"]')) {
// 			log.info('Local already has addthis script.');
// 			resolve(false);
// 		}
// 		if (window.document.querySelector('script[src*="addtoany.com"]')) {
// 			log.info('Local already has AddToAny script.');
// 			resolve(false);
// 		}

// 		if (!getBasicPost(['page-template-default'])) {
// 			resolve(false);
// 		}

// 		resolve(() => {
// 			import(
// 				/* webpackChunkName: "functionality/sharebuttons" */
// 				'./export.js'
// 			);
// 		});
// 	});
// };
