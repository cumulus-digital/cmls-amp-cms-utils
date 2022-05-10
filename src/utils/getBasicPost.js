/**
 * Returns the DOM node of a generic, regular post
 */
import Logger from 'Utils/Logger';

function getBasicPost() {
	const scriptName = 'GET BASIC POST',
		nameSpace = 'getBasicPost',
		version = '0.1';

	const log = new Logger(`${scriptName} ${version}`);

	const doc = window.self.document;

	if (!doc.body.classList.contains('post-template-default')) {
		log.info('Not the default post template.');
		return false;
	}

	const postId = [...doc.body.classList]
		.find((name) => name.includes('postid-'))
		?.replace('postid-', '');

	if (!postId) {
		log.info('Could not discover post ID');
		return false;
	}

	const entry = doc.querySelector(
		'.wp-block-post-content,' + `.wrapper-content .column-1 #post-${postId}`
	);
	if (!entry) {
		log.info('Could not discover post content.');
		return false;
	}

	const entryBox = entry.getBoundingClientRect();
	if (entryBox.width > 900 || entryBox.width < 300) {
		log.info('Post content width is suspicious.', entryBox.width);
		return false;
	}

	return entry;
}
export default getBasicPost;
