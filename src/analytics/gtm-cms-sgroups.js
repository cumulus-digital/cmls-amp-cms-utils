/**
 * Send global targeting (cms-sgroups) values as GTM events
 */
import Logger from 'Utils/Logger';
import triggerEvent from 'Utils/triggerEvent';
import { push as gtmPush } from 'Utils/GTM';

((window) => {
	const scriptName = 'GTM-CMS-SGROUPS',
		nameSpace = 'gtmCmsSgroups',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	if (window._CMLS[nameSpace]) {
		log.warn(scriptName, 'Already registered');
		return;
	}

	function fireEvent(e) {
		log.info('Firing event', e);
		gtmPush({ event: e });
		triggerEvent(window, 'cms-sgroup', e);
	}

	let hasRun = false;
	function globalizeGroups() {
		log.info('running sgroups');
		if (hasRun) {
			return;
		}

		window._CMLS.adTag.queue(() => {
			if (!window?._CMLS?.adTag?.pubads()?.getTargeting('cms-sgroup')) {
				log.warn('No relevant page-level targeting found.');
				return;
			}

			// Register sgroups in our global container
			const groups = window._CMLS.adTag
				.pubads()
				.getTargeting('cms-sgroup');

			let isWestwood = false;
			groups.forEach((group) => {
				fireEvent(group);

				if (group.includes('Westwood One')) {
					isWestwood = true;
				}
			});

			if (isWestwood) {
				fireEvent('Westwood One Property');
			} else {
				fireEvent('Cumulus Owned and Operated');
			}
		});

		hasRun = true;
	}

	if (window?._CMLS?.adTag) {
		globalizeGroups();
	} else {
		window.addEventListener('cmls-adtag-loaded', () => globalizeGroups());
	}
})(window.self);
