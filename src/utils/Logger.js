/**
 * Cache for namespace colors
 */
const namesToColors = {};

/**
 * Generate a random color
 * @returns string
 */
export const generateColor = () => {
	return ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(
		-6
	);
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
	return luma > 140 ? '000000' : 'FFFFFF';
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
		let headerLength = 80;
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

	smallString(str, length = 80) {
		return !str
			? str
			: (str instanceof Element
					? str.innerHTML
					: str.toString()
			  ).substring(0, length);
	}

	displayHeader(type, message, headerLength = 80) {
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

	logMessage(type, message, headerLength = 80) {
		if (!(typeof console === 'object' && console.groupCollapsed)) {
			return false;
		}

		// Only display if debug flag is set
		if (
			window?._CMLS?.debug ||
			/(1|true|yes)/i.test(window.sessionStorage.getItem('cmlsDebug'))
		) {
			this.displayHeader(type, message, headerLength);
			if (headerLength !== Infinity) {
				window.top.console[type](message);
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
