/**
 * Disables slot collapsing before ad fetch.
 * See config.json for definitions.
 */
import config from './config.json';

const {
	scriptName,
	version,
	divIds: configDivIds = [],
	pos: configPos = [],
} = config;

((window, undefined) => {
	const log = new window._CMLS.Logger(`${scriptName} ${version}`);

	const init = () => {
		const slots = window._CMLS.adTag.getSlots();
		const toDisable = slots.filter((slot) => {
			const id = slot.getSlotElementId();
			const pos = slot.getTargeting('pos');
			if (
				configDivIds.includes(id) ||
				configPos.some((p) => pos.includes(p))
			) {
				return slot;
			}
		});

		if (toDisable.length) {
			log.info(
				`Disabling collapse for ${toDisable.length} slots`,
				window._CMLS.adTag.listSlotData(toDisable)
			);
			toDisable.forEach((slot) => slot.setCollapseEmptyDiv(true, false));
		}
	};

	if (window._CMLS.adTag) {
		window._CMLS.adTag.queue(() => {
			init();
		});
	} else {
		window.addEventListener('cmls-adtag-loaded', () => {
			window._CMLS.adTag.queue(() => {
				init();
			});
		});
	}
})(window.self);
