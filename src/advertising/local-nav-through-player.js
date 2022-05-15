/**
 * Ads with relative-ish links should navigate through the TG player
 */
import Logger from 'Utils/Logger';
import {
	detectPlayer,
	waitForPlayer,
	navigateThroughPlayer,
	addAfterPageFrame,
} from 'Utils/playerTools';
import domReady from 'Utils/domReady';
import createElement from 'Utils/createElement';

(($, window, undefined) => {
	const scriptName = 'NAV THROUGH PLAYER',
		nameSpace = 'navThroughPlayer',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	if (!$) {
		log.warn('jQuery not available');
		return;
	}

	window._CMLS = window._CMLS || {};
	window._CMLS[nameSpace] = {};

	const updateAdIframe = (iframe) => {
		if (!iframe) {
			log.warn(
				'updateAdIframe called without an iframe! This should never happen.'
			);
			return;
		}

		// make sure we can access content in this iframe
		const src = iframe.getAttribute('src');
		if (
			src &&
			(!src.includes(window.location.hoostname) ||
				src.includes('/safeframe/'))
		) {
			log.info('iframe is a safeframe, skipping.');
			return;
		}

		try {
			const $iframe = iframe.jquery ? iframe : $(iframe);
			const links = $iframe
				.contents()
				.find(
					'a[target="_self"],a[target="_top"],a[target="_parent"],a[href*="adurl=/"]'
				);
			if (links.length) {
				links.each((i, link) => updateLink(link));
			} else {
				log.info('No relevant links in iframe');
			}
		} catch (e) {
			log.info('updateLinks failed', e);
		}
	};

	const updateLink = (link, force) => {
		if (!link) {
			log.info('updateLink called without a link?', link);
			return;
		}

		const $link = link.jquery ? link : $(link);
		const testLink = createElement.el('a', { href: $link.prop('href') });
		const testURL = new URL(testLink.href);

		// Modify DFP clickthrough links with relative destination URLs
		// https://adclick.g.doubleclick.net/pcs/click?xai=AKAOjsuvjv8o-MlaMVicrisvj4oUF99EfgdZlQTft_qATngPo-agSxGvJJfpZIdv8lpTnPijPwvHFd1A63O55CPoXAXsiutchSikcVVlu0SRF0lcJAuJ0P8cMPDIMI2fH3pT_EO3VBcav_GBGmT7X1yl9PIZHTTMY34mCfLj1rwSRJvuIXARMXVeXzNdKLExKo41Xro_c4_7-oICux_fvv6X6BF_qo_9beWVsoKJCu4U8M1ZBZQIgXCLmpfsyw&sig=Cg0ArKJSzCv5yAsBtw7xEAE&urlfix=1&adurl=/2019/04/08/bbmas-t2w/
		// https://adclick.g.doubleclick.net/pcs/click?xai=AKAOjsvw4br-d0qrU4kyoGKAPTkjV23vKmjv5ZtUqiN5FUIvHvGUVsyzD3GIcTZwaWpzX7Iy8XG5ANHDFd4RZWl7mwQdzYOh-XuOnTdxtg93HIa8d4QvPClZthG8JVXTVq7XQ_m8lKJKjl-E5QIOzjG2y94ZHDvuwhmqeVxY7sXmSM2PZjnCM8KFQHwsgRAdpfXkgiaG0SlaKaeOD_9zJYryIzZf-6d3peddeDo54fDIhvJvz0IxM46aaPirng&sig=Cg0ArKJSzAlOWQms07awEAE&urlfix=1&adurl=http://www.test107.com//2019/04/08/bbmas-t2w/2019/04/08/bbmas-t2w/

		log.info('Processing', link, link.href);

		if (
			testURL.hostname.includes('doubleclick') &&
			testURL.searchParams.has('adurl') &&
			testURL.searchParams.get('adurl').indexOf('/') === 0
		) {
			log.info(
				'Found a relative link in a GPT clickthrough! Transforming...',
				link.href
			);
			link.setAttribute(
				'href',
				link
					.getAttribute('href')
					.replace(
						'adurl=/',
						'adurl=' +
							window.location.protocol +
							'//' +
							window.location.hostname +
							'/'
					)
			);
		} else if (
			link.href.indexOf('/') !== 0 &&
			testURL.hostname !== window.location.hostname
		) {
			log.info('Link contains off-site URL, will not modify.', link.href);
			return;
		} else if (link.href.indexOf('/') === 0) {
			log.info(
				'Relative link found, prepending local hostname',
				link.href
			);
			link.setAttribut(
				'href',
				window.location.protocol +
					'//' +
					window.location.hostname +
					link.getAttribute('href')
			);
			link.setAttribute('target', '_top');
		} else if (testURL.hostname === window.location.hostname) {
			log.info(
				'Local site link found, setting target to _top',
				link.href
			);
			link.setAttribute('target', '_top');
		}

		log.info('Setting ad link to navigate through player', link);
		$link.off(`.${nameSpace}`).on(`click.${nameSpace}`, (e) => {
			clickThrough(e);
		});
	};
	window._CMLS[nameSpace].updateLink = updateLink;

	const clickThrough = (e) => {
		if (!e || !e?.currentTarget?.href) {
			return;
		}
		if (detectPlayer()) {
			log.info('Intercepting click.');
			e.preventDefault();
			navigateThroughPlayer(e.currentTarget.href);
		}
	};

	const init = () => {
		// watch for future slots
		function watchSlots(e) {
			if (!e?.slot) {
				log.warn('Caught slot render event but it was invalid', e);
				return;
			}
			const slot = e.slot;
			const ID = slot.getSlotElementId();
			let el = window.document.getElementById(ID);
			if (!el) {
				log.warn(
					'Caught slot render event but element could not be found'
				);
				return;
			}

			if (el.tagName.toLowerCase() !== 'iframe') {
				el = el.querySelector('iframe[id*="google_ads_iframe"]');
			}

			if (!el) {
				log.info('Render event on slot without iframe', slot, ID, el);
				return;
			}

			log.info('Caught render event', ID, el, slot);
			updateAdIframe(el);
		}

		window._CMLS.adTag.addListener('slotRenderEnded', watchSlots);

		// Deregister listener after TG creates pageframe
		addAfterPageFrame(() => {
			window._CMLS.adTag.removeListener('slotRenderEnded', watchSlots);
		});

		const updateExisting = () => {
			$(
				'iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe, #CMLSPlayerSponsorship iframe'
			).each(function () {
				log.info('Addressing existing google ad frame', this);
				updateAdIframe(this);
			});
		};
		updateExisting();
		$(window)
			.off(`.${nameSpace}`)
			.on(`load.${nameSpace}`, () => updateExisting());
	};

	domReady(() => {
		if (window?._CMLS?.adPath) {
			init();
		} else {
			window.addEventListener('cmls-adpath-discovered', () => init());
		}
	});
})(window?.jQuery, window.self);
