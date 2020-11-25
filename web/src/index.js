import React from 'react';
import ReactDOM from 'react-dom';
import Syncr from '@cerp/syncr'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import 'core-js/features/object'

import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers'
import Routes from './routes'
import { saveDb, initState } from './utils/indexedDb'
import debounce from 'utils/debounce'
import { loadDB, connected, disconnected, processImageQueue } from './actions/core'
import { hostWSS } from 'utils/hostConfig'
import { checkTime } from 'utils'
import { ActionTypes } from 'constants/index'

import './index.css';
import './styles/main.css'

const initialState = initState

const syncr = new Syncr(hostWSS)
syncr.on('connect', () => store.dispatch(connected()))

syncr.on('connect', () => checkTime()
	.then(is_correct => {
		store.dispatch({ type: ActionTypes.SERVER_TIME_SUCCESS, data: is_correct })
	})
)

syncr.on('disconnect', () => store.dispatch(disconnected()))
syncr.on('message', (msg) => store.dispatch(msg))
syncr.on('verify', () => store.dispatch(processImageQueue()))

syncr.message_timeout = 90000;

const store = createStore(reducer, initialState, applyMiddleware(thunkMiddleware.withExtraArgument(syncr)));

store.dispatch(loadDB())

store.subscribe(debounce(() => {
	const state = store.getState();
	saveDb(state);
}, 1000))

ReactDOM.render(<Routes store={store} />, document.getElementById('root'));
registerServiceWorker();
