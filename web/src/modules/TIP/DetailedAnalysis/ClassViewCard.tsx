import React, { useState } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { TModal } from '../Modal'
import StudentInfoModal from './StudentInfoModal'
import TIPGroupModal from './TIPGroupModal'
import ChangeTIPGroup from './ChangeTIPGroup'
import StudentProfileClassView from './StudentProfileClassView'
import { convertLearningGradeToGroupName } from 'utils/TIP'
import { assignLearningLevel } from 'actions'
import { useComponentVisible } from 'utils/customHooks'
import moment from 'moment'

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

enum MODAL_TYPE {
	ASSIGNED_GROUPS_INFO = 'assigned_groups-info',
	TIP_GROUPS = 'tip_groups',
	CHANGE_GROUP = 'change_group',
	STUDENT_PROFILE = 'student_profile'
}

const ClassViewCard: React.FC<P> = ({ std, setLearningLevel }) => {
	const [modal_type, setModalType] = useState('')
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	const [current_grade, setCurrentGrade] = useState<TIPGrades>()
	const [selected_grade, setSelectedGrade] = useState<TIPGrades>()
	const [selected_subject, setSelectSubject] = useState<TIPSubjects>()

	const reAssignGrade = () => {
		const {
			is_oral: current_oral_value,
			history: current_history,
			grade
		} = std?.targeted_instruction?.learning_level?.[selected_subject]
		const is_oral = selected_grade === 'Oral Test' ? true : current_oral_value ? true : false
		const timestamp = moment().format('YYYY-MM-DD')
		const history: TIPGradesHistory = {
			...current_history,
			[timestamp]: {
				type: 'Manual',
				grade: grade
			}
		}
		setLearningLevel(std.id, selected_subject, selected_grade, is_oral, history)
		setIsComponentVisible(false)
	}

	return (
		<>
			{isComponentVisible && (
				<TModal>
					{modal_type === MODAL_TYPE.ASSIGNED_GROUPS_INFO && (
						<div ref={ref}>
							<StudentInfoModal
								learning_levels={std.targeted_instruction.learning_level}
								setCurrentGrade={setCurrentGrade}
								setModalType={setModalType}
								setSelectSubject={setSelectSubject}
							/>
						</div>
					)}
					{modal_type === MODAL_TYPE.TIP_GROUPS && (
						<div ref={ref}>
							<TIPGroupModal
								subject={selected_subject}
								setSelectedGrade={setSelectedGrade}
								setModalType={setModalType}
							/>
						</div>
					)}
					{modal_type === MODAL_TYPE.CHANGE_GROUP && (
						<div ref={ref}>
							<ChangeTIPGroup
								subject={selected_subject}
								selected_grade={selected_grade}
								current_grade={current_grade}
								reAssignGrade={reAssignGrade}
							/>
						</div>
					)}
					{modal_type === MODAL_TYPE.STUDENT_PROFILE && (
						<div ref={ref}>
							<StudentProfileClassView
								setIsComponentVisible={setIsComponentVisible}
								learning_levels={std.targeted_instruction.learning_level}
								std={std}
							/>
						</div>
					)}
				</TModal>
			)}
			<div className="items-center text-xs w-full mt-4 flex flex-row justify-around shadow-lg">
				<div className="w-2/5 md:w-6/12 flex flex-row justify-between items-center m-2">
					<div className="font-bold text-center">{std.Name}</div>
					<div
						className="rounded-full bg-white h-7 w-7 shadow-lg ml-1 flex justify-center items-center cursor-pointer"
						onClick={() => (
							setModalType(MODAL_TYPE.STUDENT_PROFILE), setIsComponentVisible(true)
						)}>
						Tag
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
										'bg-gray-600': grade === 'Remediation Not Needed'
									})}
									onClick={() => {
										setIsComponentVisible(true),
											setModalType(MODAL_TYPE.ASSIGNED_GROUPS_INFO)
									}}>
									{grade === 'Remediation Not Needed' ? 'none' : grade}
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
