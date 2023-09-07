//import doDynamicImports from 'Utils/doDynamicImports';
import shouldImportShareButtons from './modules/sharebuttons/shouldImport';
import shouldImportSocialListenLive from './modules/social-listen-live/shouldImport';
import shouldImportAutoReloadPage from './modules/auto-reload-page/shouldImport';
import shouldImportSwitchStream from './modules/tgmp-switchstream/shouldImport';

const imports = [
	{
		name: 'functionality/sharebuttons',
		check: shouldImportShareButtons,
	},

	{
		name: 'functionality/social-listen-live',
		check: shouldImportSocialListenLive,
	},

	{
		name: 'functionality/auto-reload-page',
		check: shouldImportAutoReloadPage,
	},

	{
		name: 'functionality/tgmp-switchstream',
		check: shouldImportSwitchStream,
	},
];
window._CMLS.libs.doDynamicImports(imports);
