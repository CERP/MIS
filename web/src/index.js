import React from 'react'
import ReactDOM from 'react-dom'
import Syncr from '@cerp/syncr'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { Toaster } from 'react-hot-toast'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import reducer from './reducers'
import debounce from 'utils/debounce'
import { Routes } from './routing'
import { saveDb, initState } from './utils/indexedDb'
import { loadDB, connected, disconnected, processImageQueue } from './actions/core'
import { hostWSS } from 'utils/hostConfig'
import { checkTime } from 'utils'
import { ActionTypes } from 'constants/index'
import { fetchTargetedInstruction } from 'actions'

import './styles/helper.css'
import './styles/main.css'

const syncr = new Syncr(hostWSS)
syncr.on('connect', () => store.dispatch(connected()))
syncr.on('connect', () =>
	checkTime().then(correct => {
		const text = correct ? '' : 'Your device time or timezone is incorrect'
		store.dispatch({
			type: ActionTypes.ALERT_BANNER_TEXT,
			data: text
		})
	})
)

syncr.on('disconnect', () => store.dispatch(disconnected()))
syncr.on('message', msg => store.dispatch(msg))
syncr.on('verify', () => store.dispatch(processImageQueue()))
syncr.on('verify', () => {
	store.dispatch(fetchTargetedInstruction())
})

syncr.message_timeout = 90000

const store = createStore(
	reducer,
	initState,
	applyMiddleware(thunkMiddleware.withExtraArgument(syncr))
)

store.dispatch(loadDB())

store.subscribe(
	debounce(() => {
		const state = store.getState()
		saveDb(state)
	}, 1000)
)

ReactDOM.render(
	<>
		<Toaster
			position={'top-right'}
			toastOptions={{
				style: {
					margin: '15px',
					background: '#363636',
					color: '#fff',
					width: '300px'
				},
				className: 'text-base',
				duration: 4000
			}}
		/>
		<Routes store={store} />
	</>,
	document.getElementById('root')
)

serviceWorkerRegistration.register()
