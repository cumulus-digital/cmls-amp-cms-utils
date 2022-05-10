import createElement from 'Utils/createElement';

export default () => {
	if (window.self.NO_NEWSMAX || window.parent.NO_NEWSMAX) {
		return '';
	}
	// Don't inject if we already have Daily Wire
	if (
		window.document.querySelector(
			'#hotwire-incontent, .dwcw-widget-container'
		)
	) {
		return;
	}

	let url =
		'//static.newsmaxfeednetwork.com/web-clients/bootloaders/jtPvahXLC0BvyCYESN3Fgu/bootloader.js';
	// Mobile script
	if (window.matchMedia('only screen and (max-width: 760px)').matches) {
		url =
			'//static.newsmaxfeednetwork.com/web-clients/bootloaders/Jx44GJqslQrQU3ZULtFwdD/bootloader.js';
	}

	return createElement.script(url, {
		'data-version': '3',
		'data-url': window.document.location.href,
		'data-zone': '[ZONE]',
		'data-display-within-iframe': 'true',
	});
};
