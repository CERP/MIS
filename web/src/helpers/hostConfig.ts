//@ts-ignore
const hostOrigin = window.api_url || "mis-socket.metal.fish"

export const getOriginWSS = (): string => "wss://" + hostOrigin + "/ws"

export const getOriginHttps = (): string => "https://" + hostOrigin