import React from 'react'
import StudentProfileHeader from './StudentProfileHeader'
import { convertLearningGradeToGroupName } from 'utils/TIP'
import StudentProfileRow from './StudentProfileRow'

interface P {
	std: MISStudent
	learning_levels: MISStudent['targeted_instruction']['learning_level']

	setIsComponentVisible: (value: boolean) => void
}

const StudentProfileClassView: React.FC<P> = ({ std, learning_levels, setIsComponentVisible }) => {
	return (
		<div className="flex flex-col rounded-t-xl padding-3 bg-white">
			<StudentProfileHeader std={std} setIsComponentVisible={setIsComponentVisible} />
			<div>
				<div className="text-xs md:text-base lg:text-lg w-full">
					{Object.entries(learning_levels || {}).map(([subject, grade_obj], index) => {
						const is_oral = grade_obj.is_oral ? true : false
						//sort history object ... our recent entry will be at end
						const sorted_history = Object.keys(grade_obj?.history || {}).sort((a, b) =>
							a.localeCompare(b, 'en', { numeric: true })
						)
						// if we don't have history object we will get our previous grade from grade in learning_level => MISStudent
						const previous_grade = convertLearningGradeToGroupName(
							grade_obj?.history?.[sorted_history[sorted_history.length - 1]]
								?.grade ?? grade_obj?.grade
						)
						// if we don't have history object it means we didn't do reassignment
						// our current grade will be Not Reassigned
						// else we will get our current grade from grade in learning_level => MISStudent
						const current_grade =
							Object.keys(grade_obj?.history || {}).length === 0
								? 'Not Reassigned'
								: grade_obj?.history[sorted_history?.[sorted_history?.length - 1]]
									?.type === 'Graduation'
									? 'Not Reassigned'
									: convertLearningGradeToGroupName(grade_obj?.grade)

						return (
							<StudentProfileRow
								key={index}
								subject={subject}
								is_oral={is_oral}
								current_grade={current_grade}
								previous_grade={previous_grade}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default StudentProfileClassView
