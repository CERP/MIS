import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { AppLayout } from 'components/layout'
import { getTeachersAttendance } from 'services'
import { PageHeading } from 'components/app/pageHeading'
import { Spinner } from 'components/animation'

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
									className="h-full rounded border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									onChange={handle_change}
									defaultValue={filter.school}
								>

									<option>School School</option>
									{
										Object.keys(schools)?.sort().map(id => <option key={id} value={id} >{id}</option>)
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
					<div className="my-4 mx-auto grid">
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
							<div className="relative">
								<select onChange={handle_change} name="period"
									className="h-full rounded-l border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
									<option value="">Select Period</option>
									<option value="daily">Daily</option>
									<option value="monthly">Monthly</option>
								</select>
								<div
									className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
									<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
										<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
									</svg>
								</div>
							</div>
							<div className="relative">
								<select onChange={handle_change}
									name="year"
									className="h-full rounded-r border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
									<option>Select Year</option>
									<option value="2020">2020</option>
									<option value="2019">2019</option>
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
								<thead className="bg-gray-200 border-b-2 text-gray-700 border-gray-200 uppercase text-xs text-center font-semibold tracking-wider spac">
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
										Object.entries(attendance_stats || {})
											.filter(([k, v]) => k.includes(filter.year))
											.map(([k, v]) => (
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
														<p className="text-gray-900 whitespace-no-wrap">{getAbsenteePercentage(v)}%</p>
													</td>
												</tr>
											))
									}
								</tbody>
							</table>
						</div>
					</div>

					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
							<table className="w-full table-auto leading-normal">
								<thead className="bg-gray-200 border-b-2 border-gray-200 text-gray-700 uppercase text-xs text-center font-semibold tracking-wider spac">
									<tr>
										<th className="px-5 py-3"> Name </th>
										<th className="px-5 py-3"> Phone </th>
										<th className="px-5 py-3"> Days Absent</th>
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
			<div className={`p-3 mr-4 rounded-full ${title.includes('Absent') ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'}`}>
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