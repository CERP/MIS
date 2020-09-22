import { AlertConstants } from 'constants/index'

const initial_state: AlertState = {
	type: '',
	message: ''
}

export const alert = (state = initial_state, action: any) => {
	switch (action.type) {
		case AlertConstants.SUCCESS:
			return {
				type: 'alert-success',
				message: action.message
			}
		case AlertConstants.ERROR:
			return {
				type: 'alert-danger',
				message: action.message
			}
		case AlertConstants.CLEAR:
			return {}
		default:
			return state
	}
} 