/**
 * Handles the display of received pushdown creative.
 *
 * The ad is displayed by pushing the site content down and revealing
 * the ad for a period of time, after which it disappears and returns
 * the content area to its original position. Supports the basic
 * "Image" DFP creative type for static images as well as two methods
 * for trafficking video with Custom Creative HTML code.
 *
 * "Image" creatives are displayed for a default of 15 seconds, but this
 * timout may be overridden in the creative by specifying "timeout=#" in
 * the creative's "alt" attribute, where # is a number of seconds.
 *
 * Video creatives timeout is the duration of the video.
 *
 */
((window, undefined) => {
	const { h, Fragment, Logger, lodash, playerTools, triggerEvent } =
		window.__CMLSINTERNAL.libs;
	const { throttle, debounce } = lodash;

	const scriptName = 'PUSHDOWN HANDLER';
	const nameSpace = 'pushdownHandler';
	const version = '0.1';
	const elementId = 'gpt-pushdown';
	const defaultTimeout = 15;
	const log = new Logger(`${scriptName} ${version}`);

	const doc = window.document;

	let receivedSlot;

	const creativeType = {
		VAST: 'Vast',
		VIDEO: 'Video',
		IMAGE: 'Image',
	};

	function PushdownHandler() {
		const container = doc.getElementById(`${elementId}-container`);
		const slotDiv = container.shadowRoot.getElementById(elementId);
		const closeButton = container.shadowRoot.getElementById('close');
		const timerDiv = container.shadowRoot.getElementById('timer');
		let timeOut = defaultTimeout * 1000;

		this.detectCreative = (iframe) => {
			if (!iframe) {
				log.warn('No iframe supplied to detectCreative');
				return false;
			}

			if (!iframe.contentWindow) {
				log.warn(
					'Could not get slot iframe window, is this a safe frame?'
				);
				return false;
			}

			const iDoc = iframe.contentWindow.document;

			if (iDoc.querySelector('#vpContainer')) {
				return creativeType.VAST;
			}

			if (iDoc.querySelector('video')) {
				return creativeType.VIDEO;
			}

			let slotImage =
				iDoc.querySelector('.img_ad') ||
				iDoc.querySelector(
					'img[src]:not([width="1"]):not([width="0"])'
				);
			if (slotImage) {
				return creativeType.IMAGE;
			}

			return false;
		};

		this.handleVast = (slotIframe) => {
			log.debug('Handling VAST creative.');
			const iWin = slotIframe.contentWindow;
			const iDoc = iWin.document;
			const vpContainer = iDoc.getElementById('vpContainer');

			if (!vpContainer) {
				log.warn(
					'Attempted to handle VAST creative, but no VAST content was found.'
				);
				return false;
			}

			const player = new iWin.VASTPlayer(vpContainer);
			if (!player) {
				log.warn('Could not generate VASTPlayer from vpContainer');
				return false;
			}
		};

		this.handleVideo = (slotIframe) => {
			log.debug('Handling basic video creative.');
			const iDoc = slotIframe.contentWindow.document;
			const video = iDoc.querySelector('video');
			const sources = video.querySelector('source');

			if (!video) {
				log.warn(
					'Attempted to handle video creative, but no video tag could be found.'
				);
				return false;
			}

			if (!video?.canPlayType) {
				log.warn('Client browser does not support this video format.');
				return false;
			}

			const attrs = {
				controls: false,
				muted: true,
				playsinline: true,
				autoplay: false,
			};
			for (key in attrs) {
				video.setAttribute(key, attrs[key]);
			}

			video.addEventListener('mouseover', () =>
				video.setAttribute('muted', false)
			);
			video.addEventListener('mouseout', () =>
				video.setAttribute('muted', true)
			);

			video.addEventListener('playing', () =>
				triggerEvent(timerDiv, 'cmls.start', {
					duration: video.duration,
				})
			);
			video.addEventListener('ended', () =>
				triggerEvent(container, 'cmls.hide')
			);

			video.addEventListener('canplaythrough', () =>
				triggerEvent(container, 'cmls.show')
			);
		};

		this.handleImage = (slotIframe) => {
			log.debug('Handling image creative');
			const iDoc = slotIframe.contentWindow.document;

			const imageStyle = (
				<style>{`
				a { display: block; }
				img[src]:not([width="1"]):not([width="0"]) {
					display: block;
					width: auto !important;
					height: auto !important;
					max-width: 100%;
					object-fit: cover;
				}
			`}</style>
			);
			iDoc.body.append(imageStyle);

			const image = iDoc.querySelector(
				'img[src]:not([width="1"]):not([width="0"])'
			);

			// Get the image height
			const computedStyle = window.getComputedStyle(image);
			log.debug(
				window.getComputedStyle(iDoc.body).height,
				computedStyle.height
			);
			const height =
				parseInt(computedStyle?.height) || image.offsetHeight;
			container.style.setProperty(
				'--height',
				height ? `${height}px` : '56.25%'
			);

			// Check if image has a custom timeout
			timeOut = defaultTimeout;
			const customTimeout = image
				.getAttribute('alt')
				?.match(/timeout=(\d+)/i);
			if (customTimeout?.length) {
				timeOut = customTimeout[1];
			}

			// If localNavThroughPlayer lib is available, process links
			if (window.__CMLSINTERNAL?.navThroughPlayer) {
				[...iDoc.querySelectorAll('a[href]')].forEach((link) =>
					window.__CMLSINTERNAL?.navThroughPlayer.updateLink(link)
				);
			}

			triggerEvent(container, 'cmls.display', { duration: timeOut });
		};

		this.process = (slot) => {
			log.debug('Received process request.', slot);

			receivedSlot = slot;

			if (!slot.getResponseInformation()) {
				log.warn('Slot did not load creative.');
				return;
			}

			const slotIframe = slotDiv.querySelector('iframe');
			const creative = this.detectCreative(slotIframe);

			if (!creative) {
				log.warn('Could not detect creative.');
				return;
			}

			if (typeof this[`handle${creative}`] !== 'function') {
				log.warn(
					'Received a creative type we cannot handle?',
					creative
				);
				return;
			}

			this[`handle${creative}`](slotIframe);
		};

		container.addEventListener('cmls.hide', (e) => {
			const callback = e?.detail?.callback || null;
			log.info('Hiding.', { callback });
			triggerEvent(timerDiv, 'cmls.reset');
			slotDiv.classList.remove('show');
			const transitionEnd = () => {
				container.setAttribute('aria-hidden', 'true');
				if (receivedSlot?.addService) {
					window.googletag.destroySlots([receivedSlot]);
				}
				if (typeof callback === 'function') {
					callback.call(this);
				}
			};
			slotDiv.addEventListener('transitionend', transitionEnd.bind(this));
		});
		container.addEventListener('cmls.display', (e) => {
			duration = e?.detail?.duration || defaultTimeout;
			callback = e?.detail?.callback || null;
			log.info('Displaying.', { duration, callback });
			slotDiv.classList.add('show');
			container.removeAttribute('aria-hidden');
			triggerEvent(timerDiv, 'cmls.start', { duration, callback });
		});

		timerDiv.addEventListener('cmls.start', (e) => {
			const duration = e?.detail?.duration || defaultTimeout;
			const callback = e?.detail?.callback || null;
			log.info('Starting timer', { duration, callback });
			timerDiv.style.setProperty('--time', `${duration}s`);
			timerDiv.classList.add('start');
			const transitionEnd = () => {
				triggerEvent(container, 'cmls.hide');
				if (typeof callback === 'function') {
					callback.call(this);
				}
				timerDiv.removeEventListener('transitionend', transitionEnd);
			};
			timerDiv.addEventListener(
				'transitionend',
				transitionEnd.bind(this)
			);
		});
		timerDiv.addEventListener('cmls.reset', (e) => {
			const callback = e?.detail?.callback || null;
			timerDiv.classList.remove('start');
			timerDiv.style.removeProperty('--time');
			if (typeof callback === 'function') {
				callback.call(this);
			}
		});
	}

	if (!window.__CMLSINTERNAL[nameSpace]) {
		window.__CMLSINTERNAL[nameSpace] = new PushdownHandler();
	}
})(window.self);
