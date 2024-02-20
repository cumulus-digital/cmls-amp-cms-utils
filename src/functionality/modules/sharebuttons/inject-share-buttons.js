const { h, Logger, getBasicPost } = window.__CMLSINTERNAL.libs;

const scriptName = 'SHAREBUTTONS';
const nameSpace = 'shareButtons';
const version = '0.2';
const log = new Logger(`${scriptName} ${version}`);

((window, undefined) => {
	const services = {
		facebook: {
			display_name: 'Facebook',
			url: 'https://www.facebook.com/sharer/sharer.php?u={{URL}}',
			icon: `
			<svg xmlns="http://www.w3.org/2000/svg"
			aria-label="Share via Facebook" alt="Share via Facebook" role="img"
			viewBox="0 0 410 410"><path d="M267,247.7h-45v134C326.8,365.1,398.2,266.8,381.7,162S266.8-14.2,162,2.4S-14.2,117.3,2.4,222
			c13,82.2,77.5,146.6,159.6,159.6v-134h-49v-56h49v-45c2.7-59.3,41.3-82,116-68v47h-26c-19.3,0.7-29.3,10.7-30,30v36h53.5" fill="currentColor" />
			</svg>
			`,
		},
		x: {
			display_name: 'X',
			url: 'https://x.com/intent/tweet?text={{TITLE}}&url={{URL}}',
			icon: `
				<svg xmlns="http://www.w3.org/2000/svg"
				aria-label="Share via X" alt="Share via X"
				role="img" viewBox="0 0 1200 1227">
				<path d="m694.7 535.2 370.8-431h-87.9l-321.9 374.3-257.1-374.3h-296.6l388.9 565.9-388.9 452h87.9l340-395.2 271.6 395.2h296.5zm-120.3 140-39.4-56.4-313.5-448.4h135l253 361.9 39.4 56.4 328.8 470.4h-135z" fill="currentColor"/>
				</svg>
			`,
		},
		email: {
			display_name: 'Email',
			url: 'mailto:?subject={{TITLE}}&body={{URL}}',
			icon: `
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 25 18"
					alt="Share via Email"
					aria-label="Share via Email"
				>
				<path fill="currentColor" d="M24.4,1.3c-0.3-0.8-1-1.3-1.9-1.3H2.1C1.2,0,0.5,0.5,0.2,1.3C0.1,1.5,0,1.8,0,2.1v0.5v2.2V16c0,1.1,0.9,2,2.1,2h20.5
				c1.1,0,2.1-0.9,2.1-2.1V4.7V2.5V2.1C24.6,1.8,24.6,1.5,24.4,1.3z M23.6,5.3l-11.3,6.2L1,5.3V3.1l11.3,6.2l11.3-6.2V5.3z"/>
				</svg>
			`,
		},
	};

	const post = getBasicPost(['page-template-default']);
	const id = nameSpace + '-' + Math.ceil(Math.random() * 6000000);

	const replaceTokens = (str) => {
		str = str
			.replace(/\{\{URL\}\}/g, encodeURIComponent(window.location.href))
			.replace(
				/\{\{TITLE\}\}/g,
				encodeURIComponent(window.document.title)
			);
		return str;
	};

	const shareEvent = (e) => {
		let a = e.target;
		if (!e.target.matches('.cmls-share_buttons--icon')) {
			a = e.target.closest('.cmls-share_buttons--icon');
		}
		if (a && window.gtag) {
			const data = {
				method: a.title,
				content_type: window?.express_dimensions?.page_type || 'post',
				item_id: window.location.href,
			};
			log.debug('Share click!', data);
			window.gtag('event', 'share', data);
		}
	};

	const share_buttons = (
		<nav class="container">
			<div class="label">Share this:</div>
			<ul>
				{Object.keys(services).map((service) => {
					const s = services[service];
					const url = replaceTokens(s.url);
					const icon = s.icon;
					const name = service;
					const title = s.display_name;
					const a = (
						<a
							href={url}
							target="_blank"
							rel="noopener"
							class="cmls-share_buttons--icon"
							title={title}
							onClick={shareEvent}
						></a>
					);
					//a.addEventListener('click', shareEvent);
					a.innerHTML = icon;
					return <li>{a}</li>;
				})}
			</ul>
		</nav>
	);

	const container = <div />;
	container.classList.add('cmls-share_buttons');
	//container.attachShadow({ mode: 'open' });
	//container.shadowRoot.append(share_buttons);

	const style = import(
		/* webpackChunkName: 'functionality/sharebuttons/style' */
		'./style.scss'
	).then((style) => {
		if (style?.default?.use) {
			style.default.use({ target: container });
			container.append(share_buttons);
			post.after(container);
			log.info('Share buttons injected.');
		}
	});
})(window.self);
