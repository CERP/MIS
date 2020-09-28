import { AnyAction } from 'redux'
import { UserLoginConstants } from 'constants/login'

const initial_state: AuthReducerState = {
	id: undefined,
	token: undefined,
	loggingIn: false,
	loggedIn: false
}

const auth = (state: AuthReducerState = initial_state, action: AnyAction): AuthReducerState => {
	switch (action.type) {
		case UserLoginConstants.LOGIN_REQUEST:
			return {
				...state,
				...action.data,
				loggingIn: true
			}
		case UserLoginConstants.LOGIN_SUCCESS:
			return {
				...state,
				...action.data,
				loggedIn: true
			}
		case UserLoginConstants.LOGIN_FAILURE:
			return {
				...state,
				loggingIn: false,
				loggedIn: false
			}
		case UserLoginConstants.LOGOUT:
			return initial_state
		default:
			return state
	}
}

export { auth }