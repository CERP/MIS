import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'


import { AppLayout } from 'components/layout'
import { getStudentsAttendance } from 'services'
import { PageHeading } from 'components/app/pageHeading'
import { getSectionsFromClasses } from 'utils/generic'
import { toTitleCase } from 'utils/string'
import { InfoCard } from 'components/app/infoCards'

type S = {
	[id: string]: MISStudent
}

interface MISStudent {
	name: string
	fname: string
	phone: string
	section_id: string
	attendance: MonthlyAttendance
}

type MonthlyAttendance = {
	[date: string]: Attendance
}

type Attendance = {
	present: number
	absent: number
	leave: number
}

export const StudentAttendance = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	const [students, setStudents] = useState<S>({})
	const [year, setYear] = useState('2020')
	const [loading, setLoading] = useState(false)

	const [schoolId, setSchoolId] = useState(Object.keys(schools)[0])
	const [sectionId, setSectionId] = useState('')

	const sections = useMemo(() => getSections(schools as School, schoolId), [schools, schoolId])

	const attendanceStats = useMemo(() => processAttendanceStats(students), [students])

	useEffect(() => {
		if (schoolId) {

			setLoading(true)
			setStudents({})
			getStudentsAttendance(schoolId)
				.then(
					data => {
						setLoading(false)
						setStudents(data)
						console.log(data)
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
						<div className="flex flex-row mb-1 sm:mb-0">

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
								body={0}
							/>

							<InfoCard
								loading={loading}
								title={"Total Absents"}
								body={0}
							/>

							<InfoCard
								loading={loading}
								title={"Total Leaves"}
								body={0}
							/>

							<InfoCard
								loading={loading}
								title={"Absentee Percentage"}
								body={0}
							/>

						</div>
					</div>
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">

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
										Object.entries(attendanceStats || {})
											.filter(([k, v]) => k.includes(year))
											.map(([k, v]) => (
												<tr className="tr" key={k}>
													<td className="td">
														<p>{k}</p>
													</td>
													<td className="td">
														<p>{v.present}</p>
													</td>
													<td className="td">
														<p>{v.absent}</p>
													</td>
													<td className="td">
														<p>{v.leave}</p>
													</td>
													<td className="td">
														<p>{getAbsenteePercentage(v)}%</p>
													</td>
												</tr>
											))
									}
								</tbody>
							</table>
						</div>
					</div>
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">

							<select className="select" onChange={(e) => setSectionId(e.target.value)} >
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
										<th className="th text-left"> Name </th>
										<th className="th"> Phone </th>
										<th className="th"> Days Absent</th>
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
													<td className="td">
														<p>{v.phone}</p>
													</td>
													<td className="td">
														<p>{processSigleStudentAttendance(v)?.absent || 0}</p>
													</td>
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

const processAttendanceStats = (students: S) => {

	let stats: MonthlyAttendance = {}

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

const processSigleStudentAttendance = (student: MISStudent) => {

	const attendance: Attendance = { absent: 0, present: 0, leave: 0 }

	return Object.entries(student.attendance || {})
		.reduce<Attendance>((agg, [k, v]) => {
			return {
				absent: agg["absent"] + v["absent"],
				present: agg["present"] + v["present"],
				leave: agg["leave"] + v["leave"]
			}
		}, attendance)
}

const getAbsenteePercentage = (attendance: Attendance) => {
	const percentage = attendance.absent / (attendance.present + attendance.leave) * 100
	return percentage.toFixed(2)
}

const getSections = (schools: School, schoolId: string) => {
	const classes = schools[schoolId]?.classes
	return getSectionsFromClasses(classes)
}