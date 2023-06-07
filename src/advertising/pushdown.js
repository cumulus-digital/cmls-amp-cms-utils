/**
 * Injects a "Pushdown" ad unit
 * Generates and injects a DFP ad tag at the start of the AMP CMS
 * ".wrapper-content" with targeting pos="pushdown" ON HOMEPAGES ONLY.
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
 * Ad dimensions are locked to 16:9 aspect ratio (1020x574) in order to
 * be responsive to device viewport.
 */
import Logger from 'Utils/Logger';
import createElement from 'Utils/createElement';
import domReady from '../utils/domReady';
import debounce from 'lodash/debounce';

(($, window, undefined) => {
	const scriptName = 'PUSHDOWN AD',
		nameSpace = 'pushdownInjector',
		version = '0.1',
		elementId = 'gpt-pushdown',
		injectPoint = '.wrapper-content, body > .wp-site-blocks > header + *',
		defaultTimeout = 15;
	let checkRenderCallback;

	const log = new Logger(`${scriptName} ${version}`);

	if (!$) {
		log.warn('jQuery not available');
		return;
	}

	const doc = window.document;
	let $container = null,
		$timerDiv = null;

	domReady(() => {
		if (!doc.querySelector('body.home')) {
			log.info('Not on homepage.');
			return;
		}

		if (doc.querySelector(`#${elementId}`)) {
			log.info('Tag already exists, exiting.');
			return;
		}

		function generate() {
			const styles = `
				#${elementId}-container {
					font-size: 24px !important;
					font-size: 5vw !important;
					font-weight: 100 !important;
					line-height: 0 !important;
					margin: 0 auto !important;
					max-width: 1020px !important;
					overflow: hidden !important;
					position: relative !important;
					z-index: 1 !important;
				}
				#${elementId} {
					position: relative;
					margin: 10px auto;
				}
				#${elementId} div[id*="google_ads"] {
					position: relative;
					padding-bottom: 56.25%;
					max-width: 100%;
					height: 0;
					overflow: hidden;
				}
				#${elementId} iframe {
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
				}
				#${elementId}-close {
					color: white !important;
					font-family: sans !important;
					text-shadow: .05em .05em .25em black;
					mix-blend-mode: exclusion;
					cursor: pointer;
					position: absolute;
					top: calc(10px + .75em);
					right: .3em;
					z-index: 100000;
				}
				#${elementId}-timer {
					background: #a33;
					width: 0;
					height: 3px;
					position: absolute;
					bottom: 7px;
					left: 0;
					z-index: 100000;
				}
				@media (min-width: 550px) {
					#${elementId}-container {
						font-size: 24px !important;
					}
				}
			`;
			if (!doc.querySelector(`#${elementId}-styles`)) {
				const styleEl = createElement.el('style', {
					id: `${elementId}-styles`,
				});
				styleEl.innerHTML = styles;
				doc.body.appendChild(styleEl);
			}

			const container = createElement.el('div', {
				id: `${elementId}-container`,
				style: 'display: none',
				'aria-hidden': 'true',
			});
			$container = $(container);
			const slot = createElement.el('div', { id: elementId });
			const closeBox = createElement.el('div', {
				id: `${elementId}-close`,
				title: 'Close',
				'aria-controls': `${elementId}-container`,
			});
			closeBox.innerText = '✕';
			const timerDiv = createElement.el('div', {
				id: `${elementId}-timer`,
			});
			$timerDiv = $(timerDiv);

			$container.append([slot, closeBox, timerDiv]);

			closeBox.addEventListener('click', () =>
				$container.trigger('cmls.hide')
			);

			$container.on(
				'cmls.display',
				(e, duration = null, callback = null) => {
					log.info('Displaying ad.');
					if (!duration) {
						duration = defaultTimeout * 1000;
					}
					if (typeof callback !== 'function') {
						$timerDiv.trigger('cmls.start', [
							duration,
							() => {
								$container.trigger('cmls.hide');
							},
						]);
					}
					$container.find(`${elementId}`).show();
					$container.stop().clearQueue().slideDown('fast', callback);
					$container.prop('aria-hidden', false);
				}
			);
			$container.on('cmls.hide', (e, callback) => {
				log.info('Hiding ad.');
				$timerDiv.trigger('cmls.reset');
				$container.stop().clearQueue().slideUp();
				if (typeof callback === 'function') {
					callback();
				}
				$container.prop('aria-hidden', true);
			});

			$timerDiv.on('cmls.start', (e, duration, callback) => {
				log.info('Timer begins', duration);
				$timerDiv.trigger('cmls.reset', () => {
					$timerDiv.animate(
						{ width: '100%' },
						duration,
						'linear',
						callback
					);
				});
			});
			$timerDiv.on('cmls.reset', (e, callback) => {
				log.info('Resetting timer to 0');
				$timerDiv.stop().clearQueue().css('width', 0);
				if (typeof callback === 'function') {
					callback();
				}
			});

			$(injectPoint).first().prepend($container);
		}

		/**
		 * Detect creative type within an ad container
		 * @param  {jQuery} $adFrame  iframe of ad
		 * @return {(string|boolean)} Type of ad creative, "image" "vast" "video"
		 */
		function detectCreative($adFrame) {
			if (!$adFrame.length) {
				log.warn('Could not find DFP iframe within ad container.');
				return false;
			}

			try {
				$adFrame.contents();
			} catch (e) {
				log.warn(
					'Could not retrieve ad container contents, is this a safe frame?'
				);
				return false;
			}

			if ($adFrame.contents().find('#vpContainer').length) {
				return 'vast';
			}
			/*
			if ($adFrame.contents().find('.img_ad').length) {
				return 'image';
			}
			*/
			if ($adFrame.contents().find('video').length) {
				return 'video';
			}

			if ($adFrame.contents().find('a[href*="doubleclick"] img').length) {
				return 'image';
			}

			return false;
		}

		const handleCreative = {
			image: ($adFrame) => {
				log.info('Handling Image creative');
				const imgStyle = createElement.el('style');
				imgStyle.innerHTML = `
					img	{
						width: auto;
						height: auto;
						max-width: 100%;
						max-height: 100%;
						object-fit: cover
					}
				`;
				$adFrame.contents().append(imgStyle);

				/*
				const $img = $adFrame.contents().find('.img_ad');

				if (!$img.length) {
					log.warn(
						'Attempted to handle image creative which could not be found.'
					);
					return false;
				}

				// Make image responsive
				$img.css({
					width: 'auto',
					height: 'auto',
					maxWidth: '100%',
					objectFit: 'cover',
				});
				*/

				let timeout = defaultTimeout * 1000;

				// Check for timeout override
				const timeoutTest = $img.prop('alt').match(/timeout=(\d+)/i);
				if (timeoutTest?.length) {
					timeout = timeoutTest[1] * 1000;
				}

				// Trigger ad to display
				$container.trigger('cmls.display', [timeout]);
			},

			video: ($adFrame) => {
				log.info('Handling basic video creative.');
				const $video = $adFrame.contents().find('video');
				const $sources = $video.find('source');

				if (!$video.length) {
					log.warn(
						'Attempted to handle video creative which could not be found.'
					);
					return false;
				}

				if (!$video[0].canPlayType) {
					log.warn(
						'Current browser does not support this video type.'
					);
					return false;
				}

				// Get a source this browser can play
				let validSource = false;
				$sources.each((i, source) => {
					const mime = source.getAttribute('type');
					if (
						!mime ||
						!$video[0].canPlayType(mime).replace(/no/, '')
					) {
						return true;
					}
					validVideo = true;
					return false;
				});

				if (validSource === false) {
					log.warn(
						'No video source was found to be compatible with this browser.'
					);
					return false;
				}
				log.info('Video has a compatible source.');

				$video.prop({
					controls: false,
					muted: true,
					playsinline: true,
					autoplay: false,
				});
				$video.on('mouseover', () => {
					$video.prop('muted', false);
				});
				$video.on('mouseout', () => {
					$video.prop('muted', true);
				});

				// Wait for video to be ready to display
				$video.on('canplaythrough', () => {
					$container.trigger('cmls.display', 0, () => {
						$video[0].play();
					});
				});

				// When video starts playing, set the hide timer
				$video.on('playing', () => {
					$timerDiv.trigger('cmls.start', $video[0].duration * 1000);
				});

				// When video ends, hide the ad
				$video.on('ended', () => {
					$container.trigger('cmls.hide');
				});
			},
		};

		function checkRenderEvent(e) {
			if (e.slot.getSlotElementId() !== elementId) {
				return;
			}

			log.info('Caught relevant GPT render event');
			window._CMLS.adTag.removeListener(
				'slotRenderEnded',
				checkRenderEvent
			);

			if (e.isEmpty) {
				log.info('Slot was empty');
				$container.trigger('cmls.hide');
				return false;
			}

			const $adFrame = $container.find('iframe:first');
			if (!$adFrame.length) {
				log.warn(
					'Attempted to handle valid ad render, but no iframe was found.'
				);
				return false;
			}

			const adType = detectCreative($adFrame);
			if (!adType || !handleCreative.hasOwnProperty(adType)) {
				log.warn('GPT returned unsupported creative.');
				return false;
			}

			handleCreative[adType]($adFrame);
		}

		function init() {
			if (!doc.querySelector(injectPoint)) {
				log.warn('Could not find injection spot, exiting.');
				return;
			}

			generate();

			window._CMLS.adTag.addListener('slotRenderEnded', checkRenderEvent);

			window._CMLS.adTag.queue(() => {
				log.info('Defining slot', elementId);
				window._CMLS.adTag.defineSlot({
					outOfPage: true,
					adUnitPath: window._CMLS.adPath + '/pushdown',
					size: [[1020, 574]],
					div: elementId,
					collapse: true,
					targeting: { pos: 'pushdown', noprebid: 'noprebid' },
					prebid: false,
				});
				window._CMLS.adTag.display(
					elementId,
					window._CMLS.adTag.isInitialLoadDisabled()
				);
			});
			log.info('Initialized.');
		}

		if (window?._CMLS?.adPath) {
			init();
		} else {
			window.addEventListener('cmls-adpath-discovered', () => init());
		}
	});
})(window?.jQuery, window.self);
