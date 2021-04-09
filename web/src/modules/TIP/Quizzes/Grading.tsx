import React, { useState, useMemo } from 'react'
import Card from '../Card'
import { connect } from 'react-redux'
import { getStudentsByGroup } from 'utils/TIP'
import SingleStdGrading from './SingleStdGrading'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import './style.css'

interface P {
	students: RootDBState['students']
}

type PropsType = P & RouteComponentProps

const class_map: Record<TIPLevels, TIPGrades> = {
	'Level KG': 'KG',
	'Level 1': '1',
	'Level 2': '2',
	'Level 3': '3',
	Oral: 'Oral Test',
	'Remediation Not Needed': 'Not Needed'
}

const Grading: React.FC<PropsType> = ({ match, students }) => {
	const [range, setRange] = useState('0')
	const { subject, class_name } = match.params as Params

	const group = class_map[class_name ? (class_name as TIPLevels) : 'Oral']

	const filtered_students = useMemo(() => getStudentsByGroup(students, group, subject), [subject])

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
						std_name={std.Name}
						roll_num={std.RollNumber}
						range={range}
						setRange={setRange}
					/>
				))}
			</div>
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	students: state.db.students
}))(withRouter(Grading))
