export default () => {
	const { h, Logger } = window.__CMLSINTERNAL.libs;
	const scriptName = 'HINDSIGHT';
	const version = '0.1';
	const log = new Logger(`${scriptName} ${version}`);

	if (window.self.NO_HINDSIGHT || window.parent.NO_HINDSIGHT) {
		log.info('NO_HINDSIGHT found, refusing injection.');
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
		// Explicitly named
		(window?._ampconfig?.settings?.syn_site_name &&
			hindsightSites.includes(
				window?._ampconfig?.settings?.syn_site_name?.toUpperCase()
			)) ||
		// All "news" formats
		(window?._ampconfig?.settings?.format &&
			window?._ampconfig?.settings?.format
				?.toLowerCase()
				?.includes('news'))
	) {
		var url =
			'//static.solutionshindsight.net/teju-webclient/teju-webclient.min.js';
		return <script src={url} async />;
	} else {
		log.info(
			'Site is not allowlisted or a News format, refusing injection.'
		);
	}
};
