import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { applyMiddleware, AnyAction, createStore, Store } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import Syncr from '@cerp/syncr'

import Routes from 'routes/routes'
import reducer from 'reducers'
import { loadDB, saveDB } from 'utils/localStorage'
import debounce from 'utils/debounce'
import { get_host } from 'config'

import { connected, disconnected } from 'actions/core'

const host = get_host()

const syncr = new Syncr(`wss://${host}/ws`)

// @ts-ignore
syncr.on('connect', () => store.dispatch(connected()))
syncr.on('disconnect', () => store.dispatch(disconnected()))
syncr.on('message', (msg: AnyAction) => store.dispatch(msg))

const initial_state = loadDB()

const store: Store<RootReducerState> = createStore(
	reducer,
	initial_state,
	applyMiddleware(thunkMiddleware.withExtraArgument(syncr) as ThunkMiddleware<RootReducerState, AnyAction, Syncr>))

const saveBounce = debounce(() => {
	const state = store.getState()
	saveDB(state)
}, 500)

store.subscribe(saveBounce as () => void)

ReactDOM.render(<Routes store={store} />, document.getElementById('root'))

serviceWorker.register({
	onUpdate: (registration: ServiceWorkerRegistration) => {
		registration.installing && registration.installing.postMessage({
			type: "SKIP_WAITING"
		})
	}
})