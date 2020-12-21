import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { AppLayout } from 'components/layout'
import { PageHeading } from 'components/app/pageHeading'
import { AppState } from 'reducers'

export const StudentExam = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	const [schoolId, setSchoolId] = useState(Object.keys(schools)[0])
	const [loading, setLoading] = useState(false)

	return (
		<AppLayout title="Student Exams">
			<div className="container mx-auto md:ml-64 px-4 sm:px-8">
				<div className="py-8">
					<PageHeading title={"Student Exams"} />

					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<select
								className="select"
								onChange={(e) => setSchoolId(e.target.value)}
								defaultValue={schoolId} >
								<option>Select School</option>
								{
									Object.keys(schools || {}).sort().map(id => <option key={id} value={id} >{id}</option>)
								}
							</select>
						</div>
					</div>
					<div className="text-red-500 mb-2 h-2">{loading ? 'Loading...' : ''}</div>
					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="table-container">
							<table className="table">
								<thead className="thead">
									<tr>
										<th className="th"> Name </th>
										<th className="th"> Marks </th>
										<th className="th"> Percentage </th>
										<th className="th"> Grade</th>
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