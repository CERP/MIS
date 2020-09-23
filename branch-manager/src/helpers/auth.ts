import { v4 } from 'uuid'
const get_client_id = () => {

	const client_id = localStorage.getItem("client_id") || v4()
	localStorage.setItem("client_id", client_id)

	return client_id
}

const load_auth = (): Auth => {

	const initial_auth: Auth = {
		id: undefined,
		token: undefined,
		schools: undefined
	}

	const auth = localStorage.getItem("auth")

	try {
		if (auth === null) {
			return initial_auth
		}

		return JSON.parse(auth) as Auth
	}
	catch (ex) {
		console.log(ex)
		return initial_auth
	}
}

const save_auth = (auth: Auth) => {
	const auth_string = JSON.stringify(auth)
	localStorage.setItem("auth", auth_string)
}

const clear_auth = () => {
	localStorage.removeItem("auth")
}

const clear_client_id = () => {
	localStorage.removeItem("client_id")
}

export { load_auth, save_auth, get_client_id, clear_auth, clear_client_id }