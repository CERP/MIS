import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getStudentsBySectionId, calculateResult, convertLearningGradeToGroupName } from 'utils/TIP'
import Groups from './Groups'
import Card from '../../Card'

interface P {
	students: RootDBState["students"]
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = (props) => {

	const { section_id, subject, class_name } = props.match.params as Params
	const students = useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id])
	const result: DiagnosticRes = useMemo(() => calculateResult(students, subject), [subject])

	return <div className="flex flex-wrap content-between">
		<Card class_name={class_name} subject={subject} lesson_name='' lesson_no='' />
		<div className="w-full">
			{Object.entries(result)
				.map(([key, value]) => {
					const group = convertLearningGradeToGroupName(key as TIPGrades)
					return <Groups key={key} color={group} level={key} students={value.students} />
				})
			}
		</div>
	</div>
}

export default connect((state: RootReducerState) => ({
	students: state.db.students
}))(withRouter(Result))
