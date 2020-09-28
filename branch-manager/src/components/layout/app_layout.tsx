import React from 'react'
import { connect } from 'react-redux'
import { AppState } from 'reducers'

import { SiteConfig as config } from 'constants/index'
import { AuthNavigation, Navigation } from 'components/navigation'
import { useDocumentTitle } from 'utils'

type P = {
	children: React.ReactNode
	title?: string
	auth: Auth
}

const Layout: React.FC<P> = ({ children, title, auth }) => {

	const doc_title = title ? title + " | " + config.siteTitleAlt : config.siteTitleAlt

	useDocumentTitle(doc_title)

	const auth_user = auth ? auth.id && auth.token : false

	return <>
		{auth_user ? <AuthNavigation /> : <Navigation />}
		{children}
	</>
}

const AppLayout = connect((state: AppState) => ({
	auth: state.auth
}))(Layout)

export { AppLayout }