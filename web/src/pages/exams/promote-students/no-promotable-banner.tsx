import React from 'react'
import { Link } from 'react-router-dom'

export const NoClassesToPromoteBanner = () => {
	return (
		<div className="w-full px-10 py-16 m-auto flex items-center justify-center">
			<div className="bg-white shadow-md overflow-hidden sm:rounded-lg pb-8">
				<div className="border-t border-gray-200 text-center pt-8">
					<h1 className="lg:text-3xl text-xl mb-5 font-bold text-red-brand">
						No Classses to Promote
					</h1>
					<p className="lg:text-2xl text-base pb-8 px-12 font-medium">
						There are no classes to promote, or the classes exist and you do not have
						students in them.
						<br />
						If you think this is an error, please contact us
					</p>
					<div className="space-x-4">
						<Link to="/home">
							<button className="tw-btn-blue py-2 rounded-md">Go Home</button>
						</Link>
						<Link to="/contact-us">
							<button className="tw-btn-red py-2 rounded-md">Contact Us</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
