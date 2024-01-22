/**
 * Refreshes VISIBLE ads on a timer
 */

import config from './config.json';

((window, undefined) => {
	const { scriptName, nameSpace, version } = config;
	const { Logger, playerTools, lodash } = window.__CMLSINTERNAL.libs;
	const { waitForPlayer } = playerTools;
	const { throttle } = lodash;
	const log = new Logger(`${scriptName} ${version}`);

	class playerEventTracking {
		initTime = null;
		initTimeout = null;

		active = false;

		__PWM__;
		lastTrack = { artist: null, title: null };

		constructor() {
			if (!window.self?.__PWM__?.events?.mediaSession?.setTrack) {
				log.info(
					'__PWM__ event tracking not available, cannot track events.'
				);
				return;
			}

			// Logs the initialization time
			this.initTime = new Date(new Date().getTime() + 35000);
			this.active = true;
			this.__PWM__ = window.self.__PWM__;

			this.__PWM__.events.mediaSession.setTrack.push(
				throttle(
					(track) => {
						this.handleTrackChange.call(this, track);
					},
					1000,
					{ leading: false, trailing: true }
				)
			);
		}

		handleTrackChange(track) {
			if (!window.__CMLSINTERNAL.adTag) {
				log.warn(
					'Track change event triggered without adTag interface.',
					track
				);
				return;
			}

			if (track?.title && track.title !== this.lastTrack.title) {
				if (this.initTimeout) {
					clearTimeout(this.initTimeout);
					this.initTimeout = null;
				}

				const adTag = window.__CMLSINTERNAL.adTag;

				/*
				const refreshSlotsInfo = [];
				const refreshSlots = adTag.getSlots().filter((slot) => {
					const pos = slot.getTargeting('pos');
					return pos.some((p) => {
						if (AD_POS_REFRESH_ON_TRACK_CHANGE.includes(p)) {
							refreshSlotsInfo.push({
								pos: slot.getTargeting('pos'),
								id: slot.getSlotElementId(),
							});
							return slot;
						}
						return false;
					});
				});

				const now = new Date();
				if (now < this.initTime && refreshSlots.length) {
					log.debug(
						'Track received before init time, delaying slot targeting until...',
						this.initTime.toLocaleString(),
						track
					);
					this.initTimeout = setTimeout(
						() => this.handleTrackChange.call(this, track),
						this.initTime.getTime() - now.getTime()
					);
					return;
				}
				*/

				log.debug('Caught track change.', track);

				adTag.queue(() => {
					this.lastTrack.title = track.title;
					const validTitle = this.sanitizeForGPT(track.title);
					log.debug(
						'Setting webplayer-title target',
						track.title,
						validTitle
					);
					adTag.setTargeting('webplayer-title', validTitle);

					if (
						track?.artist &&
						track?.artist !== this.lastTrack.artist
					) {
						this.lastTrack.artist = track.artist;
						const validArtist = this.sanitizeForGPT(track.artist);
						log.debug(
							'Setting webplayer-artist target',
							track.artist,
							validArtist
						);
						adTag.setTargeting('webplayer-artist', validArtist);
					}

					/*
					if (refreshSlots.length) {
						log.info(
							'Refreshing ad slots on track change',
							refreshSlotsInfo
						);
						adTag.refresh(refreshSlots);
					}
					*/
				});
			}
		}

		sanitizeForGPT(str) {
			return str.replace(/["'=!+#*~;^()<>\[\],&]/g, '-');
		}
	}

	waitForPlayer().then(() => {
		if (!window.__CMLSINTERNAL[nameSpace]?.active) {
			if (window.__CMLSINTERNAL.adTag) {
				window.__CMLSINTERNAL[nameSpace] = new playerEventTracking();
			} else {
				window.addEventListener('cmls-adtag-loaded', () => {
					window.__CMLSINTERNAL[nameSpace] =
						new playerEventTracking();
				});
			}
		}
	});
})(window.self);
