import { Dispatch } from 'redux'

import { UserLoginConstants } from 'constants/index'
import { alert_actions } from './alert_actions'
import { user_service } from 'services'
import { history } from 'helpers'

const login = (username: string, password: string, from: any) => {

    return (dispatch: Dispatch) => {

        dispatch(request({ username }))

        user_service.login(username, password)
            .then(
                auth => {
                    dispatch(success(auth))
                    history.push(from)
                },
                error => {
                    dispatch(failure(error.toString()))
                    dispatch(alert_actions.error(error.toString()))
                }
            )
    }
}

const request = (auth: any) => { return { type: UserLoginConstants.LOGIN_REQUEST, auth } }
const success = (auth: any) => { return { type: UserLoginConstants.LOGIN_SUCCESS, auth } }
const failure = (error: any) => { return { type: UserLoginConstants.LOGIN_FAILURE, error } }

const logout = () => {
    user_service.logout()
    return { type: UserLoginConstants.LOGOUT }
}

export const user_actions = {
    login,
    logout
}