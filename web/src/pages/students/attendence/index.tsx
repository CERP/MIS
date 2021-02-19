import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { AttendanceStatsCard } from 'components/attendance'
import { AppLayout } from 'components/Layout/appLayout'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import toTitleCase from 'utils/toTitleCase'
import { markAllStudents, markStudent } from 'actions'

type State = {
	selectedSection?: string
	attendaceDate?: number
	selectedStudents: {
		[id: string]: boolean
	}
}

enum AttendanceStatus {
	PRESENT = "PRESENT",
	ABSENT = "ABSENT",
	LEAVE = "LEAVE",
	CASUAL_LEAVE = "CASUAL_LEAVE",
	SHORT_LEAVE = "SHORT_LEAVE",
	SICK_LEAVE = "SICK_LEAVE"
}

const getStudentsForSection = (sectionId: string, students: RootDBState["students"]) => Object.values(students)
	.filter(s => s.Name && s.section_id === sectionId)

const deriveSelectedStudents = (sectionId: string, students: RootDBState["students"]) => getStudentsForSection(sectionId, students)
	.reduce((agg, curr) => ({ ...agg, [curr.id]: true }), {})


export const StudentAttendance = () => {
	const dispatch = useDispatch()
	const { classes, students } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		attendaceDate: Date.now(),
		selectedStudents: {}
	})

	const { attendaceDate, selectedStudents, selectedSection } = state

	const attendanceDateString = moment(attendaceDate).format("YYYY-MM-DD")

	const sections = useMemo(() => (
		getSectionsFromClasses(classes)
			.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
	), [classes])

	useEffect(() => {
		if (sections.length != 0) {
			const leastOrderSection = sections?.[0]?.id
			setState({
				...state,
				selectedStudents: deriveSelectedStudents(leastOrderSection, students),
				selectedSection: leastOrderSection,
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

		let studentsAttendance = { PRESENT: 0, LEAVE: 0, ABSENT: 0, UNMARK: 0 }
		let totalAttendance = 0

		if (Object.keys(selectedStudents)) {

			for (const studentId of Object.keys(state.selectedStudents)) {
				const student = students[studentId]
				if (student && student.Name) {
					const record = (student.attendance || {})[attendanceDateString]
					if (record) {
						if (record.status === AttendanceStatus.PRESENT || record.status === AttendanceStatus.ABSENT) {
							studentsAttendance[record.status] += 1
						} else {
							studentsAttendance[AttendanceStatus.LEAVE] += 1
						}
						totalAttendance++
					}
				}
			}
		}

		return {
			...studentsAttendance,
			UNMARK: Object.keys(selectedStudents).length - totalAttendance
		}

	}, [selectedStudents, students, attendanceDateString])

	const markAllPresentHandler = () => {
		const sectionStudents = getStudentsForSection(selectedSection, students)
		dispatch(markAllStudents(sectionStudents, attendanceDateString, AttendanceStatus.PRESENT))
	}

	const toggleAttendanceHandler = (student: MISStudent, status: AttendanceStatus) => {
		dispatch(markStudent(student, attendanceDateString, status))
	}

	return (
		<AppLayout title="Student Attedance">
			<div className="p-5 md:p-10 md:pb-0 print:hidden">
				<div className="space-y-6">
					<div className="flex flex-row items-center space-x-2">
						<input
							name="attendance-date"
							type="date"
							onChange={(e) => setState({ ...state, attendaceDate: e.target.valueAsNumber })}
							value={attendanceDateString}
							className="tw-input w-full bg-transparent border-blue-brand ring-1 text-sm" />

						<select
							name="section-id"
							value={state.selectedSection}
							onChange={(e) => setState({ ...state, selectedSection: e.target.value })}
							className="tw-input w-full bg-transparent border-blue-brand ring-1">
							{
								sections
									.filter(s => s && s.id && s.name)
									.map(s => (
										<option key={s.id} value={s.id}>{toTitleCase(s.namespaced_name, '-')}</option>
									))
							}
						</select>
					</div>
					<div className="relative text-xs md:text-base">
						<AttendanceStatsCard attendance={studentsAttendance} />
						<div className="absolute -bottom-2.5 flex flex-row items-center justify-center w-full space-x-4 px-4">
							<button className="p-1 shadow-md bg-blue-brand text-white rounded-3xl w-2/5">
								Send SMS
							</button>
							<button
								onClick={markAllPresentHandler}
								className="p-1 shadow-md bg-green-brand text-white rounded-3xl w-2/5">
								Mark All Present
							</button>
						</div>
					</div>

					<div className="space-y-2">
						{
							Object.keys(selectedStudents)
								.map((studentId) => (
									<StudentItem key={studentId}
										student={students[studentId]}
										attendanceDate={attendanceDateString}
										toggleAttendance={toggleAttendanceHandler}
									/>
								))
						}
					</div>

				</div>
			</div>
		</AppLayout>
	)
}

type StudentItemProps = {
	toggleAttendance?: (student: MISStudent, type: AttendanceStatus) => void
	attendanceDate: string
	student: MISStudent
}

const StudentItem: React.FC<StudentItemProps> = ({ student, attendanceDate, toggleAttendance }) => {

	const [toggleLeave, setToggleLeave] = useState(false)

	const currAttendance = (student.attendance || {})[attendanceDate];
	const status = (currAttendance ? currAttendance.status : '') as AttendanceStatus

	return (
		<div className="p-2 text-sm border rounded-md space-y-1">
			<div className="flex flex-row items-center justify-between">
				<div className="flex flex-col w-1/2 items-start">
					<Link className="overflow-ellipsis truncate hover:underline w-11/12" to={`/student/${student.id}/attendance`}>{toTitleCase(student.Name)}</Link>
					<div className="text-xs text-gray-600">R# {student.RollNumber}</div>
				</div>
				<div className="flex flex-row items-center space-x-2">

					<button
						onClick={() => toggleAttendance(student, AttendanceStatus.PRESENT)}
						name="present"
						className={clsx("flex items-center justify-center w-8 h-8 rounded-full shadow-md", {
							"bg-green-brand text-white": AttendanceStatus.PRESENT === status
						})}>
						P
					</button>

					<button
						onClick={() => toggleAttendance(student, AttendanceStatus.ABSENT)}
						name="absent"
						className={clsx("flex items-center justify-center w-8 h-8 rounded-full shadow-md", {
							"bg-red-brand text-white": AttendanceStatus.ABSENT === status
						})}>
						A
					</button>
					{/* TODO: handle click outside */}
					<button name="leave" className={
						clsx("rounded-lg shadow-md px-2 py-1", {
							"bg-orange-brand text-white": status && !(AttendanceStatus.PRESENT === status || AttendanceStatus.ABSENT === status)
						})}
						onClick={() => setToggleLeave(!toggleLeave)}
					>
						Leave
					</button>
				</div>
			</div>
			{/* TODO: apply transition here from headlessui/react */}
			{
				toggleLeave && (
					<div className="flex flex-row justify-end text-xs space-x-2">
						<button
							onClick={() => toggleAttendance(student, AttendanceStatus.LEAVE)}
							className={clsx("border border-orange-brand py-1 px-2 rounded-3xl w-16", {
								"bg-orange-brand text-white": AttendanceStatus.LEAVE === status
							})}>Leave</button>
						<button
							onClick={() => toggleAttendance(student, AttendanceStatus.SHORT_LEAVE)}
							className={clsx("border border-orange-brand py-1 px-2 rounded-3xl w-16", {
								"bg-orange-brand text-white": AttendanceStatus.SHORT_LEAVE === status
							})}>Short</button>
						<button
							onClick={() => toggleAttendance(student, AttendanceStatus.CASUAL_LEAVE)}
							className={clsx("border border-orange-brand py-1 px-2 rounded-3xl w-16", {
								"bg-orange-brand text-white": AttendanceStatus.CASUAL_LEAVE === status
							})}>Casual</button>
						<button
							onClick={() => toggleAttendance(student, AttendanceStatus.SICK_LEAVE)}
							className={clsx("border border-orange-brand py-1 px-2 rounded-3xl w-16", {
								"bg-orange-brand text-white": AttendanceStatus.SICK_LEAVE === status
							})}>Sick</button>
					</div>
				)
			}
		</div>
	)
}