((window) => {
	const log = new window._CMLS.Logger('ADVERTISING');

	log.info({
		message: `
                      __
 ______ ____ _  __ __/ /_ _____
/ __/ // /  ' \\/ // / / // (_-<
\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/
   ADVERTISING LIBRARY LOADED`,
		headerLength: Infinity,
	});
})(window, undefined);

require('./advertising/index');
