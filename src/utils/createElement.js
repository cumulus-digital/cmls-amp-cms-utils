/**
 * Generic element generator
 */
const doc = window.self.document;

const creator = {
	// Any element
	el: (type, attr = {}) => {
		const el = doc.createElement(type);
		if (
			attr !== null &&
			(typeof attr === 'function' || typeof attr === 'object')
		) {
			for (const a in attr) {
				el.setAttribute(a, attr[a]);
			}
		}
		return el;
	},
	// Script tags
	script: (src, attr = {}) => {
		attr = Object.assign(attr, {
			type: 'text/javascript',
			async: true,
			src: src,
		});
		var scr = creator.el('script', attr);
		return scr;
	},
	// Anonymous iframe
	iframe: (attr = {}, html = '') => {
		var iframe = creator.el('iframe', attr);
		iframe.onload = () => {
			iframe.onload = false;
			const cw = iframe.contentWindow.document;
			cw.open();
			cw.write(html);
			cw.close();
		};
		return iframe;
	},
};

export default creator;
