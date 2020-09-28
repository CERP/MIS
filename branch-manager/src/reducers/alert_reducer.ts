import { AnyAction } from 'redux'
import { AlertConstants } from 'constants/index'

const initial_state: AlertState = {
	type: '',
	message: ''
}

const alert = (state: AlertState = initial_state, action: AnyAction): AlertState => {
	switch (action.type) {
		case AlertConstants.SUCCESS:
			return {
				...state,
				...action.data,
			}
		case AlertConstants.ERROR:
			return {
				...state,
				...action.data
			}
		case AlertConstants.CLEAR:
			return {
				...state,
				message: '',
				type: ''
			}
		default:
			return state
	}
}

export { alert }