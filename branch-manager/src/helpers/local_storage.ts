import { AppState } from 'reducers'
import { v4 } from 'uuid'

const get_client_id = () => {

	const client_id = localStorage.getItem("client_id") || v4()
	localStorage.setItem("client_id", client_id)

	return client_id
}

const load_state = (): AppState => {

	const initial_state: AppState = {
		auth: {
			id: undefined,
			token: undefined,
			schools: [],
			loggedIn: false,
			loggingIn: false
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

const save_state = (state: AppState) => {
	const state_string = JSON.stringify(state)
	localStorage.setItem("state", state_string)
}

const clear_state = () => {
	localStorage.removeItem("state")
}

const clear_client_id = () => {
	localStorage.removeItem("client_id")
}

export { load_state, save_state, get_client_id, clear_state, clear_client_id }