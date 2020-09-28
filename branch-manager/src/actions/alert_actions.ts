import { AlertConstants } from 'constants/index'

const success = (data: AlertState) => {
	return { type: AlertConstants.SUCCESS, data }
}

const error = (data: AlertState) => {
	return { type: AlertConstants.ERROR, data }
}

const clear = () => {
	return { type: AlertConstants.CLEAR }
}

export const alert_actions = {
	success,
	error,
	clear
}