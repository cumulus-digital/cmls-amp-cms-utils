const { h, Logger, getBasicPost } = window.__CMLSINTERNAL.libs;

const scriptName = 'SHAREBUTTONS';
const nameSpace = 'shareButtons';
const version = '0.2';
const log = new Logger(`${scriptName} ${version}`);

((window, undefined) => {
	let allowedServices = ['facebook', 'x', 'threads', 'bluesky', 'email'];
	if (window?.CMLS_SHARE_SERVICES) {
		allowedServices = window.CMLS_SHARE_SERVICES;
	}
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
		threads: {
			display_name: 'Threads',
			url: 'https://threads.net/intent/post?text={{TITLE}}&url={{URL}}',
			icon: `
				<svg
					viewBox="0 0 192 192"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill="currentColor"
						d="m141.537 88.9883c-.827-.3964-1.667-.7779-2.518-1.1432-1.482-27.3069-16.403-42.9401-41.4571-43.1001-.1135-.0007-.2264-.0007-.3399-.0007-14.9856 0-27.4489 6.3966-35.12 18.0364l13.779 9.4521c5.7306-8.6945 14.7242-10.548 21.3476-10.548.0765 0 .1533 0 .229.0007 8.2494.0526 14.4744 2.4511 18.5034 7.1285 2.932 3.4053 4.893 8.111 5.864 14.0498-7.314-1.2431-15.224-1.6253-23.68-1.1405-23.8203 1.3721-39.1339 15.2646-38.1054 34.5687.5219 9.792 5.4001 18.216 13.7354 23.719 7.0474 4.652 16.124 6.927 25.5573 6.412 12.4577-.683 22.2307-5.436 29.0487-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.4875 16.351-22.8093-.169-40.0597-7.484-51.2754-21.742-10.5026-13.351-15.9304-32.635-16.1329-57.317.2025-24.6822 5.6303-43.9664 16.1329-57.3173 11.2157-14.2578 28.4658-21.5727 51.2751-21.7422 22.9748.1708 40.5258 7.5209 52.1708 21.8475 5.71 7.0256 10.015 15.8608 12.853 26.1623l16.147-4.3081c-3.44-12.68-8.853-23.6065-16.219-32.6682-14.929-18.36732-36.763-27.778852-64.8955-27.974h-.1126c-28.0753.19447-49.6648 9.6418-64.1686 28.0793-12.9064 16.4071-19.5639 39.2364-19.7876 67.8532l-.0007.0675.0007.0675c.2237 28.6165 6.8812 51.4465 19.7876 67.8535 14.5038 18.437 36.0933 27.885 64.1686 28.079h.1126c24.9605-.173 42.5545-6.708 57.0485-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.9448-24.723-24.5527zm-43.0965 40.5187c-10.44.588-21.2861-4.098-21.8209-14.135-.3964-7.442 5.2962-15.746 22.4616-16.7352 1.9658-.1134 3.8948-.1688 5.7898-.1688 6.235 0 12.068.6057 17.371 1.765-1.978 24.702-13.58 28.713-23.8015 29.274z"
					/>
				</svg>
			`,
		},
		bluesky: {
			display_name: 'Bluesky',
			url: 'https://bsky.app/intent/compose?text={{TITLE}}%20{{URL}}',
			icon: `
				<svg
					viewBox="0 0 580 510.7"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill="currentColor"
						d="m125.7 34.4c66.5 49.9 138 151.1 164.3 205.5 26.3-54.3 97.8-155.5 164.3-205.5 48-36 125.7-63.9 125.7 24.8s-10.2 148.8-16.1 170.1c-20.7 74-96.1 92.9-163.2 81.4 117.3 20 147.1 86.1 82.7 152.2-122.4 125.6-175.9-31.5-189.6-71.8-2.5-7.4-3.7-10.8-3.7-7.9 0-2.9-1.2.5-3.7 7.9-13.7 40.3-67.2 197.4-189.6 71.8-64.4-66.1-34.6-132.3 82.7-152.2-67.1 11.4-142.6-7.4-163.2-81.4-6.1-21.3-16.3-152.4-16.3-170.1 0-88.7 77.7-60.8 125.7-24.8z"
					/>
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
				<path
					fill="currentColor"
					d="m694.7 535.2 370.8-431h-87.9l-321.9 374.3-257.1-374.3h-296.6l388.9 565.9-388.9 452h87.9l340-395.2 271.6 395.2h296.5zm-120.3 140-39.4-56.4-313.5-448.4h135l253 361.9 39.4 56.4 328.8 470.4h-135z"
				/>
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
					<path
						fill="currentColor"
						d="M24.4,1.3c-0.3-0.8-1-1.3-1.9-1.3H2.1C1.2,0,0.5,0.5,0.2,1.3C0.1,1.5,0,1.8,0,2.1v0.5v2.2V16c0,1.1,0.9,2,2.1,2h20.5c1.1,0,2.1-0.9,2.1-2.1V4.7V2.5V2.1C24.6,1.8,24.6,1.5,24.4,1.3z M23.6,5.3l-11.3,6.2L1,5.3V3.1l11.3,6.2l11.3-6.2V5.3z"
					/>
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
					if (!allowedServices.includes(service)) return '';
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
					return <li class="cmls-share-{service}">{a}</li>;
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
