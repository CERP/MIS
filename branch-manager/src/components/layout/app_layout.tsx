import React from 'react'

import { SiteConfig as config } from 'constants/index'
import { Navigation } from 'components/navigation'
import { useDocumentTitle } from 'utils'

type P = {
    children: React.ReactNode
    title?: string
}

export const AppLayout: React.FC<P> = ({ children, title }) => {

    const doc_title = title ? title + " | " + config.siteTitleAlt : config.siteTitleAlt

    useDocumentTitle(doc_title)

    return <>
        <Navigation />
        {children}
    </>
}