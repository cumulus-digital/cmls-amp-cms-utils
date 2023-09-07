//import doDynamicImports from 'Utils/doDynamicImports';
import shouldImportTGMPTracking from './modules/tgmp-events-to-gtm/shouldImport';
import shouldImportPromoreelClick from './modules/promoreel-click/shouldImport';

const domReady = window._CMLS.libs.domReady;

const imports = [
	{
		name: 'analytics/sgroups-to-gtm',
		check: () => {
			import(
				/* webpackPreload: true */
				/* webpackChunkName: 'analytics/sgroups-to-gtm' */
				'./modules/sgroups-to-gtm/export.js'
			);
		},
	},
	{
		name: 'analytics/tabvisibility-to-gtm',
		check: () => {
			import(
				/* webpackPreload: true */
				/* webpackChunkName: 'analytics/tabvisibility-to-gtm' */
				'./modules/tabvisibility-to-gtm/export.js'
			);
		},
	},

	{
		name: 'analytics/tgmp-events-to-gtm',
		check: shouldImportTGMPTracking,
	},

	{
		name: 'analytics/promoreel-click',
		check: shouldImportPromoreelClick,
	},
];
window._CMLS.libs.doDynamicImports(imports);
