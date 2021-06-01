import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { AttendanceStatsCard } from 'components/attendance'
import { markAllFacultyAttendance, markFaculty, undoFacultyAttendance } from 'actions'
import { TModal } from 'components/Modal'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { toTitleCase } from 'utils/toTitleCase'
import { SmsModalContentWrapper } from './sms-modal-content-wrapper'
import { isValidTeacher } from 'utils'

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

	const {
		auth: { faculty_id },
		db: { faculty, sms_templates }
	} = useSelector((state: RootReducerState) => state)
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
					} else if (
						record.leave ||
						record.CASUAL_LEAVE ||
						record.SHORT_LEAVE ||
						record.SICK_LEAVE ||
						record.PRIVILEGED_LEAVE ||
						record.CASUAL_LEAVE
					) {
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

		const prevStatus = new Set([...Object.keys(record || {})])

		// this should remove any previous key-pair value
		// to make sure, there should be single entry in the system for the staff for the given attendance date
		// if attendance status is other than check_in or check_out

		// if previous attendance status is check_in, don't dispatch, this is to make sure
		// check_in and check_out, both should be present in the database
		if (prevStatus.size > 0) {
			if (
				prevStatus.has(AttendanceStatus.CHECK_IN) &&
				status === AttendanceStatus.CHECK_OUT
			) {
				// do nothing
			} else {
				dispatch(undoFacultyAttendance(member, attendanceDate))
			}
		}

		dispatch(markFaculty(member, attendanceDate, status))
	}

	const handleMarkAllPresent = () => {
		const activeFaculty = Object.values(faculty).filter(f => isValidTeacher(f))
		dispatch(markAllFacultyAttendance(activeFaculty, attendanceDate, AttendanceStatus.CHECK_IN))
	}

	// TODO: add logic to handle modal for sms sending
	// TODO: add logic to handle log sms history

	return (
		<div className="p-5 md:p-10 md:pt-5 print:hidden">
			<div className="space-y-6">
				<div className="flex flex-row items-center space-x-2">
					<input
						name="attendance-date"
						type="date"
						onChange={e => setState({ ...state, date: e.target.valueAsNumber })}
						value={attendanceDate}
						className="w-full text-sm bg-transparent tw-input border-blue-brand ring-1"
					/>
				</div>
				{showSendSmsModal && (
					<TModal>
						<div className="p-6 space-y-2 bg-white sm:p-8" ref={sendSmsModalRef}>
							<SmsModalContentWrapper
								date={attendanceDate}
								faculty={faculty}
								// TODO: create staff member separate attendance template
								smsTemplate={sms_templates.attendance}
								loggedUserId={faculty_id}
							/>
						</div>
					</TModal>
				)}
				<div className="relative text-sm md:text-base">
					<AttendanceStatsCard attendance={staffAttendance} />
					<div className="absolute flex flex-row items-center justify-center w-full px-4 space-x-4 -bottom-3 md:-bottom-4">
						<button
							onClick={() => setShowSendSmsModal(!showSendSmsModal)}
							className="w-2/5 p-1 text-white shadow-md md:p-2 bg-blue-brand rounded-3xl">
							Send SMS
						</button>
						<button
							onClick={handleMarkAllPresent}
							className="w-2/5 p-1 text-white shadow-md md:p-2 bg-teal-brand rounded-3xl">
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
	const [state, setState] = useState<CardState>({
		togglePresent: false,
		toggleLeave: false
	})

	const attendance =
		member.attendance?.[attendanceDate] ||
		({} as { [id in MISTeacherAttendanceStatus]: number })

	return (
		<div className="p-2 space-y-1 text-sm border rounded-md shadow-md md:p-3 md:text-base border-gray-50">
			<div className="flex flex-row items-center justify-between">
				<div className="flex flex-col items-start w-1/2">
					<Link
						className="w-11/12 truncate overflow-ellipsis hover:underline hover:text-blue-brand md:w-auto"
						to={`/staff/${member.id}/attendance`}>
						{toTitleCase(member.Name)}
					</Link>
				</div>
				<div className="flex flex-row items-center space-x-2">
					<button
						onClick={() => {
							setState({ togglePresent: !state.togglePresent, toggleLeave: false })
							markAttendance(member, AttendanceStatus.CHECK_IN)
						}}
						name="present"
						className={clsx(
							'flex items-center justify-center w-8 h-8 rounded-full shadow-md',
							{
								'bg-teal-brand text-white':
									attendance.check_in || attendance.check_out
							}
						)}>
						<span>P</span>
					</button>

					<button
						onClick={() => {
							setState({ togglePresent: false, toggleLeave: false })
							markAttendance(member, AttendanceStatus.ABSENT)
						}}
						name="absent"
						className={clsx(
							'flex items-center justify-center w-8 h-8 rounded-full shadow-md',
							{
								'bg-red-brand text-white': attendance.absent
							}
						)}>
						<span>A</span>
					</button>
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
								!(attendance.absent || attendance.check_in || attendance.check_out)
						})}>
						<span>Leave</span>
					</button>
				</div>
			</div>
			{state.togglePresent && (
				<div className="flex flex-row justify-between mt-2 space-x-2 text-xs">
					<button
						onClick={() => markAttendance(member, AttendanceStatus.CHECK_IN)}
						className={clsx('px-2 py-1 rounded bg-blue-brand text-white', {
							'bg-teal-brand text-white': attendance.check_in
						})}>
						<span>Check In</span>
						{attendance.check_in && (
							<span className="ml-4">
								{moment(attendance.check_in).format('HH:mm')}
							</span>
						)}
					</button>

					<button
						disabled={!attendance.check_in}
						onClick={() => markAttendance(member, AttendanceStatus.CHECK_OUT)}
						className={clsx('px-2 py-1 rounded bg-blue-brand text-white', {
							'tw-btn bg-teal-brand text-white': attendance.check_out
						})}>
						<span>Check Out</span>
						{attendance.check_out && (
							<span className="ml-4">
								{moment(attendance.check_out).format('HH:mm')}
							</span>
						)}
					</button>
				</div>
			)}
			{state.toggleLeave && (
				<div className="flex flex-row justify-end space-x-2 text-xs">
					<button
						onClick={() => markAttendance(member, AttendanceStatus.LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': attendance.leave
						})}>
						<span>Leave</span>
					</button>

					<button
						onClick={() => markAttendance(member, AttendanceStatus.SHORT_LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': attendance.SHORT_LEAVE
						})}>
						<span>Short</span>
					</button>

					<button
						onClick={() => markAttendance(member, AttendanceStatus.CASUAL_LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': attendance.CASUAL_LEAVE
						})}>
						<span>Casual</span>
					</button>
					<button
						onClick={() => markAttendance(member, AttendanceStatus.SICK_LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': attendance.SICK_LEAVE
						})}>
						<span>Sick</span>
					</button>
				</div>
			)}
		</div>
	)
}
