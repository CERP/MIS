import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import { useSelector } from 'react-redux'
import {
	CashIcon,
	CloudUploadIcon,
	RefreshIcon,
	UsersIcon,
	ExclamationIcon
} from '@heroicons/react/outline'
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts'

import { isMobile } from 'utils/helpers'

enum Tab {
	TEACHER,
	STUDENT
}

export const StatsTab = () => {
	const todayDate = moment().format('YYYY-MM-DD')
	const { lastSnapshot, db, queued } = useSelector((state: RootReducerState) => state)
	const { students, faculty } = db
	const unsyncedChanges = Object.keys(queued.mutations || {}).length

	const [activeTab, setActiveTab] = useState(Tab.STUDENT)

	const [studentsAttendance, staffAttedance] = useMemo(() => {
		const staffAttendance = { PRESENT: 0, LEAVE: 0, ABSENT: 0 }
		const studentsAttendance = { PRESENT: 0, LEAVE: 0, ABSENT: 0 }

		for (const student of Object.values(students)) {
			if (student && student.Name) {
				const record = (student.attendance || {})[todayDate]
				if (record) {
					if (
						record.status === 'CASUAL_LEAVE' ||
						record.status === 'SHORT_LEAVE' ||
						record.status === 'SICK_LEAVE' ||
						record.status === 'LEAVE'
					) {
						studentsAttendance['LEAVE'] += 1
					} else {
						studentsAttendance[record.status] += 1
					}
				}
			}
		}

		for (const staff of Object.values(faculty)) {
			const record = (staff.attendance || {})[todayDate]

			console.log(record)

			if (record === undefined) {
				continue
			}

			if (record.check_in) {
				staffAttendance.PRESENT += 1
			} else if (record.absent) {
				staffAttendance.ABSENT += 1
			} else if (
				record.leave ||
				record.CASUAL_LEAVE ||
				record.PRIVILEGED_LEAVE ||
				record.SHORT_LEAVE ||
				record.SICK_LEAVE
			) {
				staffAttendance.LEAVE += 1
			}
		}

		return [studentsAttendance, staffAttendance]
	}, [students, faculty])

	const [amountCollected, studentsWhoPaid] = useMemo(() => {
		let totalAmount = 0
		let totalPayee = 0

		for (const student of Object.values(students)) {
			if (student && student.Name) {
				const additional_payment = Object.values(student.payments || {})
					.filter(
						x =>
							moment(x.date).format('YYYY-MM-DD') === todayDate &&
							x.type === 'SUBMITTED'
					)
					.reduce((agg, curr) => agg + curr.amount, 0)

				if (additional_payment > 0) {
					totalPayee += 1
				}

				totalAmount += additional_payment
			}
		}

		return [totalAmount, totalPayee]
	}, [students])

	const attendanceStats = activeTab === Tab.STUDENT ? studentsAttendance : staffAttedance

	const graphData = Object.entries(attendanceStats).reduce<GraphData[]>((agg, [k, v]) => {
		return [
			...agg,
			{
				name: k.toLowerCase(),
				value: v
			}
		]
	}, [])

	const attendanceMarkCount =
		attendanceStats.PRESENT + attendanceStats.ABSENT + attendanceStats.LEAVE

	return (
		<div className="p-5 mx-auto md:p-10 md:w-2/5">
			<div className="mb-6 text-2xl text-center md:hidden">School Daily Statistics</div>

			<div className="p-6 bg-white border shadow-md rounded-2xl">
				<div className="text-lg font-bold text-center">Attendance</div>
				<div className="flex flex-row items-center justify-between">
					<div
						onClick={() => setActiveTab(Tab.STUDENT)}
						className={clsx(
							'cursor-pointer hover:bg-teal-brand hover:text-white px-2 py-px rounded-3xl bg-gray-100 shadow-md',
							{
								'bg-teal-brand text-white': activeTab === Tab.STUDENT
							}
						)}>
						Students
					</div>
					<div
						onClick={() => setActiveTab(Tab.TEACHER)}
						className={clsx(
							'cursor-pointer hover:bg-teal-brand hover:text-white px-2 py-px bg-gray-100 rounded-3xl shadow-md',
							{
								'bg-teal-brand text-white': activeTab === Tab.TEACHER
							}
						)}>
						Teachers
					</div>
				</div>

				<div className="w-full h-80">
					{attendanceMarkCount === 0 ? (
						<div className="flex flex-col space-y-2 justify-center items-center pt-24">
							<ExclamationIcon className="text-orange-brand w-14" />
							<div>Attendance not marked yet.</div>
						</div>
					) : (
						<AttendanceChart graphData={graphData} />
					)}
				</div>
				<div className="flex flex-row justify-between">
					<div className="flex flex-col items-center text-teal-brand">
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
					<button className="w-full text-sm uppercase rounded-full tw-btn-blue">
						See Details
					</button>
				</div>
			</div>

			<div className="px-10 py-6 mt-4 bg-white border shadow-md rounded-2xl">
				<div className="mb-4 text-lg font-bold text-center">Statistics</div>
				<div className="flex flex-col space-y-4">
					<div className="flex flex-row items-center">
						<CashIcon className="w-10 mr-10 text-teal-brand " />
						<div className="flex flex-col">
							<div className="font-semibold text-teal-brand">
								Rs. {amountCollected}
							</div>
							<div className="text-sm text-gray-500">Fee Collected</div>
						</div>
					</div>

					<div className="flex flex-row items-center">
						<UsersIcon className="w-10 mr-10 text-blue-brand" />
						<div className="flex flex-col">
							<div className="font-semibold text-blue-brand">{studentsWhoPaid}</div>
							<div className="text-sm text-gray-500">Students</div>
						</div>
					</div>

					<div className="flex flex-row items-center">
						<CloudUploadIcon className="w-10 mr-10 text-orange-brand" />
						<div className="flex flex-col">
							<div className="font-semibold text-orange-brand">
								{moment(lastSnapshot).format('HH:mm')}
							</div>
							<div className="text-sm text-gray-500">
								{moment(lastSnapshot).format('D-M-YYYY')}
							</div>
						</div>
					</div>

					<div className="flex flex-row items-center">
						<RefreshIcon className="w-10 mr-10 text-teal-brand " />
						<div className="flex flex-col">
							<div className="font-semibold text-teal-brand">
								{unsyncedChanges} unsynced
							</div>
							<div className="text-sm text-gray-500">changes</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const mobile = isMobile()

const colorMap: Record<string, string> = {
	present: '#5ECDB9',
	absent: '#FC6171',
	leave: '#FFC107'
}

const renderActiveShape = (props: any) => {
	const RADIAN = Math.PI / 180

	const {
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		percent,
		value
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
			<text
				x={cx}
				y={cy}
				dy={8}
				textAnchor="middle"
				fill={colorMap[payload.name]}
				className="capitalize">
				{payload.name}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={colorMap[payload.name]}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 5}
				outerRadius={outerRadius + 10}
				fill={colorMap[payload.name]}
			/>
			<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
				{value}
			</text>
			<text
				className="text-xs"
				x={ex + (cos >= 0 ? 1 : -1) * 0}
				y={ey}
				dy={18}
				textAnchor={textAnchor}
				fill="#999">
				{`${(percent * 100).toFixed(2)}%`}
			</text>
		</g>
	)
}

type GraphData = {
	name: string
	value: number
}

type TAttendanceChartProps = {
	graphData: GraphData[]
}

const AttendanceChart: React.FC<TAttendanceChartProps> = ({ graphData }) => {
	const [activeIndex, setActiveIndex] = useState(0)

	const onPieEnter = (data: any, index: number) => {
		setActiveIndex(index)
	}

	const INNER_RADIUS = mobile ? 40 : 60
	const OUTER_RADIUS = mobile ? 55 : 80

	const CX = mobile ? 150 : 200
	const CY = mobile ? 160 : 150

	return (
		<div style={{ width: '100%', height: 300 }}>
			<ResponsiveContainer>
				<PieChart>
					<Pie
						activeIndex={activeIndex}
						activeShape={renderActiveShape}
						data={graphData}
						cx={CX}
						cy={CY}
						innerRadius={INNER_RADIUS}
						outerRadius={OUTER_RADIUS}
						fill="#74ACED"
						dataKey="value"
						onMouseEnter={onPieEnter}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}
