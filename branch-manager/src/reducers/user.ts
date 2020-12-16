import { AnyAction } from 'redux'
import { UserActionTypes } from 'constants/index'

const initial_state: UserReducerState = {
	auth: {},
	profile: {},
	schools: {}
}

export const user = (state: UserReducerState = initial_state, action: AnyAction): UserReducerState => {
	switch (action.type) {
		case UserActionTypes.LOGIN_SUCCESS:
			return {
				...state,
				...action.data,
			}
		case UserActionTypes.LOGOUT:
			return initial_state
		default:
			return state
	}
}