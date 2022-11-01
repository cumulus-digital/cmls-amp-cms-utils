/**
 * Refreshes VISIBLE ads on a timer
 */
import Logger from 'Utils/Logger';
import { waitForPlayer, isInIframe } from 'Utils/playerTools';

((window, undefined) => {
	const scriptName = 'TG PLAYER EVENT TARGETING',
		nameSpace = 'tgPlayerEventTargeting',
		version = '0.2';

	const log = new Logger(`${scriptName} ${version}`);

	window._CMLS = window._CMLS || {};

	window._CMLS[nameSpace] = {};
	window._CMLS[nameSpace].init = function init() {
		if (!window.self?.__PWM__?.events?.mediaSession?.setTrack) {
			log.info(
				'__PWM__ event tracking not available, cannot track events.'
			);
			return;
		}

		if (window._CMLS[nameSpace].active) {
			log.info('Already enabled.');
		}
		window._CMLS[nameSpace].active = true;

		const __PWM__ = window.self.__PWM__;
		const lastTrack = { artist: null, title: null };

		__PWM__.events.mediaSession.setTrack.push(function (track) {
			if (!window._CMLS.adTag) {
				log.info(
					'Adtag interface not available when setTrack fired.',
					track
				);
				return;
			}

			if (track?.title && track.title !== lastTrack.title) {
				lastTrack.title = track.title;
				log.info('Setting webplayer-title', track.title);
				let validTitle = track.title.replace(
					/["'=!+#*~;^()<>\[\],&]/g,
					'-'
				);
				window._CMLS.adTag.setTargeting('webplayer-title', validTitle);

				if (track?.artist && track.artist !== lastTrack.artist) {
					lastTrack.artist = track.artist;
					let validArtist = track.artist.replace(
						/["'=!+#*~;^()<>\[\],&]/g,
						'-'
					);
					log.info('Setting webplayer-artist', track.artist);
					window._CMLS.adTag.setTargeting(
						'webplayer-artist',
						validArtist
					);
				}
			}
		});
	};

	waitForPlayer().then(() => {
		if (window?._CMLS?.adPath) {
			window._CMLS[nameSpace].init();
		} else {
			window.addEventListener('cmls-adpath-discovered', () =>
				window._CMLS[nameSpace].init()
			);
		}
	});
})(window.self);
