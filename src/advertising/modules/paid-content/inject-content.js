/**
 * Injects paid content after standard post bodies
 */
//import Newsmax from './injectables/newsmax';
//import Hindsight from './injectables/hindsight';

((window, undefined) => {
	const injectables = {
		Newsmax: './injectables/newsmax.js',
		Hindsight: './injectables/hindsight.js',
	};

	const { h, domReady, getBasicPost, Logger } = window.__CMLSINTERNAL.libs;

	const scriptName = 'PAID CONTENT INJECTOR';
	const nameSpace = 'paidContentInjector';
	const version = '0.2';

	const log = new Logger(`${scriptName} ${version}`);

	domReady(() => {
		if (window.NO_PAIDCONTENT) {
			log.info('NO_PAIDCONTENT flag found, exiting.');
			return;
		}

		const entry = getBasicPost();

		if (!entry) {
			log.info('Could not discover entry container, exiting.');
			return;
		}

		const column = entry.closest('.column,.wp-block-column');
		if (!column) {
			log.info(
				"Could not discover entry content's parent column, exiting"
			);
			return;
		}

		const injectPoint = (
			<div
				id={`PAIDCONTENT-${Math.ceil(Math.random() * 6000000)}`}
				class="injected-paid-content"
				style="position: relative !important; width: 100% !important; top: 0; overflow: hidden"
			/>
		);

		column.append(injectPoint);

		for (const i in injectables) {
			let injected = false;
			if (typeof injectables[i] === 'function') {
				injectPoint.append(injectables[i]());
				injected = true;
			} else if (typeof injectables[i] === 'string') {
				log.debug('Importing', injectables[i]);
				import(
					/* webpackChunkName: 'advertising/paid-content/[request]' */
					`${injectables[i]}`
				).then((injectable) => {
					log.warn(injectable);
					if (typeof injectable?.default === 'function') {
						const content = injectable.default();
						if (content) {
							injectPoint.append(content);
						}
					}
				});
				injected = true;
			}
			if (injected) {
				log.info('Injected paid content', i);
			}
		}
	});
})(window.self);
