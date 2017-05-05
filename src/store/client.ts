import { createStore, combineReducers, applyMiddleware, Store } from 'redux';
import { global, player, PlayerState } from '../reducers';
import { newSocketMiddleware } from '../socket';
import {
	NEW_ROUND, TICK, SYNC, COUNTDOWN,
	GAME_OVER, FOUND_WORD, BLEW_UP,
} from '../messages';

const clientReducer = combineReducers({ global, player });

/**
 * @param {SocketIOClient.Socket} io
 * @returns {Store}
 */
export default function createClientStore(io: SocketIOClient.Socket): Store<PlayerState> {
	return createStore(
		clientReducer,
		applyMiddleware(
			newSocketMiddleware(io, [
				NEW_ROUND, TICK, SYNC, COUNTDOWN,
				GAME_OVER, FOUND_WORD, BLEW_UP,
			]),
		),
	);
}
