import React, { useEffect, useMemo, useState } from 'react'

import { AppLayout } from 'components/layout'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { getSchoolEnrollment } from 'services'
import { Spinner } from 'components/animation'
import { getSectionsFromClasses } from 'utils/generic'
import { toTitleCase } from 'utils/string'
import { PageHeading } from 'components/app/pageHeading'

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
										<th className="px-5 py-3"> Gender</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.entries(students || {})
											.filter(([k, v]) => sectionId ? v.section_id === sectionId : true)
											.map(([k, v]) => (
												<tr className="text-center" key={k}>
													<td className="px-5 text-left py-5 border-b border-gray-200 bg-white text-sm">
														<p className="text-gray-900 whitespace-no-wrap">{v.name}</p>
													</td>
													<td className="px-5 text-left py-5 border-b border-gray-200 bg-white text-sm">
														<p className="text-gray-900 whitespace-no-wrap">{v.fname}</p>
													</td>
													<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
														<p className="text-gray-900 whitespace-no-wrap">{v.phone}</p>
													</td>
													<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
														<p className="text-gray-900 whitespace-no-wrap">{v.gender === 'female' ? 'F' : 'M'}</p>
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

interface CardItem {
	title: string
	body: string | number
}

interface InfoCardProps extends CardItem {
	loading: boolean
}

const InfoCard = (props: InfoCardProps) => {

	const { title, body, loading } = props

	return (
		<div className="flex items-center p-4 border rounded-lg shadow-xs">
			<div className={`p-3 mr-4 rounded-full ${title.includes('Inactive') ? 'text-gray-500 bg-gray-100' : 'text-green-500 bg-green-100'}`}>
				<svg className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20">
					<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
				</svg>
			</div>
			{ loading ?
				<div className="mx-auto pr-12 h-14 pt-4">
					<Spinner className="w-6 h-6 mx-auto" />
				</div>
				:
				<div>
					<p className="mb-2 text-sm font-medium text-gray-600 ">{title}</p>
					<p className="text-lg font-semibold text-gray-700">{body}</p>
				</div>
			}
		</div>
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