export const auth_header = () => {

	const auth = JSON.parse(localStorage.getItem('auth') || '')

	if (auth && auth.token) {
		return { 'auth': auth.token }
	}

	return {}
}