//@ts-ignore
const hostOrigin = window.api_url || "be96031fde33.ngrok.io"

const getOriginWSS = (): string => "wss://" + hostOrigin + "/ws"

const getOriginHttps = (): string => "https://" + hostOrigin

export {
	hostOrigin,
	getOriginHttps,
	getOriginWSS
}