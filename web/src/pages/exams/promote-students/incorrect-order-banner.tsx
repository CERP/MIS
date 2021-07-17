import React from 'react'
import { Link } from 'react-router-dom'

export const ClassOrderErrorBanner = () => {
	return (
		<div className="w-full px-10 pt-10 pb-16 m-auto flex items-center justify-center">
			<div className="border border-gray-200 text-center pt-8 bg-white shadow-md overflow-hidden rounded-lg pb-8">
				<h1 className="lg:text-3xl text-xl mb-5 font-bold text-red-brand">
					One or more Classes Order is Incorrect
				</h1>
				<p className="lg:text-2xl text-base pb-8 px-12 font-medium">
					Please correct the order/year of your classes or contact support for more
					details
				</p>
				<div className="">
					<Link to="/classes">
						<button className="tw-btn-blue py-2 rounded-md">Go to Classes</button>
					</Link>
				</div>
			</div>
		</div>
	)
}
