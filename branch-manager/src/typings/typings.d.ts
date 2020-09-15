interface Config {
	siteTitle: string
	siteTitleShort: string
	siteTitleAlt: string
	siteLogo: string
	siteUrl: string
	email: string
	siteDescription: string
	googleAnalyticsID: string
	menuLinks: MenuLink[]
	themeColor: string
	backgroundColor: string
}

interface MenuLink {
	name: string
	link: string
}

interface SyncState {

}

interface RootReducerState {
	sync_state: SyncState
	auth: {
		id?: string
		token?: string
		client_type: "tech_demo"
	}
	client_id: string
	queued: {
		[path: string]: {
			action: {
				path: string[]
				value?: any
				type: "MERGE" | "DELETE"
			}
			date: number
		}
	}
	last_snapshot: number
	accept_snapshot: boolean
	connected: boolean
}

