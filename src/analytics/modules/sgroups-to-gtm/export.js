/**
 * Send global targeting (cms-sgroups) values as GTM events
 */
((window) => {
	const { triggerEvent } = window._CMLS.libs;
	const { push: gtmPush } = window._CMLS.libs.GTM;
	const scriptName = 'SGROUPS-TO-GTM';
	const nameSpace = 'gtmCmsSgroups';
	const version = '0.3';

	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	if (window._CMLS[nameSpace]) {
		log.warn(scriptName, 'Already registered');
		return;
	}

	function fireEvent(e) {
		log.debug('Firing event', e);
		gtmPush({ event: e });
		triggerEvent(window, 'cms-sgroup', e);
	}

	let hasRun = false;
	function globalizeGroups() {
		log.debug('running sgroups');
		if (hasRun) {
			return;
		}

		window._CMLS.adTag.queue(() => {
			if (!window?._CMLS?.adTag?.isReady()) {
				log.warn('Adtag interface is not ready!');
				return;
			}

			const groups = window._CMLS.adTag.getTargeting('cms-sgroup');

			if (!groups || !groups.length) {
				log.warn('No relevant page-level targeting found.');
				return;
			}

			// Register sgroups in our global container
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
