import React from 'react'
import clsx from 'clsx'
import { convertLearningGradeToGroupName } from 'utils/TIP'

interface P {
	learning_levels: MISStudent['targeted_instruction']['learning_level']

	setCurrentGrade: (grade: TIPGrades) => void
	setSelectSubject: (sub: TIPSubjects) => void
	setModalType: (modal_type: string) => void
}

const StudentInfoModal: React.FC<P> = ({
	learning_levels,
	setModalType,
	setCurrentGrade,
	setSelectSubject
}) => {
	const onEdit = (sub: TIPSubjects, grade: TIPGrades) => {
		setModalType('tip_groups')
		setCurrentGrade(grade)
		setSelectSubject(sub)
	}
	return (
		<div className="flex flex-col rounded-t-xl bg-gray-300 bg-white">
			<div className="text-center rounded-t-lg bg-blue-tip-brand h-12 md:h-16 text-white flex flex-row justify-around items-center text-sm md:text-lg">
				{['Subject', 'Group', 'Action'].map(item => (
					<div key={item}>{item}</div>
				))}
			</div>
			{Object.entries(learning_levels || {}).map(([sub, grade_obj]) => {
				const grade = convertLearningGradeToGroupName(grade_obj.grade)
				return (
					<div
						key={grade}
						className="mb-3 h-12 md:h-16 text-sm md:text-base bg-white flex flex-row justify-around items-center cursor-pointer font-bold text-blue-900 shadow-lg">
						<div className="w-4/12 text-center">{sub}</div>
						<div
							className={clsx('w-4/12 text-center', {
								'text-blue-tip-brand': grade === 'Blue',
								'text-yellow-tip-brand': grade === 'Yellow',
								'text-green-tip-brand': grade === 'Green',
								'text-orange-tip-brand': grade === 'Orange',
								'text-gray-400': grade === 'Oral',
								'text-gray-600': grade === 'Remediation Not Needed'
							})}>
							{grade}
						</div>
						<div
							className="w-4/12 text-center"
							onClick={() => onEdit(sub as TIPSubjects, grade_obj.grade)}>
							Edit
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default StudentInfoModal
