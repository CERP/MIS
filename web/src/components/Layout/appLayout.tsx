import React from 'react'

import { useDocumentTitle } from 'hooks/useDocumentTitle'
import { AppHeader } from 'components/navbar'
interface AppLayoutProps {
	children: React.ReactNode
	title?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {

	const docTitle = title ? `${title} | MISchool` : 'MISchool'
	// set the document title
	useDocumentTitle(docTitle)

	return (
		<div className="w-full text-gray-700">
			<AppHeader />
			{children}
		</div>
	)
}
