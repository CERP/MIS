import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { AppLayout } from 'components/layout'
import { PageHeading, PageSubHeading } from 'components/app/pageHeading'
import { AppState } from 'reducers'
import { getSectionsFromClasses } from 'utils/generic'
import { toTitleCase } from 'utils/string'

export const StudentFee = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	const [schoolId, setSchoolId] = useState(Object.keys(schools)[0])
	const [sectionId, setSectionId] = useState('')
	const [loading, setLoading] = useState(false)

	const sections = useMemo(() => getSections(schools as School, schoolId), [schools, schoolId])

	return (
		<AppLayout title="Student Fees">
			<div className="container mx-auto md:ml-64 px-4 sm:px-8">
				<div className="py-8">
					<PageHeading title={"Student Fees"} />
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<div className="relative">
								<select className="h-full rounded border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									onChange={(e) => setSchoolId(e.target.value)}
									defaultValue={schoolId}
								>
									<option>Select School</option>
									{
										Object.keys(schools || {}).sort().map(id => <option key={id} value={id} >{id}</option>)
									}
								</select>
								<div
									className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
									<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
										<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
									</svg>
								</div>
							</div>
						</div>
					</div>
					<div className="text-red-500 mb-2 h-2">{loading ? 'Loading...' : ''}</div>
					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
							<table className="w-full table-auto leading-normal">
								<thead className="bg-gray-200 border-b-2 border-gray-200 uppercase text-xs text-center font-semibold tracking-wider spac">
									<tr>
										<th className="px-5 py-3"> Date </th>
										<th className="px-5 py-3"> Total </th>
										<th className="px-5 py-3"> Paid </th>
										<th className="px-5 py-3"> Forgive</th>
										<th className="px-5 py-3"> Pending</th>
									</tr>
								</thead>
								<tbody>
									{

									}
								</tbody>
							</table>
						</div>
					</div>
					<div className="mt-4">
						<PageSubHeading title={"Outstanding Payment Students"} />
					</div>
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<div className="relative">
								<select
									className="h-full rounded border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									onChange={(e) => setSectionId(e.target.value)}
								>
									<option>Select Section</option>
									{
										sections
											.sort((a, b) => a.namespaced_name.localeCompare(b.namespaced_name))
											.map(section => <option key={section.id} value={section.id} >{toTitleCase(section.namespaced_name)}</option>)
									}
								</select>
								<div
									className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
									<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
										<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
									</svg>
								</div>
							</div>
						</div>
					</div>
					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
							<table className="w-full table-auto leading-normal">
								<thead className="bg-gray-200 border-b-2 border-gray-200 text-gray-700 uppercase text-xs text-center font-semibold tracking-wider spac">
									<tr>
										<th className="px-5 py-3"> Name </th>
										<th className="px-5 py-3"> F. Name </th>
										<th className="px-5 py-3"> Phone </th>
										<th className="px-5 py-3"> Amount</th>
									</tr>
								</thead>
								<tbody>
									{

									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}

const getSections = (schools: School, schoolId: string) => {
	const classes = schools[schoolId]?.classes
	return getSectionsFromClasses(classes)
}