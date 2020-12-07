import React, { useEffect, useMemo, useState } from 'react'

import { AppLayout } from 'components/layout'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { getSchoolEnrollment } from 'services'
import { getSectionsFromClasses } from 'utils/generic'
import { toTitleCase } from 'utils/string'
import { PageHeading } from 'components/app/pageHeading'
import { InfoCard } from 'components/app/infoCards'

interface MISStudent {
	[id: string]: Student
}

interface Student {
	name: string
	fname: string
	dob: string
	start_date: string
	gender: string
	active: boolean
	section_id: string
	phone: string
}

export const SchoolEnrollment = () => {


	const schools = useSelector((state: AppState) => state.user.schools)

	const [students, setStudents] = useState<MISStudent>({})

	const [schoolId, setSchoolId] = useState(Object.keys(schools)[0])
	const [sectionId, setSectionId] = useState('')
	const [loading, setLoading] = useState(false)

	const enrollmentStats = useMemo(() => processEnrollmentStatsData(students), [students])
	const sections = useMemo(() => getSections(schools as School, schoolId), [schools, schoolId])

	useEffect(() => {
		if (schoolId) {

			setStudents({})
			setLoading(true)

			getSchoolEnrollment(schoolId)
				.then(
					data => {
						setStudents(data)
						setLoading(false)
						console.log(data)
					},
					error => {
						setLoading(false)
						console.log(error)
						alert("Unable to load school enrollment")
					}
				)
		}
	}, [schoolId])


	return (
		<AppLayout title="School Enrollement">
			<div className="container mx-auto md:ml-64 px-4 sm:px-8">
				<div className="py-8">
					<PageHeading title={"School Enrollment"} />
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<div className="relative">
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
					</div>
					<div className="my-2 font-bold text-gray-700 uppercase text-sm">Total Students: {Object.keys(students).length}</div>
					<div className="mt-6 mb-4 mx-auto grid">
						<div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-3">
							<InfoCard
								loading={loading}
								title={"Active Students"}
								body={enrollmentStats.active}
							/>

							<InfoCard
								loading={loading}
								title={"Inactive Students"}
								body={enrollmentStats.inactive}
							/>

							<InfoCard
								loading={loading}
								title={"Male/Female Students"}
								body={`${enrollmentStats.male}/${enrollmentStats.female}`}
							/>
						</div>
					</div>
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<div className="relative">
								<select
									className="select"
									onChange={(e) => setSectionId(e.target.value)}
								>
									<option>Select Section</option>
									{
										sections
											.sort((a, b) => a.namespaced_name.localeCompare(b.namespaced_name))
											.map(section => <option key={section.id} value={section.id} >{toTitleCase(section.namespaced_name)}</option>)
									}
								</select>
							</div>
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
										<th className="th"> Gender</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.entries(students || {})
											.filter(([k, v]) => sectionId ? v.section_id === sectionId : true)
											.map(([k, v]) => (
												<tr className="tr" key={k}>
													<td className="td text-left">
														<p>{v.name}</p>
													</td>
													<td className="td text-left">
														<p>{v.fname}</p>
													</td>
													<td className="td">
														<p>{v.phone}</p>
													</td>
													<td className="td">
														<p>{v.gender === 'female' ? 'F' : 'M'}</p>
													</td>
												</tr>
											))
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

const processEnrollmentStatsData = (students: MISStudent) => {

	let active = 0
	let inactive = 0
	let male = 0
	let female = 0

	for (const student of Object.values(students || {})) {
		student.active ? active++ : inactive++
		student.gender === 'male' ? male++ : female++
	}

	return {
		active,
		inactive,
		male,
		female
	}
}

const getSections = (schools: School, schoolId: string) => {
	const classes = schools[schoolId]?.classes
	return getSectionsFromClasses(classes)
}