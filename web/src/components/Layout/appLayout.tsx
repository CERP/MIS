import React from 'react'

import { useDocumentTitle } from 'hooks/useDocumentTitle'
import { AppHeader } from 'components/navbar'
interface AppLayoutProps {
	children: React.ReactNode
	title?: string
	showHeaderTitle?: boolean
	total?: number
}

export const AppLayout: React.FC<AppLayoutProps> = ({
	children,
	title,
	showHeaderTitle,
	total = 0
}) => {
	const docTitle = title ? `${title} | MISchool` : 'MISchool - School Management Software'
	// set the document title
	useDocumentTitle(docTitle)

	return (
		<div className="w-full text-gray-700">
			<AppHeader total={total} title={showHeaderTitle ? title : undefined} />
			{children}
		</div>
	)
}
