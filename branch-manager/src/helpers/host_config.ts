// @ts-nocheck
const debug_url = "http://46f646750ca1.ngrok.io"

const get_host = () => {
	return window.api_url || debug_url
}

export { get_host }