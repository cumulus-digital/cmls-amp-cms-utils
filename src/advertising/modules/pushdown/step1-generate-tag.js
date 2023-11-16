//import './styles.scss';

/**
 * Injects a "Pushdown" ad unit
 * Generates and injects a DFP ad tag at the start of the AMP CMS
 * ".wrapper-content" with targeting pos="pushdown" ON HOMEPAGES ONLY.
 */
((window, undefined) => {
	const { h, triggerEvent } = window._CMLS.libs;

	const scriptName = 'PUSHDOWN AD INJECTOR';
	const nameSpace = 'pushdownInjector';
	const version = '0.5';
	const elementId = 'gpt-pushdown';
	const gptPos = 'pushdown';
	const injectPoint = '.wrapper-content, body > .wp-site-blocks > header + *';
	const defaultTimeout = 15;

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	const doc = window.document;

	function init() {
		const injectNode = doc.querySelector(injectPoint);
		if (!injectNode) {
			log.warn('Could not find injection point');
			return;
		}

		const adTag = window._CMLS.adTag;

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
				webpackPreload: true,
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
				if (!window._CMLS.pushdownHandler) {
					import(
						/* webpackChunkName: 'advertising/pushdown/pushdown-2-handle-delivery' */
						'./step2-handle-delivery.js'
					).then((script) => {
						window._CMLS.pushdownHandler.process(e.slot);
					});
				} else {
					window._CMLS.pushdownHandler.process(e.slot);
				}
				/*
				if (!window._CMLS.pushdownHandler) {
					$script(
						window._CMLS.scriptUrlBase +
							'/advertising/pushdown-handler.js',
						'pushdown-handler'
					);
				}
				$script.ready('pushdown-handler', () => {
					window._CMLS.pushdownHandler.process(e.slot);
				});
					*/
				adTag.removeListener('slotRenderEnded', checkRenderEvent);
			}
		}

		adTag.addListener('slotRenderEnded', checkRenderEvent);

		adTag.queue(() => {
			log.debug('Defining slot');
			const slot = adTag.defineSlot({
				outOfPage: true,
				adUnitPath: window._CMLS.adPath + '/pushdown',
				div: elementId,
				collapse: true,
				targeting: { pos: gptPos, noprebid: 'noprebid' },
				prebid: false,
			});

			slot && adTag.display(elementId, adTag.isInitialLoadDisabled());
		});

		log.info('Initialized');
	}

	if (window._CMLS?.adPath) {
		init();
	} else {
		window.addEventListener('cmls-adpath-discovered', () => init());
	}
})(window.self);
