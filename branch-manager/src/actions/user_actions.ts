import { Dispatch } from 'redux'

import { UserLoginConstants } from 'constants/index'
import { alert_actions } from './alert_actions'
import { user_service } from 'services'
import { history } from 'helpers'

const login = (username: string, password: string) => {

	return (dispatch: Dispatch) => {

		dispatch(request({ id: username }))

		user_service.login(username, password)
			.then(
				auth => {
					dispatch(success(auth))
					history.push("/home")
					window.location.reload()
				},
				error => {
					const message = error.toString()
					dispatch(failure())
					dispatch(alert_actions.error({ type: 'login-error', message }))
				}
			)
	}
}

const request = (auth: Auth) => { return { type: UserLoginConstants.LOGIN_REQUEST, data: auth } }
const success = (auth: Auth) => { return { type: UserLoginConstants.LOGIN_SUCCESS, data: auth } }
const failure = (error?: string) => { return { type: UserLoginConstants.LOGIN_FAILURE } }

const logout = () => {
	user_service.logout()
	return { type: UserLoginConstants.LOGOUT }
}

export const user_actions = {
	login,
	logout
}