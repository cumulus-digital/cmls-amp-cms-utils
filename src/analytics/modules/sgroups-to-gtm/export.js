/**
 * Send global targeting (cms-sgroups) values as GTM events
 */
((window) => {
	const { Logger, triggerEvent, GTM } = window.__CMLSINTERNAL.libs;
	const { push: gtmPush } = GTM;
	const scriptName = 'SGROUPS-TO-GTM';
	const nameSpace = 'gtmCmsSgroups';
	const version = '0.3';

	const log = new Logger(`${scriptName} ${version}`);

	if (window.__CMLSINTERNAL[nameSpace]) {
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

		window.__CMLSINTERNAL.adTag.queue(() => {
			if (
				!window.__CMLSINTERNAL?.adTag?.isReady ||
				!window.__CMLSINTERNAL.adTag.isReady()
			) {
				log.warn('Adtag interface is not ready!');
				return;
			}

			const groups =
				window.__CMLSINTERNAL.adTag.getTargeting('cms-sgroup');

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

	if (window?.__CMLSINTERNAL?.adTag) {
		globalizeGroups();
	} else {
		window.addEventListener('cmls-adtag-loaded', () => globalizeGroups());
	}
})(window.self);
