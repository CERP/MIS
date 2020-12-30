import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { Package } from 'components/Package'
import { Link } from 'react-router-dom'

export const Pricing = () => {
	return (
		<AppLayout title='Pricing'>
			<div className="bg-teal-50 py-10">
				<div className="flex flex-col items-center space-y-2">
					<div className="text-2xl font-bold">Select your Package</div>
					<div className="text-sm mt-5">
						<span className="text-gray-500">Have an account? </span>
						<Link to="/school-signup" className="text-blue-500 text-base">Sign in</Link>
					</div>
				</div>
				<Package />
			</div>
		</AppLayout>
	)
}