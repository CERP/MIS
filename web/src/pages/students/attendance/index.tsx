import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import moment from 'moment'

import { AttendanceStatsCard } from 'components/attendance'
import { TModal } from 'components/Modal'
import { markAllStudents, markStudent } from 'actions'
import { isValidStudent } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import { useComponentVisible } from 'hooks/useComponentVisible'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import { SmsModalContentWrapper } from './sms-modal-content-wrapper'

type State = {
	selectedSection?: string
	date: number
	selectedStudents: {
		[id: string]: boolean
	}
}

// TODO: move this to constant file
enum AttendanceStatus {
	PRESENT = 'PRESENT',
	ABSENT = 'ABSENT',
	LEAVE = 'LEAVE',
	CASUAL_LEAVE = 'CASUAL_LEAVE',
	SHORT_LEAVE = 'SHORT_LEAVE',
	SICK_LEAVE = 'SICK_LEAVE'
}

const getStudentsForSection = (sectionId: string, students: RootDBState['students']) =>
	Object.values(students).filter(s => isValidStudent(s) && s.section_id === sectionId)

const deriveSelectedStudents = (sectionId: string, students: RootDBState['students']) =>
	getStudentsForSection(sectionId, students).reduce(
		(agg, curr) => ({ ...agg, [curr.id]: true }),
		{}
	)

export const StudentsAttendance = () => {
	const dispatch = useDispatch()
	const {
		auth: { faculty_id },
		db: { classes, students, sms_templates }
	} = useSelector((state: RootReducerState) => state)

	const {
		ref: sendSmsModalRef,
		isComponentVisible: showSendSmsModal,
		setIsComponentVisible: setShowSendSmsModal
	} = useComponentVisible(false)

	const [state, setState] = useState<State>({
		date: Date.now(),
		selectedStudents: {}
	})

	const { date, selectedStudents, selectedSection } = state

	const attendanceDate = moment(date).format('YYYY-MM-DD')

	const sections = useMemo(
		() =>
			getSectionsFromClasses(classes).sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0)),
		[classes]
	)

	useEffect(() => {
		if (sections.length !== 0) {
			const leastOrderSection = sections[0].id
			setState({
				...state,
				selectedStudents: deriveSelectedStudents(leastOrderSection, students),
				selectedSection: leastOrderSection
			})
		}
	}, [sections, students])

	useEffect(() => {
		if (selectedSection) {
			setState({
				...state,
				selectedStudents: deriveSelectedStudents(state.selectedSection, students)
			})
		}
	}, [selectedSection, students])

	const studentsAttendance = useMemo(() => {
		let attendance = { PRESENT: 0, LEAVE: 0, ABSENT: 0, UNMARK: 0 }

		if (Object.keys(selectedStudents)) {
			for (const studentId of Object.keys(state.selectedStudents)) {
				const student = students[studentId]

				if (student?.Name) {
					const record = (student.attendance || {})[attendanceDate]
					if (record) {
						if (
							record.status === AttendanceStatus.PRESENT ||
							record.status === AttendanceStatus.ABSENT
						) {
							attendance[record.status] += 1
						} else {
							attendance[AttendanceStatus.LEAVE] += 1
						}
					}
				}
			}
		}

		return {
			...attendance,
			UNMARK:
				Object.keys(selectedStudents).length -
				(attendance.PRESENT + attendance.ABSENT + attendance.LEAVE)
		}
	}, [selectedStudents, students, attendanceDate])

	const markAllPresentHandler = () => {
		const sectionStudents = getStudentsForSection(selectedSection, students)
		dispatch(markAllStudents(sectionStudents, attendanceDate, AttendanceStatus.PRESENT))
	}

	const markAttendanceHandler = (student: MISStudent, status: AttendanceStatus) => {
		dispatch(markStudent(student, attendanceDate, status))
	}

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

					<select
						name="section-id"
						value={state.selectedSection}
						onChange={e => setState({ ...state, selectedSection: e.target.value })}
						className="w-full bg-transparent tw-input border-blue-brand ring-1">
						{sections
							.filter(s => s && s.id && s.name)
							.map(s => (
								<option key={s.id} value={s.id}>
									{toTitleCase(s.namespaced_name, '-')}
								</option>
							))}
					</select>
				</div>

				{showSendSmsModal && (
					<TModal>
						<div className="p-6 space-y-2 bg-white sm:p-8" ref={sendSmsModalRef}>
							<SmsModalContentWrapper
								date={attendanceDate}
								students={students}
								markedStudents={selectedStudents}
								smsTemplate={sms_templates.attendance || ''}
								teacherId={faculty_id}
							/>
						</div>
					</TModal>
				)}

				<div className="relative text-sm md:text-base">
					<AttendanceStatsCard attendance={studentsAttendance} />
					<div className="absolute flex flex-row items-center justify-center w-full px-4 space-x-4 -bottom-3 md:-bottom-4">
						<button
							onClick={() => setShowSendSmsModal(!showSendSmsModal)}
							className="w-2/5 p-1 text-white shadow-md md:p-2 bg-blue-brand rounded-3xl">
							Send SMS
						</button>
						<button
							onClick={markAllPresentHandler}
							className="w-2/5 p-1 text-white shadow-md md:p-2 bg-teal-brand rounded-3xl">
							Mark All Present
						</button>
					</div>
				</div>

				<div className="space-y-2">
					{Object.keys(selectedStudents).map(studentId => (
						<Card
							key={studentId}
							student={students[studentId]}
							attendanceDate={attendanceDate}
							markAttendance={markAttendanceHandler}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

type CardProps = {
	markAttendance?: (student: MISStudent, type: AttendanceStatus) => void
	attendanceDate: string
	student: MISStudent
}

const Card: React.FC<CardProps> = ({ student, attendanceDate, markAttendance }) => {
	const [toggleLeave, setToggleLeave] = useState(false)

	const status = student?.attendance?.[attendanceDate]?.status as AttendanceStatus

	return (
		<div className="p-2 space-y-1 text-sm border rounded-md shadow-md md:p-3 md:text-base border-gray-50">
			<div className="flex flex-row items-center justify-between">
				<div className="flex flex-col items-start w-1/2">
					<Link
						className="w-11/12 truncate overflow-ellipsis hover:underline hover:text-blue-brand md:w-auto"
						to={`/students/${student.id}/attendance`}>
						{toTitleCase(student.Name)}
					</Link>
					<div className="text-xs text-gray-600">R# {student.RollNumber}</div>
				</div>
				<div className="flex flex-row items-center space-x-2">
					<button
						onClick={() => {
							setToggleLeave(false)
							markAttendance(student, AttendanceStatus.PRESENT)
						}}
						name="present"
						className={clsx(
							'flex items-center justify-center w-8 h-8 rounded-full shadow-md',
							{
								'bg-teal-brand text-white': AttendanceStatus.PRESENT === status
							}
						)}>
						<span>P</span>
					</button>

					<button
						onClick={() => {
							setToggleLeave(false)
							markAttendance(student, AttendanceStatus.ABSENT)
						}}
						name="absent"
						className={clsx(
							'flex items-center justify-center w-8 h-8 rounded-full shadow-md',
							{
								'bg-red-brand text-white': AttendanceStatus.ABSENT === status
							}
						)}>
						<span>A</span>
					</button>
					<button
						name="leave"
						className={clsx('rounded-lg shadow-md px-2 py-1', {
							'bg-orange-brand text-white':
								status &&
								!(
									AttendanceStatus.PRESENT === status ||
									AttendanceStatus.ABSENT === status
								)
						})}
						onClick={() => setToggleLeave(!toggleLeave)}>
						<span>Leave</span>
					</button>
				</div>
			</div>
			{toggleLeave && (
				<div className="flex flex-row justify-end space-x-2 text-xs">
					<button
						onClick={() => markAttendance(student, AttendanceStatus.LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': AttendanceStatus.LEAVE === status
						})}>
						<span>Leave</span>
					</button>

					<button
						onClick={() => markAttendance(student, AttendanceStatus.SHORT_LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': AttendanceStatus.SHORT_LEAVE === status
						})}>
						<span>Short</span>
					</button>

					<button
						onClick={() => markAttendance(student, AttendanceStatus.CASUAL_LEAVE)}
						className={clsx('border border-orange-brand py-1 px-2 rounded-3xl w-16', {
							'bg-orange-brand text-white': AttendanceStatus.CASUAL_LEAVE === status
						})}>
						<span>Casual</span>
					</button>
					<button
						onClick={() => markAttendance(student, AttendanceStatus.SICK_LEAVE)}
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
