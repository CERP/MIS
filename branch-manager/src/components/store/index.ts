import { applyMiddleware, AnyAction, createStore, Store } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { AppState, rootReducer } from 'reducers'

import { debounce } from 'utils/debounce'
import { loadState, saveState } from 'utils/localStorage'

const loggerMiddleware = createLogger()

const initialState = loadState()

const createAppStore: Store<AppState> = createStore(
	rootReducer,
	initialState,
	applyMiddleware(loggerMiddleware, thunkMiddleware as ThunkMiddleware<AppState, AnyAction>)
)

createAppStore.subscribe(debounce(() => {
	const state = store.getState()
	saveState(state)
}, 0))

export const store = createAppStore