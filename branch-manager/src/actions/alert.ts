import { AlertActionTypes } from 'constants/index'

export const pending = (data: Alert) => {
	return { type: AlertActionTypes.PENDING, data }
}

export const success = (data: Alert) => {
	return { type: AlertActionTypes.SUCCESS, data }
}

export const error = (data: Alert) => {
	return { type: AlertActionTypes.ERROR, data }
}

export const clear = () => {
	return { type: AlertActionTypes.CLEAR }
}