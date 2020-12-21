import { AnyAction } from 'redux'
import { AlertActionTypes } from 'constants/index'

const initial_state: AlertReducerState = {
	type: '',
	message: ''
}

export const alert = (state: AlertReducerState = initial_state, action: AnyAction): AlertReducerState => {
	switch (action.type) {
		case AlertActionTypes.PENDING:
		case AlertActionTypes.ERROR:
		case AlertActionTypes.SUCCESS:
			{
				return {
					...state,
					...action.data
				}
			}
		case AlertActionTypes.CLEAR:
			return initial_state
		default:
			return state
	}
}