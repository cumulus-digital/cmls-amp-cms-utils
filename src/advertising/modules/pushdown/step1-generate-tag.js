//import './styles.scss';

/**
 * Injects a "Pushdown" ad unit
 * Generates and injects a DFP ad tag at the start of the AMP CMS
 * ".wrapper-content" with targeting pos="pushdown" ON HOMEPAGES ONLY.
 */
((window, undefined) => {
	const { h, Logger, triggerEvent, playerTools } = window.__CMLSINTERNAL.libs;
	const { addAfterPageFrame } = playerTools;

	const scriptName = 'PUSHDOWN AD INJECTOR';
	const nameSpace = 'pushdownInjector';
	const version = '0.5';
	const elementId = 'gpt-pushdown';
	const gptPos = 'pushdown';
	const injectPoint = '.wrapper-content, body > .wp-site-blocks > header + *';
	const defaultTimeout = 15;

	const log = new Logger(`${scriptName} ${version}`);

	const doc = window.document;

	function init() {
		const injectNode = doc.querySelector(injectPoint);
		if (!injectNode) {
			log.warn('Could not find injection point');
			return;
		}

		const adTag = window.__CMLSINTERNAL.adTag;

		const container = (
			<div
				id={`${elementId}-container`}
				aria-hidden="true"
				style="
					position: relative !important;
					z-index: 2 !important;
					max-width: 1020px !important;
					overflow: hidden !important;
				"
			/>
		);
		container.attachShadow({ mode: 'open' });

		const style = import(
			/*
				webpackChunkName: 'advertising/pushdown/style'
			*/
			'./styles.scss'
		).then((style) => {
			if (style?.default?.use) {
				style.default.use({ target: container.shadowRoot });
			}
		});

		const slotDiv = <div id={elementId} />;
		container.shadowRoot.append(slotDiv);

		const closeBox = (
			<a
				id="close"
				title="Close"
				style="display: none"
				onClick={(e) => {
					e.preventDefault();
					triggerEvent(container, 'cmls.hide');
				}}
			>
				✕
			</a>
		);
		closeBox.ariaControlsElements = [container];
		container.shadowRoot.append(closeBox);

		const timerDiv = <div id="timer" style="display: none" />;
		container.shadowRoot.append(timerDiv);

		injectNode.prepend(container);

		function checkRenderEvent(e) {
			if (e.slot.getTargeting('pos')?.includes(gptPos) && !e.isEmpty) {
				log.debug('Received creative.');
				if (!window.__CMLSINTERNAL.pushdownHandler) {
					import(
						/* webpackChunkName: 'advertising/pushdown/pushdown-2-handle-delivery' */
						'./step2-handle-delivery.js'
					).then((script) => {
						window.__CMLSINTERNAL.pushdownHandler.process(e.slot);
					});
				} else {
					window.__CMLSINTERNAL.pushdownHandler.process(e.slot);
				}
				adTag.removeListener('slotRenderEnded', checkRenderEvent);
			}
		}

		adTag.addListener('slotRenderEnded', checkRenderEvent);

		adTag.queue(() => {
			log.debug('Defining slot');
			const slot = adTag.defineSlot({
				outOfPage: true,
				adUnitPath: window.__CMLSINTERNAL.adPath + '/pushdown',
				div: elementId,
				collapse: true,
				targeting: { pos: gptPos, noprebid: 'noprebid' },
				prebid: false,
			});
			if (!slot) {
				log.error('Could not define slot!');
				return;
			}

			adTag.display(slotDiv, adTag.isInitialLoadDisabled());
			addAfterPageFrame(() => {
				adTag.destroySlots([slot]);
			});
		});

		log.info('Initialized');
	}

	if (window.__CMLSINTERNAL?.adPath) {
		init();
	} else {
		window.addEventListener('cmls-adpath-discovered', () => init());
	}
})(window.self);
