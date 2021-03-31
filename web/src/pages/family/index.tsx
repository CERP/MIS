import React from 'react'
import { Link } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { SearchInput } from 'components/input/search'

export const Family = () => {
	return (
		<AppLayout title="Families">
			<div className="p-5 md:p-10 relative mb-20">
				{/* Can be extracted to a resuable component */}
				<Link to="staff/new">
					<div className="flex items-center justify-between fixed z-50 bottom-4 right-4 rounded-full bg-teal-brand text-white lg:hidden py-3 px-6 w-11/12 text-lg mr-0.5">
						<div>Create new Family</div>
						<div className="text-xl">+</div>
					</div>
				</Link>

				<div className="text-center font-bold text-2xl my-4">Families</div>
				<div className="flex flex-row mt-4 mb-12 md:mb-20 space-x-4 md:space-y-0 md:space-x-60">
					<SearchInput placeholder="Search by Family Id" />
				</div>
			</div>
		</AppLayout>
	)
}
