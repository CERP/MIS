import { combineReducers } from 'redux'

import { alert } from './alert'
import { user } from './user'

const rootReducer = combineReducers({
	alert,
	user
})

export type AppState = ReturnType<typeof rootReducer>
export { rootReducer }