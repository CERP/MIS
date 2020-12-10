import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { AppLayout } from 'components/layout'
import { getStudentsAttendance } from 'services'
import { PageHeading, PageSubHeading } from 'components/app/pageHeading'
import { getSectionsFromClasses } from 'utils/generic'
import { toTitleCase } from 'utils/string'
import { InfoCard } from 'components/app/infoCards'
import IconUserSvg from 'assets/userCircle.svg'

type S = {
	[id: string]: MISStudent
}

export const StudentAttendance = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	const [students, setStudents] = useState<S>({})
	const [year, setYear] = useState('2020')
	const [loading, setLoading] = useState(false)
	const [searchable, setSearchable] = useState('')

	const [schoolId, setSchoolId] = useState(Object.keys(schools)[0])
	const [sectionId, setSectionId] = useState('')

	const sections = useMemo(() => getSections(schools as School, schoolId), [schools, schoolId])
	const attendanceStats = useMemo(() => getAttendanceStats(students), [students])
	const aggAttendanceList = useMemo(() => getAggregatedAttendanceList(students), [students])
	const attendanceList = useMemo(() => getAttendanceList(students), [students])

	useEffect(() => {
		if (schoolId) {

			setLoading(true)
			setStudents({})
			getStudentsAttendance(schoolId)
				.then(
					data => {
						setLoading(false)
						setStudents(data)
					},
					error => {
						setLoading(false)
						console.log(error)
						alert("Unable to load attendance stats")
					}
				)
		}
	}, [schoolId])

	return (
		<AppLayout title="Student Attendance">
			<div className="container mx-auto md:ml-64 px-4 sm:px-8">
				<div className="py-8">
					<PageHeading title="Student Attendance" />
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row">

							<select className="select"
								onChange={(e) => setSchoolId(e.target.value)}
								defaultValue={schoolId} >
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
								title={"Total Presents"}
								body={attendanceStats.present} />

							<InfoCard
								loading={loading}
								title={"Total Absents"}
								body={attendanceStats.absent} />

							<InfoCard
								loading={loading}
								title={"Total Leaves"}
								body={attendanceStats.leave} />

							<InfoCard
								loading={loading}
								title={"Absentee Percentage"}
								body={`${getAbsenteePercentage(attendanceStats)}%`} />
						</div>
					</div>
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row">
							<select onChange={(e) => setYear(e.target.value)} className="select">
								<option>Select Year</option>
								<option>2020</option>
								<option>2019</option>
							</select>
						</div>
					</div>
					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="table-container">
							<table className="table">
								<thead className="thead">
									<tr>
										<th className="th"> Date </th>
										<th className="th"> Present </th>
										<th className="th"> Absent </th>
										<th className="th"> Leave</th>
										<th className="th"> Absentee %</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.entries(aggAttendanceList || {})
											.filter(([k, v]) => k.includes(year))
											.map(([k, v]) => (
												<tr className="tr" key={k}>
													<td className="td">{k}</td>
													<td className="td">{v.present}</td>
													<td className="td">{v.absent}</td>
													<td className="td">{v.leave}</td>
													<td className="td">{getAbsenteePercentage(v)}%</td>
												</tr>
											))
									}
								</tbody>
							</table>
						</div>
					</div>

					<div className="mb-5 mt-2">
						<PageSubHeading title={"Absentee List"} />
					</div>

					<div className="my-2 flex flex-row justify-between">
						<input
							name="search"
							onChange={(e) => setSearchable(e.target.value)}
							placeholder="Search here..."
							className="input w-full" />

						<div className="flex flex-row ml-2">
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
										<th className="th text-left"> Name </th>
										<th className="th text-left"> F.Name </th>
										<th className="th"> Phone </th>
										<th className="th"> Days Absent</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.entries(attendanceList || {})
											.filter(([k, v]) => {

												if (sectionId) {
													return sectionId === v.section_id
												}

												if (searchable) {
													return v.name.toLowerCase().includes(searchable)
												}

												return true
											})
											.sort(([, a], [, b]) => b.attendance.absent - a.attendance.absent)
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
													<td className="td">{v.phone}</td>
													<td className="td">{v.attendance.absent || 0}</td>
												</tr>
											))
									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div >
		</AppLayout >
	)
}

const getAttendanceStats = (students: S) => {

	let stats: Attendance = { absent: 0, present: 0, leave: 0 }

	for (const student of Object.values(students || {})) {

		for (const v of Object.values(student.attendance || {})) {

			stats = {
				absent: stats["absent"] + v["absent"],
				present: stats["present"] + v["present"],
				leave: stats["leave"] + v["leave"]
			}
		}
	}

	return stats
}

const getAggregatedAttendanceList = (students: S) => {

	let stats: MISStudent["attendance"] = {}

	for (const { attendance } of Object.values(students || {})) {
		for (const [k, v] of Object.entries(attendance || {})) {

			if (stats[k]) {

				stats = {
					...stats,
					[k]: {
						present: stats[k].present + v.present,
						absent: stats[k].absent + v.absent,
						leave: stats[k].leave + v.leave
					}
				}
			} else {
				stats = {
					...stats,
					[k]: v
				}
			}
		}
	}

	return stats
}

type AugmentedMISStudent = {
	[id: string]: ChangeTypeOfKeys<MISStudent, 'attendance', Attendance>
}

const getAttendanceList = (students: S) => {

	const attendance: Attendance = { absent: 0, present: 0, leave: 0 }

	return Object.entries(students || {})
		.reduce<AugmentedMISStudent>((agg, [sid, v]) => {

			const attendanceSum = Object.entries(v.attendance || {})
				.reduce<Attendance>((agg2, [k, v2]) => {
					return {
						present: agg2.present + v2.present,
						absent: agg2.absent + v2.absent,
						leave: agg2.leave + v2.leave
					}
				}, attendance)

			return {
				...agg,
				[sid]: {
					...v,
					attendance: attendanceSum
				}
			}

		}, {})
}

const getAbsenteePercentage = (attendance: Attendance) => {
	const percentage = attendance.absent / (attendance.present + attendance.leave) * 100
	return percentage.toFixed(2)
}

const getSections = (schools: School, schoolId: string) => {
	const classes = schools[schoolId]?.classes
	return getSectionsFromClasses(classes)
}