
const debug_url = "http://421c8d18d442.ngrok.io"

const get_host = () => {
    // @ts-ignore
    return window.api_url || debug_url
}

export { get_host, }