import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'

export const About = () => {
	return (
		<AppLayout title={'About Us'}>
			<div className="bg-teal-50 min-h-screen">
				<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
					<div className="flex flex-col items-center space-y-2">
						<div className="text-2xl font-bold">About Us</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}