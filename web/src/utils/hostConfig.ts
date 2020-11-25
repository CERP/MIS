//@ts-ignore
const hostOrigin = window.api_url || "dc5aca5d2803.ngrok.io"

const getOriginWSS = (): string => "wss://" + hostOrigin + "/ws"

const getOriginHttps = (): string => "https://" + hostOrigin

export {
	hostOrigin,
	getOriginHttps,
	getOriginWSS
}