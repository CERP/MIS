import { v4 } from 'uuid'
import { AppState } from 'reducers'

export const getClientId = () => {

	const clientId = localStorage.getItem("client_id") || v4()

	localStorage.setItem("client_id", clientId)

	return clientId
}

export const loadState = (): AppState => {

	const initial_state: AppState = {
		user: {
			auth: {},
			profile: {},
			schools: {}
		},
		alert: {
			type: '',
			message: ''
		}
	}

	const state = localStorage.getItem("state")

	try {
		if (state === null) {
			return initial_state
		}

		return JSON.parse(state) as AppState
	}
	catch (ex) {
		console.log(ex)
		return initial_state
	}
}

export const saveState = (state: AppState) => {
	const stateString = JSON.stringify(state)
	localStorage.setItem("state", stateString)
}

export const clearState = () => {
	localStorage.removeItem("state")
}

export const clearClientId = () => {
	localStorage.removeItem("client_id")
}