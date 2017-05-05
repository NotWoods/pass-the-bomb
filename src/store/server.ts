import { createStore, combineReducers, applyMiddleware, Store } from 'redux';
import { global, spectator, ServerState } from '../reducers/index.js';
import newSocketMiddleware from '../socket/socketMiddleware.js';
import {
	BLEW_UP, NEW_ROUND, FOUND_WORD,
	TICK, COUNTDOWN, GAME_OVER,
} from '../messages.js';

const serverReducer = combineReducers({ global, spectator });

/**
 * @param {SocketIO.Namespace} io
 * @returns {Store}
 */
export default function createServerStore(io: SocketIO.Namespace): Store<ServerState> {
	return createStore(
		serverReducer,
		applyMiddleware(
			newSocketMiddleware(io, [
				BLEW_UP, NEW_ROUND, FOUND_WORD,
				TICK, COUNTDOWN, GAME_OVER,
			]),
		),
	);
}
