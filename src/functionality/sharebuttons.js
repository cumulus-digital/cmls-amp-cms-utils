/**
 * Custom share buttons
 */
import Logger from 'Utils/Logger';
import domReady from 'Utils/domReady';
import createElement from 'Utils/createElement';
import getBasicPost from 'Utils/getBasicPost';
import { addAfterPageFrame } from 'Utils/playerTools';

(function (window, undefined) {
	const scriptName = 'SHAREBUTTONS',
		nameSpace = 'shareButtons',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	const services = {
		facebook: {
			display_name: 'Facebook',
			url: 'https://www.facebook.com/sharer/sharer.php?u={{URL}}',
			icon: `
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
			viewBox="0 0 20.1 20" enable-background="new 0 0 20.1 20" xml:space="preserve" title="Twitter" alt="Twitter">
				<path fill="currentColor" d="M20.1,10.1C20.1,4.5,15.6,0,10.1,0S0,4.5,0,10.1c0,5,3.7,9.2,8.5,9.9v-7H5.9v-2.9h2.6V7.8
					c0-2.5,1.5-3.9,3.8-3.9c1.1,0,2.3,0.2,2.3,0.2v2.5h-1.3c-1.2,0-1.6,0.8-1.6,1.6v1.9h2.8L14,13h-2.3v7C16.4,19.2,20.1,15.1,20.1,10.1
					z"/>
			</svg>
			`,
		},
		twitter: {
			display_name: 'Twitter',
			url: 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}',
			icon: `
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				viewBox="0 0 24.6 20" enable-background="new 0 0 24.6 20" xml:space="preserve" title="Twitter" alt="Twitter">
				<path fill="currentColor" d="M7.7,20c9.3,0,14.4-7.7,14.4-14.4c0-0.2,0-0.4,0-0.7c1-0.7,1.8-1.6,2.5-2.6c-0.9,0.4-1.9,0.7-2.9,0.8
					c1-0.6,1.8-1.6,2.2-2.8c-1,0.6-2.1,1-3.2,1.2C19.8,0.6,18.5,0,17,0c-2.8,0-5,2.3-5,5c0,0.4,0,0.8,0.1,1.2C7.9,6,4.2,4,1.7,0.9
					C1.3,1.7,1,2.5,1,3.5c0,1.8,0.9,3.3,2.2,4.2C2.4,7.6,1.7,7.4,1,7c0,0,0,0,0,0.1C1,9.5,2.7,11.6,5,12c-0.4,0.1-0.9,0.2-1.3,0.2
					c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.5,3.5,4.7,3.5c-1.7,1.4-3.9,2.2-6.3,2.2c-0.4,0-0.8,0-1.2-0.1C2.2,19.2,4.9,20,7.7,20"/>
			</svg>
			`,
		},
		email: {
			display_name: 'Email',
			url: 'mailto:?subject={{TITLE}}&body={{URL}}',
			icon: `
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				viewBox="0 0 24.6 18" enable-background="new 0 0 24.6 18" xml:space="preserve" title="Email" alt="Email">
				<path fill="currentColor" d="M24.4,1.3C24.1,0.5,23.4,0,22.5,0H2.1C1.2,0,0.5,0.5,0.2,1.3C0.1,1.5,0,1.8,0,2.1v0.5v2.2v11.2
					C0,17.1,0.9,18,2.1,18h20.5c1.1,0,2.1-0.9,2.1-2.1V4.7V2.5V2.1C24.6,1.8,24.6,1.5,24.4,1.3z M23.6,5.3l-11.3,6.2L1,5.3V3.1l11.3,6.2
					l11.3-6.2V5.3z"/>
			</svg>

			`,
		},
	};

	domReady(() => {
		if (document.body.classList.contains('visual-editor-mode-design')) {
			log.info('Headway visual editor detected, exiting.');
			return;
		}

		if (window.NO_ADDTHIS_HERE) {
			log.info('Share buttons prevented by window.NO_ADDTHIS_HERE');
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
		if (window.document.querySelector('script[src*="addtoany.com"]')) {
			log.info('Local already has AddToAny script, exiting.');
			return;
		}

		const post = getBasicPost(['page-template-default']);
		if (!post) {
			log.info('Not a basic post, exiting.');
			return;
		}
		log.info('got post', post);

		const id = nameSpace + '-' + Math.ceil(Math.random() * 6000000);

		if (!window.document.querySelector(`#${id}-style`)) {
			const css = `
				.cmls-share_buttons {
					clear: both !important;
					display: block !important;
					margin: 1em 0 !important;
					font-size: 16px !important;
					line-height: 1 !important;
				}
				.cmls-share_buttons--container {
					display: flex !important;
					align-items: center !important;
					gap: .5em !important;
				}
				.cmls-share_buttons ul {
					display: flex !important;
					align-items: center !important;
					gap: .75em !important;
					list-style: none !important;
					margin: 0 !important;
					padding: 0 !important;
				}
				.cmls-share_buttons li {
					margin: 0 !important;
					padding: 0 !important;
				}
				.cmls-share_buttons a:visited {
					color: inherit
				}
				.cmls-share_buttons svg {
					height: 1.5em !important;
					width: 1.5em !important;
				}
			`;
			const style = createElement.el('style');
			style.id = `${id}-style`;
			style.innerHTML = css;
			window.document.body.appendChild(style);
		}

		const shareButtons = `
			<nav class="cmls-share_buttons--container">
				<div class="cmls-share_buttons--label">Share this:</div>
				<ul>
					{{SERVICES}}
				</ul>
			</nav>
		`;

		const replaceTokens = (str) => {
			str = str
				.replace(
					/\{\{URL\}\}/g,
					encodeURIComponent(window.location.href)
				)
				.replace(
					/\{\{TITLE\}\}/g,
					encodeURIComponent(window.document.title)
				);
			return str;
		};

		const icons = [];
		Object.keys(services).forEach((service) => {
			const s = services[service];
			const url = replaceTokens(s.url);
			const icon = s.icon;
			const sName = service;
			const sTitle = s.display_name;
			icons.push(`
				<li>
					<a href="${url}" target="_blank" rel="noopener" class="cmls-share_buttons--icon" title="${sTitle}">
						${icon}
					</a>
				</li>
			`);
		});

		const share_buttons = createElement.el('div', {
			id: id,
			class: 'cmls-share_buttons',
		});
		share_buttons.innerHTML = shareButtons.replace(
			'{{SERVICES}}',
			icons.join('\n')
		);

		post.after(share_buttons);

		log.info('Share buttons injected.');
		const sendShareEvent = (method, type, id) => {
			if (window.gtag) {
				window.gtag('event', 'share', {
					method: method,
					content_type: type,
					item_id: id,
				});
			}
		};
		share_buttons.addEventListener('click', (e) => {
			const a = e.target.closest('.cmls-share_buttons--icon');
			if (a && window.gtag) {
				log.info('Share click!', a.title);
				sendShareEvent(a.title, 'post', window.location.href);
			}
		});
	});
})(window.self);
