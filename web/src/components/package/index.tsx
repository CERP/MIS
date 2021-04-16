import React from 'react'
import { Link } from 'react-router-dom'

import { packages } from 'constants/landing'

export const PackageList = () => {
	return (
		<div className="min-h-screen">
			<div className="mt-10 px-10 md:px-40">
				<div className="grid gap-12 grid-cols-1 md:grid-cols-3">
					{packages.map((pkg, index) => (
						<PackageCard key={pkg.title + index} schoolPackage={pkg} />
					))}
				</div>
			</div>
			<div className="mt-10">
				<div className="flex flex-col items-center justify-center space-y-2">
					<div className="text-lg">Or want to try before you buy?</div>
					<Link to="/signup?package=FREE_TRIAL" className="tw-btn-blue px-8 py-3">
						Signup up for 15 days Free Trial
					</Link>
				</div>
			</div>
		</div>
	)
}

type CardProps = {
	schoolPackage: Package
}

export const PackageCard = ({ schoolPackage }: CardProps) => {
	return (
		<div className={'rounded-3xl border border-gray-50 bg-white shadow-md hover:shadow-lg'}>
			<div
				className={`m-1 py-5 px-3 rounded-3xl flex flex-col items-center ${schoolPackage.popular ? 'bg-gray-700 text-white' : ''
					}`}>
				<div className="font-semibold text-lg">{schoolPackage.title}</div>
				{schoolPackage.popular ? (
					<div className="my-2 px-2 text-xs rounded-full uppercase bg-purple-700 text-white">
						Popular
					</div>
				) : (
					<div className="my-4" />
				)}
				<div className="relative mt-4">
					<div className="font-bold text-2xl">{schoolPackage.price}</div>
					<div className="absolute top-0 -right-6 text-xs">{schoolPackage.currency}</div>
				</div>
				<div className="text-gray-500">Annual {schoolPackage.annual_charge}</div>
				<div className="font-lg font-semibold mt-4">{schoolPackage.limit} Students</div>
				<div className="mt-4 py-3 text-center w-full bg-teal-brand cursor-pointer hover:shadow-md text-white rounded-md">
					Choose Plan
				</div>
			</div>
		</div>
	)
}
