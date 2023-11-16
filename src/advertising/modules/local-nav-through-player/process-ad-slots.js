/**
 * Ads with relative-ish links should navigate through the TG player
 */
(($, window, undefined) => {
	const {
		detectPlayer,
		waitForPlayer,
		navigateThroughPlayer,
		addAfterPageFrame,
	} = window._CMLS.libs.playerTools;
	const { domReady } = window._CMLS.libs;

	const scriptName = 'NAV THROUGH PLAYER';
	const nameSpace = 'navThroughPlayer';
	const version = '0.2';

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	const doc = window.document;

	if (!$) {
		log.warn('jQuery not available');
		return;
	}

	if (window._CMLS[nameSpace]) {
		return;
	}

	function localNavThroughPlayer() {
		this.updateAdIframe = (iframe) => {
			if (!iframe) {
				log.warn(
					'updateAdIframe called without an iframe. This should never happen!'
				);
				return;
			}

			if (this.isSafeFrame(iframe)) {
				return;
			}

			try {
				const links = [
					...iframe.contentWindow.document.querySelectorAll(
						'a[href]'
					),
				];
				if (!links?.length) {
					log.debug('No relevant links in iframe.', iframe);
					return;
				}
				links.forEach((link) => {
					this.updateLink(link);
				});
			} catch (e) {
				log.error('updateLinks failed!', iframe, e);
			}
		};

		this.updateLink = (link, force = false) => {
			if (!link?.href) {
				log.warn('updateLink called without a link.', link);
				return;
			}

			// Remove any existing listeners
			$(link).off(`.${nameSpace}`);

			const hostUrl = new URL(window.location.href);
			const hostOrigin = hostUrl.origin;

			const testUrl = new URL(link.href, hostOrigin);
			const testOrigin = testUrl.origin;

			let target = link.getAttribute('target');

			let isLocal = false;

			//log.info('Processing', link.href, testUrl, link);

			if (testOrigin === hostOrigin) {
				// link is local
				isLocal = true;
				log.debug('Updating local link', link, link.href, testUrl.href);
				link.setAttribute('href', testUrl.href);
			}

			if (testOrigin.includes('doubleclick')) {
				// Link is tracked, we need to handle its adurl param instead
				if (!testUrl.searchParams.has('adurl')) {
					log.warn(
						'Found doubleclick link without an adurl parameter',
						link
					);
					return;
				}
				const trackedUrl = new URL(
					testUrl.searchParams.get('adurl'),
					hostOrigin
				);
				if (trackedUrl.origin === hostOrigin) {
					// adurl is local
					testUrl.searchParams.set('adurl', trackedUrl.href);
					log.debug(
						'Updating local, tracked link',
						link,
						link.href,
						testUrl.href
					);
					link.setAttribute('href', testUrl.href);
				}
			}

			if (isLocal) {
				if (!target) {
					log.debug('Setting target of local link to "_top"');
					link.setAttribute('target', '_top');
				}
				$(link).on(`click.${nameSpace}`, this.handleClick.bind(this));
			}
		};

		this.handleClick = (e) => {
			if (!e?.currentTarget?.href) {
				log.warn('Received click event without a link?', e);
				return;
			}
			if (detectPlayer()) {
				log.debug('Intercepting click.');
				e.preventDefault();
				navigateThroughPlayer(e.currentTarget.href);
			}
		};

		this.getAdFrames = (context = doc) => {
			return [
				...context.querySelectorAll(
					'iframe[id^="google_ads_iframe"]:not([data-is-safeframe="true"]'
				),
			];
		};

		this.isSafeFrame = (iframe) => {
			const src = iframe.getAttribute('src');
			if (
				!iframe.contentWindow ||
				src?.includes('/safeframe/') ||
				src?.getAttribute('data-is-safeframe') === 'true'
			) {
				log.debug(
					'Could not access iframe content, this is a safeframe we cannot process.',
					iframe
				);
				return true;
			}
			return false;
		};

		const checkSlotRender = (e) => {
			if (e.isEmpty) {
				return;
			}
			if (!e?.slot) {
				log.warn('Caught an invalid render event', e);
				return;
			}

			const slot = e.slot;
			const elId = slot.getSlotElementId();
			let el = doc.getElementById(elId);
			if (!el) {
				return;
			}

			if (el?.tagName.toLowerCase() !== 'iframe') {
				el = el.querySelector('iframe[id^="google_ads_iframe"]');
				if (!el || this.isSafeFrame(el)) {
					return;
				}
			}

			log.debug('Caught render event', elId, slot);
			this.updateAdIframe(el);
		};

		// Update existing frames
		this.getAdFrames().forEach((iframe) => {
			this.updateAdIframe(iframe);
		});

		// Update future frames
		window._CMLS.adTag.addListener(
			'slotRenderEnded',
			checkSlotRender.bind(this)
		);

		// Remove listener when tg builds iframe
		addAfterPageFrame(() => {
			window._CMLS.adTag.removeListener(
				'slotRenderEnded',
				checkSlotRender
			);
		});
	}

	const init = () => {
		window._CMLS[nameSpace] = new localNavThroughPlayer();
	};

	if (window?._CMLS?.adTag) {
		init();
	} else {
		window.addEventListener('cmls-adtag-loaded', () => init());
	}
})(window?.jQuery, window.self);
