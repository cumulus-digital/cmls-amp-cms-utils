/**
 * Send promo reel clicks to GTM
 */
((window) => {
	const { triggerEvent } = window._CMLS.libs;
	const { push: gtmPush } = window._CMLS.libs.GTM;
	const scriptName = 'PROMOREEL-CLICK-TO-GTM';
	const nameSpace = 'gtmPromoReelClicks';
	const version = '0.2';

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	if (window._CMLS[nameSpace]) {
		log.warn(scriptName, 'Already registered');
		return;
	}

	window.document.body.addEventListener('click', (e) => {
		if (e.target.matches('.sliderBody .sliderItem')) {
			let url = e.target.getAttribute('data-href');
			if (!url) {
				const onclick = e.target.getAttribute('onclick');
				if (onclick.contains('window.location=')) {
					let oUrl = onclick.match(
						/window\.location=['"]?(^['"]+)['"]?/
					);
					if (oUrl.length > 1) {
						url = oUrl[1];
					}
				}
				if (onclick.contains('window.open(')) {
					const nUrl = onclick.match(/window\.open\('([^']+)\)?/);
					if (nUrl.length > 1) {
						url = nUrl[1];
					}
				}
			}
			if (url?.length) {
				gtmPush({
					event: 'promoreel-click',
					promoreel_click_url: url,
				});
			}
		}
	});

	window._CMLS[nameSpace] = true;
})(window.self);
