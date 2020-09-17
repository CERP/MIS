
// const debug_url = "69def37f.ngrok.io"
const debug_url = "https://ilmexchange.com"

export function get_host(): string {
    // @ts-ignore
    return window.api_url || debug_url
}
