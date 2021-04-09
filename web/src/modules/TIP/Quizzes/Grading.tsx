import React, { useMemo, useRef, useState } from 'react'
import Card from '../Card'
import { connect } from 'react-redux'
import { getStudentsByGroup, convertLearningLevelToGrade } from 'utils/TIP'
import SingleStdGrading from './SingleStdGrading'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import './style.css'

interface P {
	students: RootDBState['students']
}

type PropsType = P & RouteComponentProps

const Grading: React.FC<PropsType> = ({ match, history, students }) => {
	const childRef = useRef(null)
	const url = match.url.split('/')
	const [std_result, setStdResult] = useState({})
	const { subject, class_name, quiz_id } = match.params as Params
	const group = convertLearningLevelToGrade(class_name ? (class_name as TIPLevels) : 'Oral')

	const filtered_students = useMemo(() => getStudentsByGroup(students, group, subject), [subject])

	const onSave = () => {
		history.push(`/${url[1]}/${url[2]}/${class_name}/${subject}/${quiz_id}/grading/result`)
	}
	console.log('acha', std_result)
	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} subject={subject} lesson_name="" lesson_no="" />
			<div className="p-4 w-full">
				<div className="bg-blue-tip-brand flex flex-row justify-around text-sm md:text-base lg:text-lg text-white rounded py-2 font-bold">
					<div>Students</div>
					<div>Marks Obtained</div>
				</div>
				{Object.values(filtered_students).map(std => (
					<SingleStdGrading
						key={std.id}
						student={std}
						quiz_id={quiz_id}
						ref={childRef}
						std_result={std_result}
						setStdResult={setStdResult}
					/>
				))}
			</div>
			<div className="w-full fixed bottom-0 flex flex-row justify-between">
				<button className="w-11/13 bg-blue-tip-brand text-white border-none p-3 font-bold text-sm md:text-base lg:text-lg">
					Reset
				</button>
				<button
					className="w-11/13 bg-blue-tip-brand text-white border-none p-3 font-bold text-sm md:text-base lg:text-lg"
					onClick={onSave}>
					Save and Continue
				</button>
			</div>
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	students: state.db.students
}))(withRouter(Grading))
