import React, { useMemo } from 'react'
import Card from '../../Card'
import { connect } from 'react-redux'
import { getStudentsByGroup, convertLearningLevelToGrade } from 'utils/TIP'
import SingleStdResult from './SingleStdResult'
import { RouteComponentProps } from 'react-router-dom'

interface P {
	students: RootDBState['students']
	targeted_instruction: RootReducerState['targeted_instruction']
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = ({ match, students, targeted_instruction }) => {
	const { subject, class_name, quiz_id } = match.params as Params
	const group = convertLearningLevelToGrade(class_name ? (class_name as TIPLevels) : 'Oral')

	const filtered_students = useMemo(() => getStudentsByGroup(students, group, subject), [subject])
	const total_marks =
		targeted_instruction?.quizzes?.[class_name]?.[subject]?.[quiz_id].total_marks

	return (
		<div className="bg-white flex flex-wrap content-between mt-20">
			<Card class_name={class_name} subject={subject} />
			<div className="p-4 w-full">
				<div className="pr-2 bg-blue-tip-brand flex flex-row justify-around text-sm md:text-base lg:text-lg text-white rounded py-2 font-bold">
					<div>Students</div>
					<div>Marks Obtained</div>
					<div>Progress</div>
				</div>
				{Object.values(filtered_students).map(std => (
					<SingleStdResult
						key={std.id}
						student={std}
						class_name={class_name}
						subject={subject}
						quiz_id={quiz_id}
						total_marks={total_marks}
					/>
				))}
			</div>
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	targeted_instruction: state.targeted_instruction
}))(Result)
