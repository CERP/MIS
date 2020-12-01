import React from 'react'

import { AppState } from 'reducers'
import { AuthNavigation, Navigation } from 'components/navigation'
import { useDocumentTitle } from 'hooks'
import { SiteConfig } from 'constants/index'
import { useSelector } from 'react-redux'

type P = {
	children: React.ReactNode
	title?: string
}

export const AppLayout: React.FC<P> = ({ children, title }) => {

	const doc_title = title ? title + " | " + SiteConfig.SITE_TITLE : SiteConfig.SITE_TITLE

	// set the document title
	useDocumentTitle(doc_title)

	const { auth } = useSelector((state: AppState) => state.user)

	return (
		<>
			{auth && auth.token ? <AuthNavigation /> : <Navigation />}
			{children}
		</>
	)
}
