import config from './config.json';

((window, undefined) => {
	const { h, Fragment, Logger, triggerEvent } = window.__CMLSINTERNAL.libs;

	const scriptName = `${config.scriptNamePrefix} Handler`;
	const nameSpace = `${config.namespacePrefix}Handler`;
	const version = config.version;
	const log = new Logger(`${scriptName} ${version}`);

	class PushdownHandler {
		timeout = config.timeout;

		creativeTypes = {
			VAST: 'Vast',
			VIDEO: 'Video',
			IMAGE: 'Image',
		};

		generator;

		receivedSlot;

		constructor() {
			const generator =
				window?.__CMLSINTERNAL?.[`${config.namespacePrefix}Generator`];

			if (!generator) {
				log.warn(
					'Pushdown handler created without generator instance!'
				);
				return;
			}

			this.generator = generator;
		}

		detectCreative(iframe) {
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
				return this.creativeTypes.VAST;
			}

			if (iDoc.querySelector('video')) {
				return this.creativeTypes.VIDEO;
			}

			let slotImage = iDoc.querySelector(
				'.img_ad, img[src]:not([width="1"]):not([width="0"])'
			);
			if (slotImage) {
				return this.creativeTypes.IMAGE;
			}

			log.warn('Received an unknown creative type.');
			return false;
		}

		handleVast(iframe) {
			log.debug('Handling VAST creative.');

			const iWin = iframe.contentWindow;
			const iDoc = iWin.document;
			const vpContainer = iDoc.getElementById('vpContainer');

			if (!vpContainer) {
				log.warn('Could not get VAST creative container');
				return false;
			}

			const player = new iWin.VASTPlayer(vpContainer);
			if (!player) {
				log.warn('Could not generate VASTPlayer');
				return false;
			}
		}

		handleVideo(iframe) {
			log.debug('Handling basic video creative.');

			const iDoc = iframe.contentWindow.document;
			const video = iDoc.querySelector('video');
			if (!video) {
				log.warn('Could not get video element');
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
				triggerEvent(this.generator.timerDiv, 'cmls.start', {
					duration: video.duration,
				})
			);
			video.addEventListener('ended', () =>
				triggerEvent(this.generator.container, 'cmls.hide', {
					slot: this.receivedSlot,
				})
			);
			video.addEventListener('canplaythrough', () =>
				triggerEvent(this.generator.container, 'cmls.show')
			);

			log.debug('Basic video handler initialized');
		}

		handleImage(iframe) {
			log.debug('Handling image creative.');

			const iDoc = iframe.contentWindow.document;

			const imageStyle = (
				<style>
					{`
					a { display: block; }
					img[src]:not([width="1"]):not([width="0"]) {
						display: block;
						width: auto !important;
						height: auto !important;
						max-width: 100%;
						object-fit: cover;
					}
					`}
				</style>
			);
			iDoc.head.append(imageStyle);

			const image = iDoc.querySelector(
				'img[src]:not([width="1"]):not([width="0"])'
			);

			// Get the image height
			const computedStyle = window.getComputedStyle(image);
			log.debug('Image height', {
				body: window.getComputedStyle(iDoc.body).height,
				image: computedStyle.height,
			});
			const height =
				parseInt(computedStyle?.height) || image.offsetHeight;
			this.generator.container.style.setProperty(
				'--height',
				height ? `${height}px` : '56.25%'
			);

			// Check if image has a custom timeout
			let timeout = this.timeout;
			if (image.getAttribute('data-timeout')) {
				const dataTimeout = parseInt(
					image.getAttribute('data-timeout')
				);
				if (dataTimeout) {
					timeout = dataTimeout;
				}
			} else if (image.getAttribute('alt')) {
				const altTimeoutCheck = image
					.getAttribute('alt')
					.match(/timeout=(\d+)/i);
				if (altTimeoutCheck?.length) {
					const altTimeout = parseInt(altTimeoutCheck[1]);
					if (altTimeout) {
						timeout = altTimeout;
					}
				}
			}

			// If localNavThroughPlayer lib is available, process links
			if (window.__CMLSINTERNAL?.navThroughPlayer) {
				if (iDoc.querySelector('a[href]')) {
					[...iDoc.querySelectorAll('a[href]')].forEach((link) =>
						window.__CMLSINTERNAL?.navThroughPlayer.updateLink(link)
					);
				}
			}

			triggerEvent(this.generator.container, 'cmls.show', {
				duration: timeout,
			});
		}

		process(slot) {
			log.debug('Received process request.', slot);

			this.receivedSlot = slot;

			if (!slot.getResponseInformation()) {
				log.warn('Slot did not load creative.');
				return false;
			}

			const slotIframe = this.generator.slotDiv.querySelector('iframe');
			const creative = this.detectCreative(slotIframe);

			if (!creative) {
				log.warn('Could not detect creative.');
				return false;
			}

			if (typeof this[`handle${creative}`] !== 'function') {
				log.warn(
					'Received a creative type we cannot handle?',
					creative
				);
				return false;
			}

			this[`handle${creative}`](slotIframe);
		}
	}

	if (!window.__CMLSINTERNAL?.[nameSpace]) {
		window.__CMLSINTERNAL[nameSpace] = new PushdownHandler();
	}
})(window.self);
