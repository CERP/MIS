import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'
import { user_service } from 'services'

type S = {
	[id: string]: MonthlyAttendance
}

type MonthlyAttendance = {
	[data: string]: Attendance
}

type Attendance = {
	present: number
	absent: number
	leave: number
}

const StudentAttendanceAnalytics = () => {

	const schools = useSelector((state: AppState) => state.auth.schools)
	const [attendance, setAttendance] = useState<S>()

	const attendance_stats = useMemo(() => process_attendance_stats(attendance), [attendance])

	const [school, setSchool] = useState('')
	const [year, setYear] = useState('')

	useEffect(() => {
		if (school) {
			user_service.fetch_students_attendance(school)
				.then(
					data => {
						setAttendance(data)
						const d = process_attendance_stats(data)
						console.log(d)
					},
					error => {
						alert("Unable to load attendance stats")
					}
				)
		}
	}, [school, year])

	return (
		<div className="container mx-auto px-4 sm:px-8">
			<div className="py-8">
				<div className="text-center">
					<h2 className="text-2xl font-semibold leading-tight">Student Attendance Analytics</h2>
				</div>
				<div className="my-2 flex flex-row justify-end">
					<div className="flex flex-row mb-1 sm:mb-0">
						<div className="relative">
							<select className="h-full rounded-l border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								onChange={(e) => setSchool(e.target.value)}>
								<option>School School</option>
								{
									schools?.sort().map(id => <option key={id} value={id} >{id}</option>)
								}
							</select>
							<div
								className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
								<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
									<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
								</svg>
							</div>
						</div>
						<div className="relative">
							<select
								className="h-full rounded-r border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
								<option>Select Year</option>
								<option>2020</option>
								<option>2019</option>
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
				<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
					<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
						<table className="w-full table-auto leading-normal">
							<thead className="bg-gray-200 border-b-2 border-gray-200 uppercase text-xs text-center font-semibold tracking-wider spac">
								<tr>
									<th className="px-5 py-3"> Date </th>
									<th className="px-5 py-3"> Present </th>
									<th className="px-5 py-3"> Absent </th>
									<th className="px-5 py-3"> Leave</th>
									<th className="px-5 py-3"> Absentee %</th>
								</tr>
							</thead>
							<tbody>
								{
									Object.entries(attendance_stats || {}).map(([k, v]) => (
										<tr className="text-center" key={k}>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">{k}</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">{v.present}</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">{v.absent}</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">{v.leave}</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">{get_absentee_percentage(v)}%</p>
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
	)
}

const process_attendance_stats = (student_attendace?: S) => {

	let stats: MonthlyAttendance = {}

	for (const monthly_attendance of Object.values(student_attendace || {})) {
		for (const [k, v] of Object.entries(monthly_attendance)) {

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

const get_absentee_percentage = (attendance: Attendance) => {
	const percentage = attendance.absent / (attendance.present + attendance.leave) * 100
	return percentage.toFixed(2)
}

export { StudentAttendanceAnalytics }