import clsx from 'clsx'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts'

enum Tab {
	TEACHER,
	STUDENT
}

export const StatsTab = () => {

	const todayDate = moment().format("YYYY-MM-DD")
	const { lastSnapshot, db, queued } = useSelector((state: RootReducerState) => state)
	const { students, faculty } = db
	const unsyncedChanges = Object.keys(queued.mutations || {}).length

	const [activeTab, setActiveTab] = useState(Tab.STUDENT)

	const [studentsAttendance, teacherAttendance] = useMemo(() => {

		const teachersAttendance = { PRESENT: 0, LEAVE: 0, ABSENT: 0 }
		const studentsAttendance = { PRESENT: 0, LEAVE: 0, ABSENT: 0 }

		for (const student of Object.values(students)) {

			if (student && student.Name) {
				const record = (student.attendance || {})[todayDate]
				if (record) {
					if (record.status === "CASUAL_LEAVE" || record.status === "SHORT_LEAVE" || record.status === "SICK_LEAVE" || record.status === "LEAVE") {
						studentsAttendance["LEAVE"] += 1
					} else {
						studentsAttendance[record.status] += 1
					}
				}
			}
		}

		for (const teacher of Object.values(faculty)) {
			const record = (teacher.attendance || {})[todayDate]

			if (record === undefined) {
				continue
			}

			if (record.check_in) {
				teachersAttendance.PRESENT += 1
			}
			else if (record.absent) {
				teachersAttendance.ABSENT += 1
			}
			else if (record.leave) {
				teachersAttendance.LEAVE += 1
			}
		}

		return [studentsAttendance, teachersAttendance]

	}, [students, faculty])

	const [amountCollected, studentsWhoPaid] = useMemo(() => {

		let totalAmount = 0
		let totalPayee = 0

		for (const student of Object.values(students)) {

			if (student && student.Name) {
				const additional_payment = Object.values(student.payments || {})
					.filter(x => moment(x.date).format("YYYY-MM-DD") === todayDate && x.type === "SUBMITTED")
					.reduce((agg, curr) => agg + curr.amount, 0);

				if (additional_payment > 0) {
					totalPayee += 1
				}

				totalAmount += additional_payment
			}
		}

		return [totalAmount, totalPayee]

	}, [students])

	const attendanceStats = activeTab === Tab.STUDENT ? studentsAttendance : teacherAttendance

	const graphData = Object.entries(attendanceStats)
		.reduce<TGraphData[]>((agg, [k, v]) => {
			return [
				...agg,
				{
					name: k.toLowerCase(),
					value: v
				}
			]
		}, [])

	return (
		<div className="p-10 md:w-2/5 mx-auto">

			<div className="text-center text-2xl mb-6">School Daily Statistics</div>

			<div className="p-6 bg-white rounded-2xl border shadow-md">
				<div className="text-center text-lg font-bold">Attendance</div>
				<div className="flex flex-row justify-between items-center">
					<div
						onClick={() => setActiveTab(Tab.STUDENT)}
						className={clsx("cursor-pointer hover:underline hover:text-blue-brand", { "underline": activeTab === Tab.STUDENT })}>Students</div>
					<div
						onClick={() => setActiveTab(Tab.TEACHER)}
						className={clsx("cursor-pointer hover:underline hover:text-blue-brand", { "underline": activeTab === Tab.TEACHER })}>Teachers</div>
				</div>

				<div className="w-full h-80">
					<AttendanceChart graphData={graphData} />
				</div>
				<div className="flex flex-row justify-between">
					<div className="flex flex-col items-center text-teal-500">
						<div className="text-xl font-bold">{attendanceStats.PRESENT}</div>
						<div className="">Present</div>
					</div>
					<div className="flex flex-col items-center text-red-brand">
						<div className="text-xl font-bold">{attendanceStats.ABSENT}</div>
						<div className="">Absent</div>
					</div>
					<div className="flex flex-col items-center text-orange-brand">
						<div className="text-xl font-bold">{attendanceStats.LEAVE}</div>
						<div className="">Leave</div>
					</div>
				</div>

				<div className="w-4/5 mx-auto mt-4">
					<button className="w-full tw-btn-blue rounded-full uppercase text-sm">See Details</button>
				</div>
			</div>

			<div className="py-6 px-10 bg-white rounded-2xl border shadow-md mt-4">
				<div className="text-center text-lg font-bold mb-4">Statistics</div>
				<div className="flex flex-col space-y-4">

					<div className="flex flex-row items-center">
						<div className="mr-10 text-teal-500">
							<svg className="w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						</div>
						<div className="flex flex-col">
							<div className="text-teal-500 font-semibold">Rs. {amountCollected}</div>
							<div className="text-sm text-gray-500">Fee Collected</div>
						</div>
					</div>

					<div className="flex flex-row items-center">
						<div className="mr-10 text-blue-brand">
							<svg className="w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						</div>
						<div className="flex flex-col">
							<div className="text-blue-brand font-semibold">{studentsWhoPaid}</div>
							<div className="text-sm text-gray-500">Students</div>
						</div>
					</div>

					<div className="flex flex-row items-center">
						<div className="mr-10 text-orange-brand">
							<svg className="w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
						</div>
						<div className="flex flex-col">
							<div className="text-orange-brand font-semibold">{moment(lastSnapshot).format("HH:mm")}</div>
							<div className="text-sm text-gray-500">{moment(lastSnapshot).format("D-M-YYYY")}</div>
						</div>
					</div>

					<div className="flex flex-row items-center">
						<div className="mr-10 text-teal-500">
							<svg className="w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						</div>
						<div className="flex flex-col">
							<div className="text-teal-500 font-semibold">{unsyncedChanges} unsynced</div>
							<div className="text-sm text-gray-500">changes</div>
						</div>
					</div>

				</div>
			</div>

		</div>
	)
}

const colorMap = {
	'present': '#5ECDB9',
	'absent': '#FC6171',
	'leave': '#FFC107'
}

const renderActiveShape = (props: any) => {

	const RADIAN = Math.PI / 180

	const {
		cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
		fill, payload, percent, value,
	} = props

	const sin = Math.sin(-RADIAN * midAngle)
	const cos = Math.cos(-RADIAN * midAngle)
	const sx = cx + (outerRadius + 10) * cos
	const sy = cy + (outerRadius + 10) * sin
	const mx = cx + (outerRadius + 30) * cos
	const my = cy + (outerRadius + 30) * sin
	const ex = mx + (cos >= 0 ? 1 : -1) * 22
	const ey = my
	const textAnchor = cos >= 0 ? 'start' : 'end'

	return (
		<g>
			<text x={cx} y={cy} dy={8} textAnchor="middle"
				// @ts-ignore
				fill={colorMap[payload.name]} className="capitalize">{payload.name}</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				// @ts-ignore
				fill={colorMap[payload.name]}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				// @ts-ignore
				fill={colorMap[payload.name]}
			/>
			<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{value}</text>
			<text className="text-xs" x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
				{`(${(percent * 100).toFixed(2)}%)`}
			</text>
		</g>
	)
}

type TGraphData = {
	name: string
	value: number
}


type TAttendanceChartProps = {
	graphData: TGraphData[]
}

const AttendanceChart: React.FC<TAttendanceChartProps> = ({ graphData }) => {

	const [activeIndex, setActiveIndex] = useState(0)

	const onPieEnter = (data: any, index: number) => {
		setActiveIndex(index)
	}

	return (
		<div style={{ width: '100%', height: 300 }}>
			<ResponsiveContainer>
				<PieChart>
					<Pie
						activeIndex={activeIndex}
						activeShape={renderActiveShape}
						data={graphData}
						cx={200}
						cy={200}
						innerRadius={60}
						outerRadius={80}
						fill="#74ACED"
						dataKey="value"
						onMouseEnter={onPieEnter}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}
