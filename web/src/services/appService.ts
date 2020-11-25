import { getOriginHttps } from 'utils/hostConfig'

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
		headers: {
			'Content-Type': 'application/json'
		}
	}
}

const handleResponse = (response: Response): any | Promise<any> => {
	return response.text().then((text: string) => {

		let json_resp = {} as any

		try {
			json_resp = JSON.parse(text)
		} catch (err) {
			console.log(text)
		}

		if (!response.ok) {
			const error = (json_resp && json_resp.message) || text || response.statusText || 'fetch-error'
			return Promise.reject(error)
		}

		return json_resp
	})
}

export const AppService = {
	getServerTime
}