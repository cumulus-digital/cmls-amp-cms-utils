/**
 * Injects paid content after standard post bodies
 */
import Logger from 'Utils/Logger';
import getBasicPost from 'Utils/getBasicPost';
import createElement from 'Utils/createElement';

import Newsmax from './newsmax';
import Hindsight from './hindsight';

const injectables = {
	Newsmax: Newsmax,
	Hindsight: Hindsight,
};

(($, window, undefined) => {
	const scriptName = 'PAID CONTENT INJECTOR',
		nameSpace = 'paidContentInjector',
		version = '0.2';

	const log = new Logger(`${scriptName} ${version}`);

	if (!$) {
		log.warn('jQuery not available');
		return;
	}

	$(() => {
		const doc = window.document;

		const entry = getBasicPost();

		if (!entry) {
			log.info('Could not discover entry container, exiting.');
			return;
		}

		const $entry = $(entry);
		const $column = $entry.parents('.column,.wp-block-column');

		if (!$column.length) {
			log.info(
				"Could not discover entry content's parent column, exiting"
			);
			return;
		}

		const $injectPoint = $(
			createElement.el('div', {
				id: 'PAIDCONTENT-' + Math.ceil(Math.random() * 6000000),
				class: 'injected-paid-content',
				style: 'position: relative !important; width: 100% !important; top:0; overflow:hidden',
			})
		);
		$column.append($injectPoint);

		for (const i in injectables) {
			let injected = false;
			if (typeof injectables[i] === 'function') {
				$injectPoint.append(injectables[i]());
				injected = true;
			} else if (typeof injectables[i] === 'string') {
				$injectPoint.append(injectables[i]);
				injected = true;
			}
			if (injected) {
				log.info('Injected paid content', i);
			}
		}
	});
})(window?.jQuery, window.self);
