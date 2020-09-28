import { combineReducers } from 'redux'

import { alert } from './alert_reducer'
import { auth } from './authentication_reducer'

const root_reducer = combineReducers({
	alert,
	auth
})

export type AppState = ReturnType<typeof root_reducer>
export { root_reducer }