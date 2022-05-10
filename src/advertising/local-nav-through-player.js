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
import domReady from '../utils/domReady';

(($, window, undefined) => {
	const scriptName = 'NAV THROUGH PLAYER',
		nameSpace = 'navThroughPlayer',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	if (!$) {
		log.warn('jQuery not available');
		return;
	}

	waitForPlayer().then(() => {
		const updateIframeLinks = (iframe) => {
			if (!detectPlayer()) {
				return;
			}

			if (!iframe) {
				log.warn('updateIframeLinks called without an iframe');
				return;
			}

			if (iframe?.tagName.toLowerCase() !== 'iframe') {
				log.warn('updateIframeLinks called on a non-iframe', iframe);
				return;
			}

			const $iframe = iframe.jquery ? iframe : $(iframe);

			// make sure we can access this iframe
			if (
				iframe.getAttribute('src') &&
				(!iframe
					.getAttribute('src')
					.includes(window.location.hostname) ||
					iframe.getAttribute('src').includes('/safeframe/'))
			) {
				log.info('Skipping safe frame ad', iframe);
			}

			try {
				$iframe
					.contents()
					.find(
						'a[target="_self"],a[target="_top"],a[target="_parent"]'
					)
					.each(() => {
						log.info('Updating link in slot', iframe.id, this);
						updateLink(this);
					});
			} catch (e) {
				log.warn('Unable to update links in iframe', iframe, e);
			}
		};

		const updateLink = (link) => {
			if (!detectPlayer()) {
				return;
			}
			if (!link) {
				log.warn('updateLink called without a link');
				return;
			}
			if (link?.tagName?.toLowerCase() !== 'a') {
				log.warn('updateLink called on a non-link', link);
			}

			const $link = link.jquery ? link : $(link);
			const testLink = window.document.createElement('a');
			testLink.href = $link.prop('href');

			// Modify DFP clickthrough links with relative destination URLs
			// https://adclick.g.doubleclick.net/pcs/click?xai=AKAOjsuvjv8o-MlaMVicrisvj4oUF99EfgdZlQTft_qATngPo-agSxGvJJfpZIdv8lpTnPijPwvHFd1A63O55CPoXAXsiutchSikcVVlu0SRF0lcJAuJ0P8cMPDIMI2fH3pT_EO3VBcav_GBGmT7X1yl9PIZHTTMY34mCfLj1rwSRJvuIXARMXVeXzNdKLExKo41Xro_c4_7-oICux_fvv6X6BF_qo_9beWVsoKJCu4U8M1ZBZQIgXCLmpfsyw&sig=Cg0ArKJSzCv5yAsBtw7xEAE&urlfix=1&adurl=/2019/04/08/bbmas-t2w/
			// https://adclick.g.doubleclick.net/pcs/click?xai=AKAOjsvw4br-d0qrU4kyoGKAPTkjV23vKmjv5ZtUqiN5FUIvHvGUVsyzD3GIcTZwaWpzX7Iy8XG5ANHDFd4RZWl7mwQdzYOh-XuOnTdxtg93HIa8d4QvPClZthG8JVXTVq7XQ_m8lKJKjl-E5QIOzjG2y94ZHDvuwhmqeVxY7sXmSM2PZjnCM8KFQHwsgRAdpfXkgiaG0SlaKaeOD_9zJYryIzZf-6d3peddeDo54fDIhvJvz0IxM46aaPirng&sig=Cg0ArKJSzAlOWQms07awEAE&urlfix=1&adurl=http://www.test107.com//2019/04/08/bbmas-t2w/2019/04/08/bbmas-t2w/
			if (
				testLink.href.includes('doubleclick.net') &&
				testLink.href.includes('adurl=/')
			) {
				log.info(
					'Found a DFP clickthrough with a relative link',
					testLink.href
				);
				const u = new window.URL(testLink.href);
				const usr = new window.URLSearchParams(u.search);
				const relUrl = usr.get('adurl');

				if (relUrl) {
					testLink.href = testLink.href.replace(
						'adurl=/',
						`adurl=${window.location.protocol}//${window.location.hostname}/`
					);
					$link.prop('href', testLink.href);
					log.info(
						'Modified relative clickthrough',
						relUrl,
						testLink.href
					);
				} else {
					log.warn(
						'Could not parse query string in clickthrough',
						testLink.href
					);
				}
			} else if (
				// Do not modify off-domain URLs unless forced to
				testLink.href.indexOf('/') !== 0 &&
				testLink.hostname !== window.location.hostname &&
				!force
			) {
				log.info('Off-site URL found in link, skipping', testLink);
				testLink = null;
				return;
			} else if (testLink.href.indexOf('/') === 0) {
				log.info('Relative link found', testLink);
				$link.prop('target', '_top');
			}

			log.info('Setting link to navigate through player', link);
			$link.off(`.${nameSpace}`).on(`click.${nameSpace}`, clickThrough);
			testLink = null;
		};

		const clickThrough = (e) => {
			if (e && detectPlayer()) {
				e.preventDefault();
			} else {
				return;
			}
			log.info('Intercepting click.');
			navigate(e.currentTarget.href);
		};

		const navigate = (url) => {
			try {
				// Attempt to push events through GTM
			} catch (e) {}

			log.info('Navigating through TuneGenie player', url);
			navigateThroughPlayer(url);
		};

		const init = () => {
			if (!detectPlayer()) {
				log.info('No player is active, exiting');
			}

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
						'Caught slot render event but ID could not be found'
					);
					return;
				}

				if (el.tagName.toLowerCase() !== 'iframe') {
					el = el.querySelector('iframe[id*="google_ads_iframe"]');
				}

				if (!el) {
					log.info(
						'Render event on slot without iframe',
						slot,
						ID,
						el
					);
					return;
				}

				log.info('Caught render event', ID, el, slot);
				updateIframeLinks(el);
			}

			window._CMLS.adTag.addListener('slotRenderEnded', watchSlots);

			// Deregister listener after TG creates pageframe
			addAfterPageFrame(() => {
				window._CMLS.adTag.removeListener(
					'slotRenderEnded',
					watchSlots
				);
			});

			const updateExisting = () => {
				$(
					'iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe, #CMLSPlayerSponsorship iframe'
				).each(function () {
					log.info('Addressing existing google ad frame', this);
					updateIframeLinks(this);
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
	});
})(window?.jQuery, window.self);
