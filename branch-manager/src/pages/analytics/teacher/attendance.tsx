import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { AppLayout } from 'components/layout'
import { getTeachersAttendance } from 'services'
import { PageHeading } from 'components/app/pageHeading'
import { InfoCard } from 'components/app/infoCards'

interface S {
	faculty: {
		[tid: string]: {
			name: string
			phone: string
			attendance: SingleTeacherAttendance
		}
	}
	filter: {
		year: string
		period: string
		school: string
	}
}

interface SingleTeacherAttendance {
	[date: string]: "present" | "absent" | "leave"
}

interface TeacherAttendance {
	[date: string]: Attendance
}

interface Attendance {
	present: number
	absent: number
	leave: number
}

export const TeacherAttendance = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	const [attendance, setAttendance] = useState<S["faculty"]>({})
	const [loading, setLoading] = useState(false)

	const [filter, setFilter] = useState<S["filter"]>({
		year: '',
		period: 'monthly',
		school: Object.keys(schools)[0],
	})

	const { school } = filter

	useEffect(() => {
		if (school) {

			setLoading(true)

			getTeachersAttendance(school)
				.then(
					data => {
						console.log(data)
						setAttendance(data)
						setLoading(false)
					},
					error => {
						setLoading(false)

						console.log(error)
						alert("Unable to load attendance stats")
					}
				)
		}
	}, [school])

	const attendance_stats = useMemo(() => processAttendanceStats(attendance, filter), [attendance, filter])

	const handle_change = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
		const { name, value } = e.target
		setFilter({ ...filter, [name]: value })
	}

	return (
		<AppLayout title="Teacher Attendance">

			<div className="container mx-auto md:ml-64 px-4 sm:px-8">
				<div className="py-8">
					<PageHeading title={"Teacher Attendance"} />
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<div className="relative">
								<select
									name="school"
									className="select"
									onChange={handle_change}
									defaultValue={filter.school} >

									<option>School School</option>
									{
										Object.keys(schools)?.sort().map(id => <option key={id} value={id} >{id}</option>)
									}
								</select>
							</div>
						</div>
					</div>
					<div className="my-4 mx-auto grid">
						<div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-4">
							<InfoCard
								loading={loading}
								title={"Total Presents"}
								body={0} />

							<InfoCard
								loading={loading}
								title={"Total Absents"}
								body={0} />

							<InfoCard
								loading={loading}
								title={"Total Leaves"}
								body={0} />

							<InfoCard
								loading={loading}
								title={"Absentee Percentage"}
								body={0} />
						</div>
					</div>
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<div className="relative">
								<select onChange={handle_change} name="period"
									className="select rounded-l">
									<option value="">Select Period</option>
									<option value="daily">Daily</option>
									<option value="monthly">Monthly</option>
								</select>
							</div>
							<div className="relative">
								<select onChange={handle_change}
									name="year"
									className="select rounded-r">
									<option>Select Year</option>
									<option value="2020">2020</option>
									<option value="2019">2019</option>
								</select>
							</div>
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
										Object.entries(attendance_stats || {})
											.filter(([k, v]) => k.includes(filter.year))
											.map(([k, v]) => (
												<tr className="text-center" key={k}>
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

					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="table-container">
							<table className="table">
								<thead className="thead">
									<tr>
										<th className="th"> Name </th>
										<th className="th"> Phone </th>
										<th className="th"> Days Absent</th>
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

const processAttendanceStats = (teacher_attendace: S["faculty"], filter: S["filter"]) => {

	const stats: TeacherAttendance = {}

	const dateFormat = filter.period === 'monthly' ? 'MM/YYYY' : 'DD/MM/YYYY'

	for (const [, { attendance }] of Object.entries(teacher_attendace || {})) {

		for (const [k, v] of Object.entries(attendance || {})) {

			const periodKey = moment(k).format(dateFormat)

			const attendanceKey = stats[periodKey] || { present: 0, leave: 0, absent: 0 }

			attendanceKey[v] += 1;
			stats[periodKey] = attendanceKey
		}
	}

	return stats
}

const getAbsenteePercentage = (attendance: Attendance) => {
	const percentage = attendance.absent / (attendance.present + attendance.leave) * 100
	return percentage.toFixed(2)
}