import React, { useEffect, useMemo, useState } from 'react'

import { AppLayout } from 'components/layout'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { getSchoolEnrollment } from 'services'
import { getSectionsFromClasses } from 'utils/generic'
import { toTitleCase } from 'utils/string'
import { PageHeading, PageSubHeading } from 'components/app/pageHeading'
import { InfoCard } from 'components/app/infoCards'
import IconUserSvg from 'assets/userCircle.svg'

interface MISStudent {
	[id: string]: Student
}

interface Student {
	name: string
	fname: string
	dob: string
	start_date: string
	avatar_url?: string
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
	const [searchable, setSearchable] = useState('')

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
					<div className="mt-4 mb-4 mx-auto grid">
						<div className="grid gap-6 grid-cols-1 md:grid-cols-4">

							<InfoCard
								loading={loading}
								title={"Total Students"}
								body={enrollmentStats.active + enrollmentStats.inactive}
							/>

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
								title={"M/F Students"}
								body={`${enrollmentStats.male}/${enrollmentStats.female}`}
							/>
						</div>
					</div>

					<div className="mt-2 mb-5">
						<PageSubHeading title={"Student List"} />
					</div>

					<div className="my-2 flex flex-row j	ustify-between">
						<input
							name="search"
							onChange={(e) => setSearchable(e.target.value)}
							placeholder="Search here..."
							className="input w-full mr-2" />

						<div className="flex flex-row">
							<select className="select" onChange={(e) => setSectionId(e.target.value)} >
								<option>Select Section</option>
								{
									sections
										.sort((a, b) => a.namespaced_name.localeCompare(b.namespaced_name))
										.map(section => <option key={section.id} value={section.id} >
											{toTitleCase(section.namespaced_name)}
										</option>)
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
										<th className="th"> Gender</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.entries(students || {})
											.filter(([k, v]) => {

												if (sectionId) {
													return sectionId === v.section_id
												}

												if (searchable) {
													return v.name.toLowerCase().includes(searchable)
												}

												return true
											})
											.sort(([, a], [, b]) => a.name.localeCompare(b.name))
											.map(([k, v]) => (
												<tr className="tr" key={k}>
													<td className="td text-left">
														<div className="flex items-center">
															<div className="flex-shrink-0">
																<img className="w-8 h-8 mr-4 rounded-full" src={v?.avatar_url || IconUserSvg} alt={v.name} />
															</div>
															<div className="ml-3">
																<p> {v.name} </p>
															</div>
														</div>
													</td>
													<td className="td text-left">{v.fname}</td>
													<td className="td"> {v.phone}</td>
													<td className="td">{v.gender === 'female' ? 'F' : 'M'}</td>
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