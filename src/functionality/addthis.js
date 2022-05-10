/**
 * Inject addThis into posts and pages
 */
import Logger from 'Utils/Logger';
import domReady from 'Utils/domReady';
import createElement from 'Utils/createElement';
import getBasicPost from 'Utils/getBasicPost';
import { addAfterPageFrame } from 'Utils/detectPlayer';

(($, window, undefined) => {
	const scriptName = 'ADDTHIS INJECTOR',
		nameSpace = 'addThisInjector',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	const addThisPubId = 'ra-55dc79597bae383e';

	domReady(() => {
		if (window?.addthis && window?.addthis_config?.pubid !== addThisPubId) {
			log.info('addThis already included by local.');
			return;
		}

		if (window.NO_ADDTHIS_HERE) {
			log.info('addThis prevented by window.NO_ADDTHIS_HERE');
			return;
		}

		if (window.document.body.classList.contains('home')) {
			log.info('Homepage detected, exiting.');
			return;
		}

		if (window.document.querySelector('div[class*="addthis_"]')) {
			log.info('Local already has inline addThis container, exiting.');
			return;
		}
		if (window.document.querySelector('script[src*="addthis.com"]')) {
			log.info('Local already has addthis script, exiting.');
			return;
		}

		window.addthis_config = window.addthis_config || {};
		window.addthis_config.pubid = addThisPubId;
		window.addthis_config.data_ga_social = true;

		if (!window.document.getElementById(`${nameSpace}-script`)) {
			log.info('Injecting library');
			const scr = createElement.script(
				'//s7.addthis.com/js/300/addthis_widget.js#async=1&amp;pubid=ra-55dc79597bae383e',
				{
					id: `${nameSpace}-script`,
					async: true,
				}
			);
			scr.onload = setup;
			window.document.body.appendChild(scr);
		}

		function setup() {
			const post = getBasicPost();
			const id = nameSpace + '-' + Math.ceil(Math.random() * 6000000);

			const addThisDiv = createElement.el('aside', {
				id: id,
				class: 'addthis_toolbox addthis_32x32_style',
			});
			const addThisStyle = createElement.el('style', {
				id: `${id}-style`,
			});

			addThisDiv.innerHTML = `
				<div class="label">Share this:</div>
				<a class="addthis_button_preferred_1"></a>
				<a class="addthis_button_preferred_2"></a>
				<a class="addthis_button_preferred_3"></a>
				<a class="addthis_button_preferred_4"></a>
				<a class="addthis_button_compact"></a>
			`;

			addThisStyle.innerHTML = `
				#${id} {
					font-size: 1rem;
				}
				#${id} > .label {
					line-height: 32px;
					float: left;
				}
				#${id} .at-icon-wrapper {
					background: transparent !important;
					border-radius: 2px;
				}
				#${id} svg { fill: #666 }
				#${id} a:hover svg { fill: #111 }
				#${id} a.addthis_button_twitter:hover svg {
					fill: #1DA1F2;
				}
				#${id} a.addthis_button_facebook:hover svg {
					fill: #4267B2;
				}
				#${id} a.addthis_button_pinterest:hover svg {
					fill: #E60023;
				}
				#${id} a.addthis_button_gmail:hover svg {
					fill: #DB4437;
				}
				#${id} a.addthis_button_linkedin:hover svg {
					fill: #0072b1;
				}
			`;

			if (post || window.matchMedia('(max-width: 600px)').matches) {
				// On basic posts and mobile, inject after post content
				log.info('Injecting inline share buttons.');
				addThisDiv.classList.add('addthis_default_style');
				post.after(addThisStyle);
				post.after(addThisDiv);
				addthis.init();
			} else if (window.document.querySelector('body.single')) {
				// Any other single post, inject floating bar
				log.info('Injecting floating share buttons');
				addThisDiv.classList.add('addthis_floating_style');
				addThisStyle.innerHTML += `
					#${id} {
						background: white;
						border: 1px solid #666;
						border-radius: 3px;
						left: -1px;
						bottom: 100px;
						z-index: 999999;
					}
					#${id} > label {
						display: none;
					}
					#${id} .addthis_button_compact,
					#${id} .addthis_button_compact .at-icon-wrapper {
						margin-bottom: 0;
					}
					#${id} a:hover .at-icon-wrapper {
						background: rgba(0,0,0,0.15) !important;
					}
				`;
				window.document.body.appendChild(addThisStyle);
				window.document.body.appendChild(addThisDiv);
				addthis.init();
			}
		}

		// Clean up addThis junk after TG frame generation
		addAfterPageFrame(() => {
			const addthis_properties = [
				'addthis',
				'addthis_close',
				'addthis_conf',
				'addthis_config',
				'addthis_exclude',
				'addthis_open',
				'addthis_options',
				'addthis_options_default',
				'addthis_options_rank',
				'addthis_sendto',
				'addthis_share',
				'addthis_use_personalization',
				'_adr',
				'_atc',
				'_atd',
				'_ate',
				'_atr',
				'_atw',
			];
			const els = window.document.querySelectorAll(
				`[id*="${nameSpace}"],#_atssh,#at4-thankyou,#at-expanded-menu-host`
			);
			Array.prototype.forEach.call(els, (el) => el.remove());
			addthis_properties.forEach((prop) => {
				if (window[prop]) {
					delete window[prop];
				}
			});
		});
	});
})(window?.jQuery, window.self);
