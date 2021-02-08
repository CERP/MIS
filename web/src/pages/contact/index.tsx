import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'

export const Contact = () => {
	return (
		<AppLayout title={'Contact Us'}>
			<div className="md:min-h-screen p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="flex flex-col items-center space-y-2">
					<div className="text-2xl font-bold">Contact Us</div>

				</div>
			</div>
		</AppLayout>
	)
}