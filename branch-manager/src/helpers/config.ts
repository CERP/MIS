
const debug_url = "http://localhost:8080"

const get_host = () => {
    // @ts-ignore
    return window.api_url || debug_url
}

export { get_host, }