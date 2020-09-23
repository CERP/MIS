import { get_client_id, load_auth } from 'helpers'

const auth_header = () => {

	const auth = load_auth()
	const client_id = get_client_id()

	if (auth && auth.token) {
		return {
			'content-type': 'application/json',
			'auth-token': auth.token,
			'username': auth.id,
			'client-id': client_id
		}
	}

	return {}
}

export { auth_header }