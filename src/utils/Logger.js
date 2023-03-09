/**
 * Cache for namespace colors
 */
const namesToColors = {};

/**
 * Generate a random color that's not red.
 * @returns string
 */
export const generateColor = () => {
	const genC = () => Math.floor(Math.random() * 0xffffff);
	const rgb2hsv = (r, g, b) => {
		r /= 255;
		g /= 255;
		b /= 255;
		const v = Math.max(r, g, b),
			n = v - Math.min(r, g, b);
		const h =
			n === 0
				? 0
				: n && v === r
				? (g - b) / n
				: v === g
				? 2 + (b - r) / n
				: 4 + (r - g) / n;
		return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
	};
	let color;
	let haveColor = false;
	while (!haveColor) {
		color = genC();
		const rgb = [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff];
		const hsv = rgb2hsv.apply(this, rgb);
		console.log(hsv);
		if (hsv[0] > 25 && hsv[0] < 330) {
			haveColor = true;
		}
	}
	return ('000000' + color.toString(16)).slice(-6);
};

/**
 * Return black or white hex color value depending on brightness
 * of a given color.
 * @param {string} color Input color value
 * @returns string
 */
export const generateForeground = (color) => {
	const rgb = parseInt(color, 16);
	const r = (rgb >> 16) & 0xff;
	const g = (rgb >> 8) & 0xff;
	const b = (rgb >> 0) & 0xff;

	const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // ITU-R BT.709
	return luma > 130 ? '000000' : 'FFFFFF';
};

export default class Logger {
	background = null;
	foreground = null;

	#header = null;

	constructor(defaultHeader) {
		if (namesToColors[defaultHeader]) {
			//[this.background, this.foreground] = namesToColors[defaultHeader];
			this.background = namesToColors[defaultHeader]?.background;
			this.foreground = namesToColors[defaultHeader]?.foreground;
		} else {
			this.background = generateColor();
			this.foreground = generateForeground(this.background);
			namesToColors[defaultHeader] = {
				background: this.background,
				foreground: this.foreground,
			};
		}

		this.header = [
			`%c ${defaultHeader} `,
			`background: #${this.background}; color: #${this.foreground}`,
		];
	}

	timestamp() {
		return new Date()?.toISOString() || new Date().toUTCString();
	}

	resolveMessage(request) {
		let message = request;
		let headerLength = 160;
		if (
			Array.isArray(request) &&
			request.length > 0 &&
			request[0]?.message &&
			request[0]?.headerLength
		) {
			message = request[0].message;
			headerLength = request[0].headerLength;
		}
		return { message, headerLength };
	}

	smallString(str, length = 160) {
		return !str
			? str
			: (str instanceof Element
					? str.innerHTML
					: str.toString()
			  ).substring(0, length);
	}

	displayHeader(type, message, headerLength = 160) {
		// Add icon to message type
		const icons = {
			debug: '🐞',
			info: 'ℹ️',
			warn: '🚸',
			error: '🚨',
		};
		let header = [...this.header, icons?.[type]];

		if (message) {
			if (Array.isArray(message)) {
				header.push(
					this.smallString(
						message
							.map((i) => {
								if (typeof i !== 'string') {
									return JSON.stringify(i);
								}
								return i;
							})
							.join(' || '),
						headerLength
					)
				);
			} else {
				header.push(this.smallString(message, headerLength));
			}
		}

		window.top.console.groupCollapsed.apply(window.top.console, header);
	}

	displayFooter() {
		window.top.console.debug('TIMESTAMP:', this.timestamp());
		window.top.console.trace();
		window.top.console.groupEnd();
	}

	logMessage(type, message, headerLength = 160) {
		if (!(typeof console === 'object' && console.groupCollapsed)) {
			return false;
		}

		// Only display if debug flag is set
		let forceDebug = false;
		try {
			if (
				/(1|true|yes)/i.test(
					window.sessionStorage.getItem('cmlsDebug')
				) ||
				/cmlsDebug/i.test(window.document.cookie)
			) {
				forceDebug = true;
			}
		} catch (e) {}
		if (window?._CMLS?.debug || forceDebug) {
			this.displayHeader(type, message, headerLength);
			if (headerLength !== Infinity) {
				window.top.console.debug(message);
			}
			this.displayFooter();
		}
	}

	info(...request) {
		let { message, headerLength } = this.resolveMessage(request);
		this.logMessage('info', message, headerLength);
	}

	debug(...request) {
		let { message, headerLength } = this.resolveMessage(request);
		this.logMessage('debug', message, headerLength);
	}

	warn(...request) {
		let { message, headerLength } = this.resolveMessage(request);
		this.logMessage('warn', message, headerLength);
	}

	error(...request) {
		let { message, headerLength } = this.resolveMessage(request);
		this.logMessage('error', message, headerLength);
	}
}
