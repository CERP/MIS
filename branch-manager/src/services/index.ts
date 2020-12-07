import { getClientId, loadState } from 'utils/localStorage'

const host = 'http://ac784c269974.ngrok.io'
const prefix = '/branch-manager'

const baseURL = host + prefix

export const login = async (username: string, password: string) => {
	const reqOpts = postRequestOptions({ username, password }, false)
	const response = await fetch(`${baseURL}/user/authenticate`, reqOpts)
	return handleFetchResponse(response)

}

export const getSchools = async () => {
	const options = getRequestOptions()
	const response = await fetch(`${baseURL}/school-branches/`, options)
	return handleFetchResponse(response)
}

export const getDailyStats = async (schoolId: string) => {
	const options = getRequestOptions()
	const response = await fetch(`${baseURL}/daily-stats?school_id=${schoolId}`, options)
	return handleFetchResponse(response)
}

export const getStudentsAttendance = async (schoolId: string) => {
	const options = getRequestOptions()
	const response = await fetch(`${baseURL}/students-attendance?school_id=${schoolId}`, options)
	return handleFetchResponse(response)
}

export const getTeachersAttendance = async (schoolId: string) => {
	const options = getRequestOptions()
	const response = await fetch(`${baseURL}/teachers-attendance?school_id=${schoolId}`, options)
	return handleFetchResponse(response)
}

export const getSchoolEnrollment = async (schoolId: string) => {
	const options = getRequestOptions()
	const response = await fetch(`${baseURL}/school-enrollment?school_id=${schoolId}`, options)
	return handleFetchResponse(response)
}

const handleFetchResponse = (response: any) => {
	return response.json().then((resp: any) => {
		if (!response.ok) {
			const error = (resp && resp.message) || response.statusText || 'Fetch Sever Error'
			return Promise.reject(error)
		}

		return resp
	})
}


const getRequestOptions = (authHeaders = true) => {

	const headers = authHeaders ? getAuthHeaders() : {}

	return {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'client-id': getClientId(),
			...headers
		}
	} as RequestInit
}

const postRequestOptions = (payload: any, authHeaders = true) => {

	const headers = authHeaders ? getAuthHeaders() : {}

	return {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'client-id': getClientId(),
			...headers
		},
		body: JSON.stringify(payload)
	} as RequestInit
}

const getAuthHeaders = () => {
	const state = loadState()
	const auth = state.user?.auth

	if (!auth || !auth.token) {
		return {}
	}

	return {
		'auth-token': auth.token,
		'username': auth.id
	}
}