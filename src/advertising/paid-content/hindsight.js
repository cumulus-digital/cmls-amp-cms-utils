import createElement from 'Utils/createElement';

export default () => {
	if (window.self.NO_HINDSIGHT || window.parent.NO_HINDSIGHT) {
		return;
	}

	// Hindsight injectable station IDs
	const hindsightSites = [
		'WMAL-FM',
		'KNBR-AF',
		'WBAP-AM',
		'WLAV-FM',
		'KSFO-AM',
		'KXXR-FM',
		'WJBC-AM',
		'WLS-AM1',
		'KABC-AM',
		'KRBE-FM',
		'KTCK-AM',
		'WJR-AM1',
		'WKQX-FM',
		'KGO-AM1',
		'KMJ-AF1',
		'KQRS-FM',
		'KSCS-FM',
		'WBWN-FM',
		'KPLX-FM',
		'WPRO-AM',
		'WBNQ-FM',
		'KSAN-FM',
		'WNTQ-FM',
		'WWTN-FM',
		'WQQK-FM',
		'WWWQ-FM',
		'KLIF-FM',
		'WFMS-FM',
		'WOKI-FM',
		'WGFX-FM',
	];

	if (
		(window?._ampconfig?.settings?.syn_site_name &&
			hindsightSites.includes(
				window?._ampconfig?.settings?.syn_site_name?.toUpperCase()
			)) ||
		(window?._ampconfig?.settings?.format &&
			window?._ampconfig?.settings?.format
				?.toLowerCase()
				?.includes('news'))
	) {
		var url =
			'//static.solutionshindsight.net/teju-webclient/teju-webclient.min.js';
		return createElement.script(url);
	}
};
