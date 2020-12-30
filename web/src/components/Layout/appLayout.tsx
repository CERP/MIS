import React from 'react'

import { useDocumentTitle } from 'hooks/useDocumentTitle'
import { NavbarPublic } from 'components/navbar/public'

type P = {
	children: React.ReactNode
	title?: string
}

export const AppLayout: React.FC<P> = ({ children, title }) => {

	const doc_title = title ? title + " | " + 'MISchool' : 'MISchool'

	// set the document title
	useDocumentTitle(doc_title)


	return (
		<div className="w-full text-gray-700">
			<NavbarPublic />
			{children}
		</div>
	)
}
