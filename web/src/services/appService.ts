import { getOriginHttps } from 'helpers'

const host = getOriginHttps()

const baseURL = host + "/mis"

const getServerTime = async (): Promise<any> => {
	const opts = getRequestOptions()
	const response = await fetch(`${baseURL}/server-time`, opts)
	return handleResponse(response)
}

const getRequestOptions = (): RequestInit => {

	return {
		method: 'GET',
		headers: {},
		mode: 'no-cors'
	}
}

const handleResponse = (response: Response): any | Promise<any> => {
	return response.json().then((resp: any) => {
		if (!response.ok) {
			const error = (resp && resp.message) || response.statusText || 'fetch error'
			return Promise.reject(error)
		}
		return resp
	})
}

export const AppService = {
	getServerTime
}