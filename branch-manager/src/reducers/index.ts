import { combineReducers } from 'redux'

import { alert } from './alert_reducer'
import { authentication } from './authentication_reducer'

const root_reducer = combineReducers({
    alert,
    authentication
})

export type RootReducerCombinedState = ReturnType<typeof root_reducer>
export { root_reducer }