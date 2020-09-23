//@ts-nocheck

import { get_client_id, get_host } from 'helpers'
import { auth_header, save_auth, clear_auth } from 'helpers'

const host = get_host() + '/branch-manager'
const client_id = get_client_id()

const login = async (username: string, password: string) => {

	const request_options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username, password, client_id })
	}

	const response = await fetch(`${host}/users/authenticate`, request_options)
	const branch_mgr = await handle_response(response)

	const auth = { id: username, ...branch_mgr }

	// save to localstorage
	save_auth(auth)

	return auth
}

const logout = () => {
	clear_auth()
}

const fetch_school_branches = async () => {
	const options = get_request_options()
	const response = await fetch(`${host}/school-branches/`, options)
	return handle_response(response)
}

const fetch_daily_stats = async (school_id: string) => {
	const options = get_request_options()
	const response = await fetch(`${host}/daily-stats?${school_id}`, options)
	return handle_response(response)
}

const handle_response = (response: any) => {
	return response.json().then((resp: any) => {
		if (!response.ok) {
			if (response.status === 401) {
				// auto logout if 401 response returned from api
				logout()
				window.location.reload()
			}
			const error = (resp && resp.message) || response.statusText
			return Promise.reject(error)
		}

		return resp && resp.data
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
	logout,
	fetch_school_branches,
	fetch_daily_stats
}