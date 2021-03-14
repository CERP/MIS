import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import clsx from 'clsx'

import { AttendanceStatsCard } from 'components/attendance'
import { AppLayout } from 'components/Layout/appLayout'
import { markFaculty, undoFacultyAttendance } from 'actions'
import { TModal } from 'components/Modal'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { toTitleCase } from 'utils/toTitleCase'
import { SmsModalContentWrapper } from './sms-modal-content-wrapper'

type State = {
	date: number
}

enum AttendanceStatus {
	CHECK_IN = 'check_in',
	CHECK_OUT = 'check_out',
	ABSENT = 'absent',
	LEAVE = 'leave',
	CASUAL_LEAVE = 'CASUAL_LEAVE',
	SHORT_LEAVE = 'SHORT_LEAVE',
	SICK_LEAVE = 'SICK_LEAVE'
}

export const StaffAttendance = () => {
	const dispatch = useDispatch()

	const { faculty } = useSelector((state: RootReducerState) => state.db)
	const {
		ref: sendSmsModalRef,
		isComponentVisible: showSendSmsModal,
		setIsComponentVisible: setShowSendSmsModal
	} = useComponentVisible(false)

	const [state, setState] = useState<State>({
		date: Date.now()
	})

	const attendanceDate = moment(state.date).format('YYYY-MM-DD')

	const staffAttendance = useMemo(() => {
		let attendance = { PRESENT: 0, LEAVE: 0, ABSENT: 0, UNMARK: 0 }

		for (const f of Object.values(faculty)) {
			if (f && f.Name && f.Active) {
				const record = (f.attendance || {})[attendanceDate]

				if (record) {
					if (record.check_in) {
						attendance.PRESENT += 1
					} else if (record.absent) {
						attendance.ABSENT += 1
					}
					// TODO: handle other leave status as well
					else if (record.leave) {
						attendance.LEAVE += 1
					}
				}
			}
		}

		return {
			...attendance,
			UNMARK:
				Object.keys(faculty).length -
				(attendance.PRESENT + attendance.ABSENT + attendance.LEAVE)
		}
	}, [faculty, attendanceDate])

	const markAttendanceHandler = (member: MISTeacher, status: AttendanceStatus) => {
		const record =
			member.attendance?.[attendanceDate] ||
			({} as { [id in MISTeacherAttendanceStatus]: number })
		const prevStatus = Object.keys(record)?.[0]

		// this should remove any previous key-pair value
		// to make sure, there should be single entry in the system for the staff for the given attendance date
		// if attendance status is other than check_in or check_out

		// if previous attendance status is check_in, don't dispatch, this is to make sure
		// check_in and check_out, both should be present in the database
		if (
			prevStatus &&
			prevStatus !== AttendanceStatus.CHECK_IN &&
			status !== AttendanceStatus.CHECK_OUT
		) {
			dispatch(undoFacultyAttendance(member, attendanceDate))
		}

		dispatch(markFaculty(member, attendanceDate, status))
	}

	// TODO: add logic to handle modal for sms sending
	// TODO: add logic to handle log sms history

	return (
		<AppLayout title="Staff Attendance">
			<div className="p-5 md:p-10 print:hidden">
				<div className="space-y-6">
					<div className="flex flex-row items-center space-x-2">
						<input
							name="attendance-date"
							type="date"
							onChange={e => setState({ ...state, date: e.target.valueAsNumber })}
							value={attendanceDate}
							className="tw-input w-full bg-transparent border-blue-brand ring-1 text-sm"
						/>
					</div>
					{showSendSmsModal && (
						<TModal>
							<div className="bg-white p-6 sm:p-8 space-y-2" ref={sendSmsModalRef}>
								<SmsModalContentWrapper />
							</div>
						</TModal>
					)}
					<div className="relative text-sm md:text-base">
						<AttendanceStatsCard attendance={staffAttendance} />
						<div className="absolute -bottom-3 md:-bottom-4 flex flex-row items-center justify-center w-full space-x-4 px-4">
							<button
								onClick={() => setShowSendSmsModal(!showSendSmsModal)}
								className="p-1 md:p-2 shadow-md bg-blue-brand text-white rounded-3xl w-2/5">
								Send SMS
							</button>
							<button className="p-1 md:p-2 shadow-md bg-green-brand text-white rounded-3xl w-2/5">
								Mark All Present
							</button>
						</div>
					</div>

					<div className="space-y-2">
						{Object.values(faculty)
							.filter(f => f && f.Name && f.Active)
							.sort((a, b) => a.Name.localeCompare(b.Name))
							.map(f => (
								<Card
									key={f.id}
									markAttendance={markAttendanceHandler}
									attendanceDate={attendanceDate}
									member={f}
								/>
							))}
					</div>
				</div>
			</div>
		</AppLayout>
	)
}

type CardProps = {
	markAttendance?: (member: MISTeacher, type: AttendanceStatus) => void
	attendanceDate: string
	member: MISTeacher
}

type CardState = {
	toggleLeave: boolean
	togglePresent: boolean
}

const Card: React.FC<CardProps> = ({ member, attendanceDate, markAttendance }) => {
	// const { ref: modalRef, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	const [state, setState] = useState<CardState>({
		togglePresent: false,
		toggleLeave: false
	})

	const record =
		member.attendance?.[attendanceDate] ||
		({} as { [id in MISTeacherAttendanceStatus]: number })
	const status = Object.keys(record)?.[0]

	// TODO: handle check_in and check_out time
	// TODO: handle transition between check_in and checkout time
	return (
		<div className="p-2 md:p-3 text-sm md:text-base border border-gray-50 rounded-md space-y-1 shadow-md">
			<div className="flex flex-row items-center justify-between">
				<div className="flex flex-col w-1/2 items-start">
					<Link
						className="overflow-ellipsis truncate hover:underline hover:text-blue-brand w-11/12 md:w-auto"
						to={`/student/${member.id}/attendance`}>
						{toTitleCase(member.Name)}
					</Link>
				</div>
				<div className="flex flex-row items-center space-x-2">
					<button
						onClick={() =>
							setState({ togglePresent: !state.togglePresent, toggleLeave: false })
						}
						name="present"
						className={clsx(
							'flex items-center justify-center w-8 h-8 rounded-full shadow-md',
							{
								'bg-green-brand text-white':
									AttendanceStatus.CHECK_IN === status ||
									AttendanceStatus.CHECK_OUT === status
							}
						)}>
						<span>P</span>
					</button>

					<button
						onClick={() => markAttendance(member, AttendanceStatus.ABSENT)}
						name="absent"
						className={clsx(
							'flex items-center justify-center w-8 h-8 rounded-full shadow-md',
							{
								'bg-red-brand text-white': AttendanceStatus.ABSENT === status
							}
						)}>
						<span>A</span>
					</button>
					{/* TODO: handle click outside */}
					<button
						name="leave"
						onClick={() =>
							setState({ toggleLeave: !state.toggleLeave, togglePresent: false })
						}
						// check if the status of the attendance isn't in check_in, checkout or absent
						// set bg color to orange
						className={clsx('rounded-lg shadow-md px-2 py-1', {
							'bg-orange-brand text-white':
								status &&
								!(
									AttendanceStatus.CHECK_IN === status ||
									AttendanceStatus.CHECK_OUT === status ||
									AttendanceStatus.ABSENT === status
								)
						})}>
						<span>Leave</span>
					</button>
				</div>
			</div>
			{/* TODO: apply transition here from headlessui/react */}
			{state.togglePresent && (
				<div className="flex flex-row justify-between text-xs space-x-2">
					<button
						onClick={() => markAttendance(member, AttendanceStatus.CHECK_IN)}
						className={clsx('tw-btn-blue', {
							'bg-green-brand text-white': AttendanceStatus.CHECK_IN === status
						})}>
						<span>Check In</span>
						{record.check_in && (
							<span className="ml-4">{moment(record.check_in).format('HH:mm')}</span>
						)}
					</button>

					<button
						disabled={AttendanceStatus.CHECK_IN != status}
						onClick={() => markAttendance(member, AttendanceStatus.CHECK_OUT)}
						className={clsx('tw-btn-blue', {
							'tw-btn bg-green-brand text-white':
								AttendanceStatus.CHECK_OUT === status
						})}>
						<span>Check Out</span>
						{record.check_out && (
							<span className="ml-4">{moment(record.check_out).format('HH:mm')}</span>
						)}
					</button>
				</div>
			)}
			{state.toggleLeave && (
				<div className="flex flex-row justify-end text-xs space-x-2">
					<button
						onClick={() => markAttendance(member, AttendanceStatus.LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': AttendanceStatus.LEAVE === status
						})}>
						<span>Leave</span>
					</button>

					<button
						onClick={() => markAttendance(member, AttendanceStatus.SHORT_LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': AttendanceStatus.SHORT_LEAVE === status
						})}>
						<span>Short</span>
					</button>

					<button
						onClick={() => markAttendance(member, AttendanceStatus.CASUAL_LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': AttendanceStatus.CASUAL_LEAVE === status
						})}>
						<span>Casual</span>
					</button>
					<button
						onClick={() => markAttendance(member, AttendanceStatus.SICK_LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': AttendanceStatus.SICK_LEAVE === status
						})}>
						<span>Sick</span>
					</button>
				</div>
			)}
		</div>
	)
}
