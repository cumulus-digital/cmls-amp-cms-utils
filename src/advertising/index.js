require('./interfaces');
require('./modules/register-adpath/no-export.js');
//require('./modules/sticky-bottom-320x50/no-export.js');
require('./modules/west7-1x1/no-export.js');

//import domReady from 'Utils/domReady';
//import doDynamicImports from 'Utils/doDynamicImports';
import shouldDisableCollapse from './modules/disable-collapse-before-fetch/shouldImport';
import shouldImportStickyBottom from './modules/sticky-bottom-320x50/shouldImport';
import shouldImportAutoRefreshAds from './modules/auto-refresh-ads/shouldImport';
import shouldImportLocalNavThroughPlayer from './modules/local-nav-through-player/shouldImport';
import shouldImportTGMPEventTargeting from './modules/tgmp-event-targeting/shouldImport';
import shouldImportPaidContent from './modules/paid-content/shouldImport';
import shouldImportPushdown from './modules/pushdown/shouldImport';
import shouldImportSidewalls from './modules/sidewalls/shouldImport';
import shouldImportWallpaper from './modules/wallpaper/shouldImport';

const imports = [
	{
		name: 'advertising/disable-collapse-before-fetch',
		check: shouldDisableCollapse,
	},
	{
		name: 'advertising/sticky-bottom-320x50',
		check: shouldImportStickyBottom,
	},
	{
		name: 'advertising/auto-refresh-ads',
		check: shouldImportAutoRefreshAds,
		loadImmediately: true,
		loaderOptions: { async: false, defer: false },
	},

	{
		name: 'advertising/local-nav-through-player',
		check: shouldImportLocalNavThroughPlayer,
	},

	{
		name: 'advertising/wallpaper',
		check: shouldImportWallpaper,
	},

	{
		name: 'advertising/tgmp-event-targeting',
		check: shouldImportTGMPEventTargeting,
	},

	{
		name: 'advertising/paid-content',
		check: shouldImportPaidContent,
	},

	{
		name: 'advertising/pushdown',
		check: shouldImportPushdown,
	},

	{
		name: 'advertising/sidewalls',
		check: shouldImportSidewalls,
	},
];
window._CMLS.libs.doDynamicImports(imports);
