import {
	Manager, Swipe, Tap,
	DIRECTION_ALL, DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT, DIRECTION_LEFT,
} from 'hammer';
import { getElements } from '../utils.js';
import { validWord, isMyTurn } from '../selectors.js';

const UI = { bomb: null, form: null };

/**
 * @param {Hammer.Direction} [direction]
 * @returns {string} the class name to represent the swipe direction provided.
 */
function getAnimation(direction) {
	switch (direction) {
		case DIRECTION_LEFT: return 'slideLeft';
		case DIRECTION_RIGHT: return 'slideRight';
		case DIRECTION_UP: return 'slideUp';

		case DIRECTION_DOWN:
		case DIRECTION_NONE:
		default:
			return 'slideDown';
	}
}

/**
 * Handles touch events for the bomb icon
 */
function handleTouch(e) {
	UI.bomb.style.animationName = getAnimation(e.direction);
	UI.form.submit();
}

/**
 * Resets animations when they complete
 */
function clearAnimationState() {
	UI.bomb.style.animationName = '';
	UI.bomb.style.animationPlayState = 'paused';
}

/**
 * Sets up bomb event listeners for touch and animation end.
 * Document must be parsed.
 */
export default function initializeBombEvents() {
	getElements(UI);

	const mc = new Manager(UI.bomb);
	mc.add(new Swipe({ direction: DIRECTION_ALL }));
	mc.add(new Tap());

	mc.on('swipe', handleTouch).on('tap', handleTouch);
	UI.bomb.addEventListener('animationend', clearAnimationState);

	return function removeBombEventListeners() {
		mc.destory();
		UI.bomb.removeEventListener('animationend', clearAnimationState);
	}
}
