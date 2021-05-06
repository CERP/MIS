import React from 'react'
import StudentProfileHeader from './StudentProfileHeader'
import { convertLearningGradeToGroupName } from 'utils/TIP'
import StudentProfileRow from './StudentProfileRow'

interface P {
	std: MISStudent
	subject: TIPSubjects
	learning_level: MISStudent['targeted_instruction']['learning_level']['subject']

	setIsComponentVisible: (value: boolean) => void
}

const StudentProfileGroupView: React.FC<P> = ({
	std,
	subject,
	learning_level,
	setIsComponentVisible
}) => {
	const is_oral = learning_level.is_oral ? 'yes' : 'No'
	const sorted_history = Object.keys(learning_level?.history || {}).sort((a, b) =>
		a.localeCompare(b, 'en', { numeric: true })
	)
	const previous_grade = convertLearningGradeToGroupName(
		learning_level?.history?.[sorted_history[sorted_history.length - 1]]?.grade ??
		learning_level?.grade
	)
	const current_grade =
		Object.keys(learning_level?.history || {}).length === 0
			? 'Not Reassigned'
			: convertLearningGradeToGroupName(learning_level?.grade)

	return (
		<div className="flex flex-col rounded-t-xl padding-3 bg-white">
			<StudentProfileHeader std={std} setIsComponentVisible={setIsComponentVisible} />
			<div>
				<StudentProfileRow
					subject={subject}
					is_oral={is_oral}
					current_grade={current_grade}
					previous_grade={previous_grade}
				/>
			</div>
		</div>
	)
}

export default StudentProfileGroupView
