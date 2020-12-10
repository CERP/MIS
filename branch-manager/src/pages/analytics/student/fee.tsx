import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { AppLayout } from 'components/layout'
import { PageHeading, PageSubHeading } from 'components/app/pageHeading'
import { AppState } from 'reducers'
import { getSectionsFromClasses } from 'utils/generic'
import { toTitleCase } from 'utils/string'
import { InfoCard } from 'components/app/infoCards'

export const StudentFee = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	const [schoolId, setSchoolId] = useState(Object.keys(schools)[0])
	const [sectionId, setSectionId] = useState('')
	const [loading, setLoading] = useState(false)
	const [searchable, setSearchable] = useState('')

	const sections = useMemo(() => getSections(schools as School, schoolId), [schools, schoolId])

	return (
		<AppLayout title="Student Fees">
			<div className="container mx-auto md:ml-64 px-4 sm:px-8">
				<div className="py-8">
					<PageHeading title={"Student Fees"} />
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<select className="select"
								onChange={(e) => setSchoolId(e.target.value)}
								defaultValue={schoolId}
							>
								<option>Select School</option>
								{
									Object.keys(schools || {}).sort().map(id => <option key={id} value={id} >{id}</option>)
								}
							</select>
						</div>
					</div>

					<div className="mt-4 mb-4 mx-auto grid">
						<div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-4">
							<InfoCard
								loading={loading}
								title={"Total Amount"}
								body={0}
								logoType={"cash"} />

							<InfoCard
								loading={loading}
								title={"Paid Amount"}
								body={0}
								logoType={"cash"} />

							<InfoCard
								loading={loading}
								title={"Forgiven Amount"}
								body={0}
								logoType={"cash"} />

							<InfoCard
								loading={loading}
								title={"Pending"}
								body={0}
								logoType={"cash"} />
						</div>
					</div>

					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="table-container">
							<table className="table">
								<thead className="thead">
									<tr>
										<th className="th"> Date </th>
										<th className="th"> Total </th>
										<th className="th"> Paid </th>
										<th className="th"> Forgiven</th>
										<th className="th"> Pending</th>
									</tr>
								</thead>
								<tbody>
									{

									}
								</tbody>
							</table>
						</div>
					</div>
					<div className="mb-5 mt-2">
						<PageSubHeading title={"Outstanding Payment Students"} />
					</div>
					<div className="my-2 flex flex-row justify-end">
						<input
							name="search"
							onChange={(e) => setSearchable(e.target.value)}
							placeholder="Search here..."
							className="input w-full" />
						<div className="flex flex-row ml-2">
							<select
								className="select"
								onChange={(e) => setSectionId(e.target.value)} >
								<option>Select Section</option>
								{
									sections
										.sort((a, b) => a.namespaced_name.localeCompare(b.namespaced_name))
										.map(section => <option key={section.id} value={section.id} >{toTitleCase(section.namespaced_name)}</option>)
								}
							</select>
						</div>
					</div>
					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="table-container">
							<table className="table">
								<thead className="thead">
									<tr>
										<th className="th"> Name </th>
										<th className="th"> F. Name </th>
										<th className="th"> Phone </th>
										<th className="th"> Amount</th>
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