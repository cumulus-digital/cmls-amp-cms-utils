import Logger from './utils/Logger';

((window) => {
	const log = new Logger('ANALYTICS');

	log.info({
		message: `
                      __
 ______ ____ _  __ __/ /_ _____
/ __/ // /  ' \\/ // / / // (_-<
\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/
     ANALYTICS LIBRARY LOADED`,
		headerLength: Infinity,
	});
})(window, undefined);

require('./analytics/index');
