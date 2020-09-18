import React from 'react'

import { AppLayout } from 'components/layout'

export const Landing = () => {
	return (<AppLayout>
		<div className="fixed right-0 h-screen w-screen z-50 flex justify-center items-center">
			<div className="from-gray-700 font-bold"> MIS Branch Manager</div>
			<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
			<div className="from-gray-700 font-bold"> Coming Soon!</div>
		</div>
	</AppLayout>
	)
}