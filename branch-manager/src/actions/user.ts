
import { UserActionTypes } from 'constants/index'

import * as alert_actions from 'actions/alert'
import * as services from 'services'

export const login = (username: string, password: string): any => {

	return (dispatch: any) => {

		dispatch(alert_actions.pending({ type: UserActionTypes.LOGIN_REQUEST, message: '' }))

		services.login(username, password)
			.then(resp => {

				const { token, schools } = resp

				const create_user = {
					auth: {
						id: username,
						token
					},
					profile: {
						id: username
					},
					schools
				}

				dispatch({ type: UserActionTypes.LOGIN_SUCCESS, data: create_user })
				dispatch(alert_actions.success({ type: UserActionTypes.LOGIN_SUCCESS, message: '' }))
			},
				(error: string) => {
					dispatch(alert_actions.error({ type: UserActionTypes.LOGIN_FAILURE, message: error.toString() }))
				}
			)
	}
}

export const logout = (): any => {
	return { type: UserActionTypes.LOGOUT }
}