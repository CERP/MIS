import { UserLoginConstants } from 'constants/login'

//@ts-ignore
const auth = JSON.parse(localStorage.getItem("auth")) as Auth || { id: undefined, token: undefined } as Auth

const initial_state: AuthReducerState = {
    auth,
    loggingIn: false
}

export const authentication = (state = initial_state, action: any) => {
    switch (action.type) {
        case UserLoginConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                auth: action.auth
            }
        case UserLoginConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                auth: action.auth
            }
        case UserLoginConstants.LOGIN_FAILURE:
            return {}
        case UserLoginConstants.LOGOUT:
            return {}
        default:
            return state
    }
}