/**
 * Send promo reel clicks to GTM
 */
((window) => {
	const { Logger, GTM, triggerEvent } = window.__CMLSINTERNAL.libs;
	const { push: gtmPush } = GTM;
	const scriptName = 'PROMOREEL-CLICK-TO-GTM';
	const nameSpace = 'gtmPromoReelClicks';
	const version = '0.2';

	const log = new Logger(`${scriptName} ${version}`);

	if (window.__CMLSINTERNAL[nameSpace]) {
		log.warn(scriptName, 'Already registered');
		return;
	}

	window.document.body.addEventListener('click', (e) => {
		if (!e.target.matches('.sliderBody *')) {
			return;
		}
		const sliderItem = e.target.closest('.sliderItem');
		if (sliderItem) {
			let url = sliderItem.getAttribute('data-href');
			if (!url) {
				const onclick = sliderItem.getAttribute('onclick');
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
					promoreel_click_hostname: window.location.hostname,
					promoreel_click_url: url,
				});
			}
		}
	});

	window.__CMLSINTERNAL[nameSpace] = true;
})(window.self);
