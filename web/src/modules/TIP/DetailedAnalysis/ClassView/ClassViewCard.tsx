import React, { useState } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { TModal } from '../../Modal'
import StudentInfoModal from '../Modals/StudentInfoModal'
import TIPGroupModal from '../Modals/TIPGroupModal'
import ChangeTIPGroup from '../Modals/ChangeTIPGroup'
import StudentProfileClassView from '../Modals/StudentProfileClassView'
import { convertLearningGradeToGroupName } from 'utils/TIP'
import { assignLearningLevel } from 'actions'
import { useComponentVisible } from 'hooks/useComponentVisible'
import moment from 'moment'
import { Tag } from 'assets/icons'
interface P {
	std: MISStudent

	setLearningLevel: (
		student_id: string,
		subject: TIPSubjects,
		level: TIPGrades,
		is_oral: boolean,
		history: TIPGradesHistory
	) => void
}

enum ModalType {
	ASSIGNED_GROUPS_INFO = 'assigned_groups-info',
	TIP_GROUPS = 'tip_groups',
	CHANGE_GROUP = 'change_group',
	STUDENT_PROFILE = 'student_profile',
	ERROR_ENTER_STUDENT_MARKS = 'error_enter_student_marks'
}

const ClassViewCard: React.FC<P> = ({ std, setLearningLevel }) => {
	const [modal_type, setModalType] = useState('')
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	const [current_grade, setCurrentGrade] = useState<TIPGrades>()
	const [selected_grade, setSelectedGrade] = useState<TIPGrades>()
	const [selected_subject, setSelectSubject] = useState<TIPSubjects>()

	const reAssignGrade = () => {
		const { is_oral: current_oral_value, history: current_history, grade } = std
			?.targeted_instruction?.learning_level?.[selected_subject] || {
			is_oral: false,
			history: {},
			grade: ''
		}
		const is_oral = selected_grade === 'Oral Test' ? true : current_oral_value
		const timestamp = moment().format('YYYY-MM-DD')
		const history = {
			...current_history,
			[timestamp]: {
				type: 'Manual',
				grade: grade
			}
		}
		setLearningLevel(
			std.id,
			selected_subject,
			selected_grade,
			is_oral,
			history as TIPGradesHistory
		)
		setIsComponentVisible(false)
	}

	return (
		<>
			{isComponentVisible && (
				<TModal>
					{modal_type === ModalType.ASSIGNED_GROUPS_INFO && (
						<div ref={ref}>
							<StudentInfoModal
								learning_levels={std.targeted_instruction.learning_level}
								setCurrentGrade={setCurrentGrade}
								setModalType={setModalType}
								setSelectSubject={setSelectSubject}
							/>
						</div>
					)}
					{modal_type === ModalType.TIP_GROUPS && (
						<div ref={ref}>
							<TIPGroupModal
								subject={selected_subject}
								setSelectedGrade={setSelectedGrade}
								setModalType={setModalType}
							/>
						</div>
					)}
					{modal_type === ModalType.CHANGE_GROUP && (
						<div ref={ref}>
							<ChangeTIPGroup
								subject={selected_subject}
								selected_grade={selected_grade}
								current_grade={current_grade}
								reAssignGrade={reAssignGrade}
							/>
						</div>
					)}
					{modal_type === ModalType.STUDENT_PROFILE && (
						<div ref={ref}>
							<StudentProfileClassView
								setIsComponentVisible={setIsComponentVisible}
								learning_levels={std?.targeted_instruction?.learning_level}
								std={std}
							/>
						</div>
					)}
					{modal_type === ModalType.ERROR_ENTER_STUDENT_MARKS && (
						<div
							ref={ref}
							className="bg-white p-4 flex flex-col items-center justify-center w-auto">
							<div className="font-bold">Please Enter Student Marks</div>
							<button
								className="bg-blue-tip-brand text-white rounded-sm py-1 px-4"
								onClick={() => setIsComponentVisible(false)}>
								Ok
							</button>
						</div>
					)}
				</TModal>
			)}
			<div className="items-center text-xs w-full mt-4 flex flex-row justify-around shadow-lg">
				<div className="w-2/5 md:w-6/12 flex flex-row justify-start items-center m-2">
					<div className="font-bold text-center">{std.Name}</div>
					<div
						className="rounded-full bg-white p-2 shadow-lg ml-1 flex justify-center items-center cursor-pointer"
						onClick={() => (
							setModalType(ModalType.STUDENT_PROFILE), setIsComponentVisible(true)
						)}>
						<img className="w-2 h-2" src={Tag} alt="" />
					</div>
				</div>
				<div className="flex flex-row justify-between w-3/5 md:w-6/12 text-xs my-4 mr-4">
					{['Urdu', 'Maths', 'English'].map(sub => {
						const subject = std?.targeted_instruction?.learning_level?.[sub]
						const grade = convertLearningGradeToGroupName(subject?.grade)
						return (
							<div
								key={std.id}
								className="w-2/6 flex justify-center items-center cursor-pointer">
								<div
									className={clsx('px-2 py-1 rounded-md text-white', {
										'bg-blue-tip-brand': grade === 'Blue',
										'bg-yellow-tip-brand': grade === 'Yellow',
										'bg-green-tip-brand': grade === 'Green',
										'bg-orange-tip-brand': grade === 'Orange',
										'bg-gray-400': grade === 'Oral',
										'bg-gray-600': grade === 'Remediation Not Needed',
										'bg-gray-100': grade === undefined
									})}
									onClick={() => {
										setIsComponentVisible(true)
										setModalType(
											subject && grade
												? ModalType.ASSIGNED_GROUPS_INFO
												: ModalType.ERROR_ENTER_STUDENT_MARKS
										)
									}}>
									{grade === 'Remediation Not Needed' ? 'none' : grade ?? 'N/A'}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}

export default connect(
	() => ({}),
	(dispatch: Function) => ({
		setLearningLevel: (
			student_id: string,
			subject: TIPSubjects,
			level: TIPGrades,
			is_oral: boolean,
			history: TIPGradesHistory
		) => dispatch(assignLearningLevel(student_id, subject, level, is_oral, history))
	})
)(ClassViewCard)
