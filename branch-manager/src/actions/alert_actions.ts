import { AlertConstants } from 'constants/index'

const success = (message: string) => {
	return { type: AlertConstants.SUCCESS, message }
}

const error = (message: string) => {
	return { type: AlertConstants.ERROR, message }
}

const clear = () => {
	return { type: AlertConstants.CLEAR }
}

export const alert_actions = {
	success,
	error,
	clear
}