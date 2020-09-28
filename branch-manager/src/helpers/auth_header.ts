import { get_client_id, load_state } from 'helpers'

const auth_header = () => {

	const state = load_state()
	const client_id = get_client_id()

	if (state.auth && state.auth.token) {
		return {
			'content-type': 'application/json',
			'auth-token': state.auth.token,
			'username': state.auth.id,
			'client-id': client_id
		}
	}

	return {}
}

export { auth_header }