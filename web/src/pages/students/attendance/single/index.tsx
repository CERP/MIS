import React, { Fragment, useState, useRef, useMemo } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import { Transition } from '@headlessui/react'
import { RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import UserIconSvg from 'assets/svgs/user.svg'
import toTitleCase from 'utils/toTitleCase'
import { AttendanceStatsCard } from 'components/attendance'
import { StudentAttendancePrint } from 'components/Printable/Student/StudentAttendancePrint'
import months from 'constants/months'

type StudentAttendanceProps = RouteComponentProps<{ id: string }>

interface localState {
	detailsExpanded: boolean
	totalAbsents: number
	totalPresents: number
	totalLeaves: number
	month: string
	year: string
}

type AttendanceHistory = {
	[month: string]: {
		presents: number
		absents: number
		leaves: number
		unmarked: number
	}
}

export const SingleStudentAttendance = ({ match }: StudentAttendanceProps) => {
	const student = useSelector((state: RootReducerState) => state.db.students[match.params.id])
	const { schoolAddress, schoolName, schoolPhoneNumber } = useSelector(
		(state: RootReducerState) => state.db.settings
	)
	const [localState, setLocalState] = useState<localState>({
		detailsExpanded: false,
		month: moment().format('MMMM'),
		year: moment().format('YYYY'),
		totalAbsents: 0,
		totalPresents: 0,
		totalLeaves: 0
	})

	const years: string[] = useMemo(() => {
		const years = Object.values(student.attendance)
			.sort((a, b) => b.time - a.time)
			.reduce((agg, curr) => {
				return [...agg, moment(curr.date).format('YYYY')]
			}, [] as string[])

		return [...new Set(years)]
	}, [student])

	const lastSixMonthsAttendance: AttendanceHistory = useMemo(() => {
		return Object.values(student.attendance ?? {})
			.sort((a, b) => b.time - a.time)
			.reduce((agg, curr) => {
				if (!moment(curr.date).isSameOrAfter(moment(moment.now()).subtract(6, 'month'))) {
					return agg
				}
				const date = moment(curr.date).format('MMMM YYYY')
				if (curr.status.includes('LEAVE')) {
					return {
						...agg,
						[date]: {
							...agg[date],
							leaves: agg[date]?.leaves ? agg[date].leaves + 1 : 1
						}
					}
				}
				if (curr.status === 'ABSENT') {
					return {
						...agg,
						[date]: {
							...agg[date],
							absents: agg[date]?.absents ? agg[date].absents + 1 : 1
						}
					}
				}
				if (curr.status === 'PRESENT') {
					return {
						...agg,
						[date]: {
							...agg[date],
							presents: agg[date]?.presents ? agg[date].presents + 1 : 1
						}
					}
				}
			}, {} as AttendanceHistory)
	}, [student])

	const { totalHistoryAbsents, totalHistoryPresents, totalHistoryLeaves } = Object.values(
		lastSixMonthsAttendance
	).reduce(
		(agg, curr) => ({
			totalHistoryAbsents: agg.totalHistoryAbsents + (curr.absents ?? 0),
			totalHistoryPresents: agg.totalHistoryPresents + (curr.presents ?? 0),
			totalHistoryLeaves: agg.totalHistoryLeaves + (curr.leaves ?? 0)
		}),
		{ totalHistoryAbsents: 0, totalHistoryPresents: 0, totalHistoryLeaves: 0 }
	)

	const filtered_attendance = useMemo(() => {
		return Object.values(student.attendance ?? {})
			.sort((a, b) => b.time - a.time)
			.filter(att => getFilterCondition(att.date, localState.month, localState.year))
	}, [student, localState.month, localState.year])

	const {
		PRESENT: num_present,
		ABSENT: num_absent,
		LEAVE: num_leave,
		SICK_LEAVE: num_sick_leave,
		SHORT_LEAVE: num_short_leave,
		CASUAL_LEAVE: num_casual_leave
	} = filtered_attendance.reduce(
		(agg, curr) => {
			agg[curr.status] += 1
			return agg
		},
		{
			PRESENT: 0,
			ABSENT: 0,
			LEAVE: 0,
			SICK_LEAVE: 0,
			SHORT_LEAVE: 0,
			CASUAL_LEAVE: 0,
			UNMARK: 0
		}
	)

	const total_leave_count = num_sick_leave + num_short_leave + num_leave + num_casual_leave

	const detailsButtonRef = useRef(undefined)
	const mainFormRef = useRef(undefined)

	return (
		<>
			<div className="flex print:hidden mb-10 flex-col-reverse px-5 lg:flex-row lg:mx-32">
				<div
					ref={mainFormRef}
					className="bg-gray-700 rounded-b-2xl flex flex-1 flex-col lg:mt-4 lg:rounded-2xl px-2 lg:px-8 pb-4 md:pb-0">
					<div className="m-5 text-gray-50 space-y-2 lg:space-y-4">
						<button
							onClick={() => {
								setLocalState({
									...localState,
									detailsExpanded: !localState.detailsExpanded
								})
							}}
							className="w-full flex justify-center items-center">
							<div
								ref={detailsButtonRef}
								className="bg-blue-400 rounded-full py-2 px-2 text-white font-semibold cursor-pointer  flex flex-row justify-between items-center lg:hidden">
								<h1>Attendance History </h1>
								<ChevronDownIcon className="w-4 h-4 text-white ml-3" />
							</div>
						</button>
					</div>
					<div className="flex flex-row w-full items-center justify-center space-x-1 mb-4">
						<select
							value={localState.month}
							className="w-full tw-select"
							onChange={e => {
								setLocalState({ ...localState, month: e.target.value })
							}}>
							<option value="">Select Month</option>
							{months.map(month => (
								<option key={month} value={month}>
									{month}
								</option>
							))}
						</select>
						<select
							value={localState.year}
							className="w-full tw-select"
							onChange={e => {
								setLocalState({ ...localState, year: e.target.value })
							}}>
							<option value="">Select Year</option>
							{years.sort().map(year => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>
					<div className="w-full mb-2">
						<AttendanceStatsCard
							attendance={{
								ABSENT: num_absent,
								PRESENT: num_present,
								LEAVE:
									num_short_leave + num_sick_leave + num_casual_leave + num_leave
							}}
						/>
					</div>
					<div>
						<div className="flex justify-between text-white px-4 mb-2">
							<p className="font-semibold">Date</p>
							<p className="font-semibold">Status</p>
						</div>
						<div className="flex w-full overflow-y-auto flex-col space-y-2 max-h-60 md:max-h-96">
							{filtered_attendance.map(attendance => (
								<DailyAttendanceCard
									key={attendance.date}
									date={moment(attendance.date).format('DD-MM-YYYY')}
									status={toTitleCase(attendance.status)}
								/>
							))}
						</div>
					</div>
					<div className="lg:flex hidden flex-1 justify-center items-center mt-4 mb-3 px-5">
						<button
							onClick={() => window.print()}
							className="tw-button bg-yellow-400 text-white px-5 py-2 rounded-md font-semibold w-2/5 md:py-4 text-base">
							Print
						</button>
					</div>
				</div>
				<div className="lg:flex-1">
					<div className="text-white pt-2 lg:mx-3 font-medium bg-gray-700 rounded-t-2xl mt-4 lg:bg-white lg:text-black lg:rounded-2xl lg:flex lg:p-4 lg:items-center lg:flex-1 lg:flex-row lg:shadow-lg lg:border lg:border-gray-300">
						<div className="hidden md:block">
							<img
								src={
									student.ProfilePicture?.url ??
									student.ProfilePicture?.image_string ??
									UserIconSvg
								}
								className="mx-auto h-16 w-16 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700"
								alt={student.Name}
							/>
						</div>
						<div className=" md:block flex flex-col text-center lg:text-left lg:ml-6 lg:flex-1 lg:flex">
							<p>{toTitleCase(student.Name)}</p>
						</div>
						<div className="flex flex-row items-center justify-center  text-center lg:text-left lg:flex-1 lg:flex ">
							<p className="mr-2">Percentage:</p>
							{(
								(num_present / (num_absent + num_present + total_leave_count)) *
								100
							).toFixed(2)}
							%
						</div>
					</div>
					<div
						className="bg-white hidden font-medium  mx-3 rounded-t-2xl mt-4 lg:bg-white
                     lg:text-black lg:rounded-2xl lg:flex lg:p-5 lg:items-center lg:flex-1 flex-col lg:text-center lg:justify-center
                      lg:shadow-lg lg:border lg:border-gray-300">
						<div className="w-full flex flex-1 flex-col space-y-2  mt-2 overflow-y-auto max-h-96">
							<p className="flex flex-1 justify-center items-center text-center font-semibold">
								Past 6 Months
							</p>
							<div className="flex flex-1 text-left ">
								<p className="flex-1">Month</p>
								<p className="flex-1 text-center">Presents</p>
								<p className="flex-1 text-center">Leaves</p>

								<p className="flex-1 text-center">Absents</p>
							</div>
							{lastSixMonthsAttendance ? (
								Object.entries(lastSixMonthsAttendance).map(([date, stats]) => (
									<div
										key={date}
										className={
											'flex flex-1 text-left sm:text-sm  text-base font-normal'
										}>
										<p className="flex-1">{date}</p>
										<p className="flex-1 text-center">{stats.presents ?? 0}</p>
										<p className="flex-1 text-center">{stats.leaves ?? 0}</p>

										<p
											className={clsx(
												'flex-1 text-center',
												(stats.absents ?? 0) > (stats.presents ?? 0)
													? 'text-red-brand'
													: ''
											)}>
											{stats.absents ?? 0}
										</p>
									</div>
								))
							) : (
								<div>No Data Available</div>
							)}
						</div>
						<div className="flex w-full flex-1 text-left  border-gray-500 mt-4 border-t-2 border-dashed ">
							<p className="flex-1 font-semibold">Total</p>
							<p className="flex-1 font-semibold text-center">
								{totalHistoryPresents}
							</p>
							<p className="flex-1 font-semibold text-yellow-300 text-center">
								{totalHistoryLeaves}
							</p>
							<p className="flex-1 font-semibold text-red-500 text-center">
								{totalHistoryAbsents}
							</p>
						</div>
					</div>
				</div>
			</div>
			<Transition
				as={Fragment}
				show={localState.detailsExpanded}
				enter="transform transition duration-[400ms]"
				enterFrom="opacity-0 rotate-[-120deg] scale-50"
				enterTo="opacity-100 rotate-0 scale-100"
				leave="transform duration-200 transition ease-in-out"
				leaveFrom="opacity-100 rotate-0 scale-100 "
				leaveTo="opacity-0 scale-95 ">
				<div
					style={{
						top: detailsButtonRef?.current?.offsetTop ?? 0,
						height: mainFormRef?.current?.offsetHeight + 100 ?? '50%',
						width: mainFormRef?.current?.offsetWidth ?? '50%'
					}}
					className={'bg-white rounded-md print:hidden ml-5 absolute  p-5 lg:hidden'}>
					<div className="bg-white text-blue-400 rounded-full py-2 px-2 font-semibold cursor-pointer mb-4 flex flex-row justify-center items-center lg:hidden">
						<p
							onClick={() => {
								setLocalState({
									...localState,
									detailsExpanded: !localState.detailsExpanded
								})
							}}>
							Hide Attendance
						</p>
						<ChevronUpIcon
							onClick={() => {
								setLocalState({
									...localState,
									detailsExpanded: !localState.detailsExpanded
								})
							}}
							className="w-4 h-4 text-blue-400 ml-3"
						/>
					</div>
					<div className="w-full flex flex-1 flex-col space-y-3 mt-2 overflow-y-scroll max-h-72">
						<h1 className="flex flex-1 justify-center items-center text-center">
							Past 6 Months
						</h1>
						<div className="flex flex-1 text-left text-sm ">
							<p className="flex-1 font-medium">Month</p>
							<p className="flex-1 font-medium text-center">Presents</p>
							<p className="flex-1 font-medium text-center">Absents</p>
							<p className="flex-1 font-medium text-center">Leaves</p>
						</div>
						{lastSixMonthsAttendance ? (
							Object.entries(lastSixMonthsAttendance).map(([date, stats]) => {
								return (
									<div
										key={date}
										className={clsx(
											'flex flex-1 text-left text-sm',
											(stats.absents ?? 0) > (stats.presents ?? 0)
												? 'text-red-brand'
												: ''
										)}>
										<p className="flex-1">{date}</p>
										<p className="flex-1 text-center">{stats.presents ?? 0}</p>
										<p className="flex-1 text-center">{stats.absents ?? 0}</p>
										<p className="flex-1 text-center">{stats.leaves ?? 0}</p>
									</div>
								)
							})
						) : (
							<div>No Data Available</div>
						)}
					</div>
					<div className="flex flex-1 text-left  border-gray-500 mt-4 border-t-2 border-dashed ">
						<div className="flex-1 font-semibold">Total</div>
						<p className="flex-1 font-semibold text-center">{totalHistoryPresents}</p>
						<p className="flex-1 font-semibold text-yellow-300 text-center">
							{totalHistoryLeaves}
						</p>
						<p className="flex-1 font-semibold text-red-500 text-right">
							{totalHistoryAbsents}
						</p>
					</div>
					<div className="flex flex-1 flex-row justify-center text-center">
						<button
							className="tw-btn h-full w-full p-0 bg-yellow-400 text-white font-medium mt-2 py-2"
							onClick={() =>
								setLocalState({
									...localState,
									detailsExpanded: !localState.detailsExpanded
								})
							}>
							Go Back
						</button>
					</div>
				</div>
			</Transition>
			<StudentAttendancePrint
				attendance={filtered_attendance}
				presents={num_present}
				absents={num_absent}
				leaves={total_leave_count}
				studentName={student.Name}
				schoolAddress={schoolAddress}
				schoolName={schoolName}
				schoolPhoneNumber={schoolPhoneNumber}
			/>
		</>
	)
}

type AttendanceCardProps = {
	date: string
	status: string
}
const DailyAttendanceCard = ({ date, status }: AttendanceCardProps) => {
	return (
		<div className="flex flex-1 flex-col bg-white rounded-md px-4 py-2">
			<div
				className={clsx('flex w-full flex-row justify-between text-black font-normal', {
					'text-teal-brand': status === 'Present',
					'text-red-brand': status === 'Absent',
					'text-orange-brand': status.toLowerCase().includes('leave')
				})}>
				<p>{date}</p>
				<p>{toTitleCase(status, '_')}</p>
			</div>
		</div>
	)
}

const getFilterCondition = (date: string, month: string, year: string) => {
	if (month === '' && year === '') {
		return true
	}

	if (month === '' && year !== '') {
		return moment(date).format('YYYY') === year
	}

	if (month !== '' && year === '') {
		return moment(date).format('MMMM') === month
	}

	if (month !== '' && year !== '') {
		return moment(date).format('MMMM') === month && moment(date).format('YYYY') === year
	}
}
