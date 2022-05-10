/**
 * Holder for our multiple dataLayers
 */
export const dataLayers = [
	window?.sharedContainerDataLayer,
	window?.corpDataLayer,
];

/**
 * Push a command to all datalayers at once
 * @param {object} ev Variables to push to all data layers
 */
export const push = (ev) => {
	dataLayers.forEach((dl) => {
		if (dl?.push) dl.push(ev);
	});
};
