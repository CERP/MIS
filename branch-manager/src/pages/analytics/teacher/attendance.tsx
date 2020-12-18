import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { AppLayout } from 'components/layout'
import { getTeachersAttendance } from 'services'
import { InfoCard } from 'components/app/infoCards'
import IconUserSvg from 'assets/userCircle.svg'
import { PageHeading, PageSubHeading } from 'components/app/pageHeading'


interface S {
	faculty: MISFaculty
	filter: {
		year: string
		period: string
		school: string
	}
}

export const TeacherAttendance = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	const [attendance, setAttendance] = useState<S["faculty"]>({})
	const [loading, setLoading] = useState(false)
	const [searchable, setSearchable] = useState('')

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

	const attendanceStats = useMemo(() => getAttendanceStats(attendance), [attendance])
	const aggAttendanceList = useMemo(() => getAggregatedAttendanceList(attendance, filter), [attendance, filter])
	const attendanceList = useMemo(() => getAttendanceList(attendance), [attendance])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
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
									onChange={handleChange}
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
						<div className="flex flex-row mb-1 sm:mb-0">
							<select onChange={handleChange} name="period"
								className="select">
								<option value="">Select Period</option>
								<option value="daily">Daily</option>
								<option value="monthly">Monthly</option>
							</select>
							<select onChange={handleChange}
								name="year"
								className="select ml-2">
								<option>Select Year</option>
								<option value="2020">2020</option>
								<option value="2019">2019</option>
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
											.filter(([k, v]) => k.includes(filter.year))
											.map(([k, v]) => (
												<tr className="text-center" key={k}>
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
					<div className="mb-4 mt-2">
						<PageSubHeading title={"Absentee List"} />
					</div>
					<div className="my-2 flex flex-row justify-between">
						<input
							name="search"
							onChange={(e) => setSearchable(e.target.value)}
							placeholder="Search here..."
							className="input w-full" />
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
										Object.entries(attendanceList)
											.filter(([k, v]) => {

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
													<td className="td">{v.phone}</td>
													<td className="td">{v.attendance.absent}</td>
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

const getAttendanceStats = (teachers_attendance: S["faculty"]) => {

	let stats: Attendance = { absent: 0, present: 0, leave: 0 }

	for (const teacher of Object.values(teachers_attendance || {})) {

		for (const status of Object.values(teacher.attendance || {})) {
			stats[status] = stats[status] + 1;
		}
	}

	return stats
}

const getAggregatedAttendanceList = (teachers_attendace: S["faculty"], filter: S["filter"]) => {

	const stats = {} as { [date: string]: Attendance }

	const dateFormat = filter.period === 'monthly' ? 'MM/YYYY' : 'DD/MM/YYYY'

	for (const [, { attendance }] of Object.entries(teachers_attendace || {})) {

		for (const [k, v] of Object.entries(attendance || {})) {

			const periodKey = moment(k).format(dateFormat)

			const attendanceKey = stats[periodKey] || { present: 0, leave: 0, absent: 0 }

			attendanceKey[v] += 1;
			stats[periodKey] = attendanceKey
		}
	}

	return stats
}

type AugmentedMISFaculty = {
	[id: string]: ChangeTypeOfKeys<MISTeacher, 'attendance', Attendance>
}

const getAttendanceList = (teachers_attendance: MISFaculty) => {

	const attendance: Attendance = { absent: 0, present: 0, leave: 0 }

	return Object.entries(teachers_attendance || {})
		.reduce<AugmentedMISFaculty>((agg, [tid, v]) => {

			const sum = Object.entries(v.attendance || {})
				.reduce<Attendance>((agg2, [k, v2]) => {
					return {
						...agg2,
						[v2]: agg2[v2] + 1,
					}
				}, attendance)

			return {
				...agg,
				[tid]: {
					...v,
					attendance: sum
				}
			}
		}, {})
}

const getAbsenteePercentage = (attendance: Attendance) => {
	const percentage = attendance.absent / (attendance.present + attendance.leave) * 100
	return percentage.toFixed(2)
}