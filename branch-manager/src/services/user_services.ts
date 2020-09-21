//@ts-nocheck

import { get_client_id, get_host } from 'helpers'
import { auth_header, save_auth, clear_auth } from 'helpers'

const host = get_host()
const client_id = get_client_id()

const login = (username: string, password: string) => {

	const request_options = {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username, password, client_id })
	}

	return fetch(`${host}/branch-manager/users/authenticate`, request_options)
		.then(handle_response)
		.then(auth_token => {
			const auth = { id: username, token: auth_token }
			save_auth(auth)
			return auth
		})
}

const logout = () => {
	clear_auth()
}

const get_branches = () => {

	const request_options = get_request_options()

	// @ts-ignore
	return fetch(`${host}/school-branches/`, request_options).then(handle_response)
}


const handle_response = (response: any) => {
	return response.text().then((text: any) => {
		const data = text && JSON.parse(text)
		if (!response.ok) {
			if (response.status === 401) {
				// auto logout if 401 response returned from api
				logout()
				window.location.reload()
			}
			const error = (data && data.message) || response.statusText
			return Promise.reject(error)
		}

		console.log("RESPONSE", data);
		return data
	})
}

const get_request_options = () => {
	return {
		method: 'GET',
		headers: auth_header()
	}
}

export const user_service = {
	login,
	logout
}