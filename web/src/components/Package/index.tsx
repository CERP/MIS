import React from 'react'

import { packages } from 'constants/landing'

export const Package = () => {
	return (
		<div className="min-h-screen">
			<div className="mt-10 px-10 md:px-40 grid">
				<div className="grid gap-12 grid-cols-1 md:grid-cols-3">
					{
						(packages || []).map((pkg, index) => (
							<div key={pkg.title + index} className={"rounded-3xl bg-white"}>
								<div className={`m-1 py-5 px-3 rounded-3xl flex flex-col items-center ${pkg.popular ? 'bg-gray-700 text-white' : ''}`}>
									<div className="font-semibold text-lg">{pkg.title}</div>
									{
										pkg.popular ? <div className="my-2 px-2 text-xs rounded-full uppercase bg-purple-700 text-white">Popular</div>
											:
											<div className="my-4" />
									}
									<div className="relative mt-4">
										<div className="font-bold text-2xl">{pkg.price}</div>
										<div className="absolute top-0 -right-6 text-xs">{pkg.currency}</div>
									</div>
									<div className="text-gray-500">Annual {pkg.annual_charge}</div>
									<div className="font-lg font-semibold mt-4">{pkg.limit} Students</div>
									<div className="mt-4 py-3 text-center w-full bg-teal-500 cursor-pointer hover:bg-teal-600 text-white rounded-md">Choose Plan</div>
								</div>
							</div>
						))
					}
				</div>
			</div>
			<div className="mt-10">
				<div className="flex flex-col items-center justify-center space-y-2">
					<div className="text-lg">Or want to try before you buy?</div>
					<div className="px-8 py-3 bg-blue-brand rounded-md text-white cursor-pointer hover:bg-blue-400">Signup up for 15 days Free Trial</div>
				</div>
			</div>
		</div>
	)
}