import config from './config.json';

((window, undefined) => {
	const {
		h,
		Fragment,
		Logger,
		//playerTools,
		domReady,
		triggerEvent,
	} = window.__CMLSINTERNAL.libs;
	//const { addAfterPageFrame } = playerTools;
	const scriptName = `${config.scriptNamePrefix} Generator`;
	const nameSpace = `${config.namespacePrefix}Generator`;
	const version = config.version;
	const log = new Logger(`${scriptName} ${version}`);

	class PushdownGenerator {
		pos = config.pos;
		elementId = config.elementId;
		injectPoint = config.injectPointQuery;
		timeout = config.timeout;

		container;
		slotDiv;
		closeBox;
		timerDiv;

		constructor() {
			if (window?.__CMLSINTERNAL?.adPath) {
				this.init();
			} else {
				const that = this;
				window.addEventListener('cmls-adpath-discovered', () => {
					that.init.call(that);
				});
			}

			log.info('Pushdown injector loaded');
		}

		init() {
			domReady(() => {
				this.buildElement();

				this.buildSlot();
			});
		}

		buildElement() {
			if (window.document.getElementById(this.elementId)) {
				log.warn('Element already exists');
				return false;
			}

			const injectNode = window.document.querySelector(this.injectPoint);
			if (!injectNode) {
				log.warn('Could not find injection point');
				return;
			}

			const that = this;
			this.container = (
				<div
					id={`${this.elementId}-container`}
					aria-hidden="true"
					style="
						position: relative !important;
						z-index: 2 !important;
						max-width: 1020px !important;
						overflow: hidden !important;
					"
				/>
			);
			this.container.attachShadow({ mode: 'open' });

			this.container.addEventListener('cmls.show', this.show.bind(this));
			this.container.addEventListener('cmls.hide', this.hide.bind(this));

			const style = import(
				/*
					webpackChunkName: 'advertising/pushdown/style'
				*/
				'./styles.scss'
			).then((style) => {
				if (style?.default?.use) {
					style.default.use({ target: that.container.shadowRoot });
				}
			});

			this.slotDiv = <div id={this.elementId} />;
			this.container.shadowRoot.append(this.slotDiv);

			this.closeBox = (
				<a
					id="close"
					title="Close"
					style="display:none"
					onClick={(e) => {
						e.preventDefault();
						triggerEvent(that.container, 'cmls.hide');
					}}
					aria-controls={this.elementId}
				>
					✕
				</a>
			);
			this.container.shadowRoot.append(this.closeBox);

			this.timerDiv = <div id="timer" style="display:none" />;
			this.timerDiv.addEventListener(
				'cmls.start',
				this.startTimer.bind(this)
			);
			this.timerDiv.addEventListener(
				'cmls.reset',
				this.resetTimer.bind(this)
			);
			this.container.shadowRoot.append(this.timerDiv);

			injectNode.prepend(this.container);

			log.info('Element injected');
		}

		buildSlot() {
			const adTag = window.__CMLSINTERNAL.adTag;

			const hasSlot = adTag.getSlots().some((slot) => {
				if (slot.getTargeting('pos').includes(this.pos)) {
					return true;
				}
			});
			if (hasSlot) {
				log.warn('Slot already exists');
				return false;
			}

			adTag.addListener(
				'slotRenderEnded',
				this.handleRenderEvent.bind(this)
			);

			adTag.queue(() => {
				log.debug('Defining slot');
				this.slot = adTag.defineSlot({
					outOfPage: true,
					adUnitPath: window.__CMLSINTERNAL.adPath + '/pushdown',
					div: this.elementId,
					collapse: true,
					targeting: {
						pos: this.pos,
						noprebid: 'noprebid',
						refresh: 'never_refresh',
					},
					prebid: false,
				});
				if (!this.slot) {
					log.error('Could not define slot!');
					return false;
				}

				adTag.display(this.slotDiv, adTag.isInitialLoadDisabled());
				/*
				addAfterPageFrame(() => {
					adTag.destroySlots([this.slot]);
				});
				*/

				log.info('Slot initialized');
			});
		}

		handleRenderEvent(e) {
			if (!e.slot) {
				log.warn('Received an invalid render event.');
				return;
			}
			if (!e.slot.getTargeting('pos')?.includes(this.pos)) {
				return;
			}
			if (e.isEmpty) {
				log.debug('Slot is empty.');
				return;
			}

			log.debug('Received creative.');
			if (!window.__CMLSINTERNAL.pushdownHandler) {
				import(
					/* webpackChunkName: 'advertising/pushdown/step2-pushdown-handler' */
					'./step2-pushdown-handler.js'
				).then((script) => {
					window.__CMLSINTERNAL[
						`${config.namespacePrefix}Handler`
					].process(e.slot);
				});
			} else {
				window.__CMLSINTERNAL[
					`${config.namespacePrefix}Handler`
				].process(e.slot);
			}

			//adTag.removeListener('slotRenderEnded', this.handleRenderEvent);
		}

		show(e) {
			const duration = e?.detail?.duration || this.timeout;
			const callback = e?.detail?.callback || null;
			log.info('Displaying', { duration, callback });
			this.slotDiv.classList.add('show');
			this.container.removeAttribute('aria-hidden');
			triggerEvent(this.timerDiv, 'cmls.start', { duration, callback });
		}

		hide(e) {
			const callback = e?.details?.callback || null;
			const slot = e?.details?.slot || this.slot;
			log.info('Hiding', { callback });
			triggerEvent(this.timerDiv, 'cmls.reset');
			this.slotDiv.classList.remove('show');
			const transitionEnd = () => {
				this.container.setAttribute('aria-hidden', 'true');
				if (slot?.addService) {
					window.googletag.destroySlots([slot]);
				}
				if (typeof callback === 'function') {
					callback.call(this);
				}
			};
			this.slotDiv.addEventListener(
				'transitionend',
				transitionEnd.bind(this),
				{ once: true }
			);
		}

		startTimer(e) {
			const duration = e?.detail?.duration || this.timeout;
			const callback = e?.detail?.callback || null;
			log.info('Starting timer', { duration, callback });
			this.timerDiv.style.setProperty('--time', `${duration}s`);
			this.timerDiv.classList.add('start');
			const transitionEnd = () => {
				triggerEvent(this.container, 'cmls.hide');
				if (typeof callback === 'function') {
					callback.call(this);
				}
				this.timerDiv.removeEventListener(
					'transitionend',
					transitionEnd.bind(this),
					{ once: true }
				);
			};
			this.timerDiv.addEventListener(
				'transitionend',
				transitionEnd.bind(this),
				{ once: true }
			);
		}

		resetTimer(e) {
			const callback = e?.detail?.callback || null;
			log.info('Resetting timer', { callback });
			this.timerDiv.classList.remove('start');
			this.timerDiv.style.removeProperty('--time');
			if (typeof callback === 'function') {
				callback.call(this);
			}
		}
	}

	if (!window.__CMLSINTERNAL?.[nameSpace]) {
		window.__CMLSINTERNAL[nameSpace] = new PushdownGenerator();
	}
})(window.self);
