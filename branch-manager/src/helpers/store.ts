import { applyMiddleware, AnyAction, createStore, Store } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { AppState, root_reducer } from 'reducers/index'
import { createLogger } from 'redux-logger'
import { load_state, save_state } from './local_storage'
import debounce from 'utils/debounce'

const loggerMiddleware = createLogger()

const initial_state = load_state()

const create_store: Store<AppState> = createStore(
	root_reducer,
	initial_state,
	applyMiddleware(loggerMiddleware, thunkMiddleware as ThunkMiddleware<AppState, AnyAction>)
)

create_store.subscribe(debounce(() => {
	const state = store.getState()
	save_state(state)
}, 0))

export const store = create_store