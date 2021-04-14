import React, { useState, useMemo } from 'react'
import Card from '../../Card'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import Headings from '../../Headings'
import ChildView from './ChildView'
import SkillView from './SkillView'
import SingleSloView from './SkillView/SingleSloView'
import SingleStdView from './ChildView/SingleStdView'

interface P {
	students: RootDBState['students']
	targeted_instruction: RootReducerState['targeted_instruction']
}

type PropsType = P & RouteComponentProps<Params>

enum Types {
	SKILL_VIEW,
	CHILD_VIEW,
	SINGLE_STD_VIEW,
	SINGLE_SLO_VIEW
}

const DetailedQuizResult: React.FC<PropsType> = ({ match, targeted_instruction }) => {
	const { class_name, subject } = match.params as Params
	const [type, setType] = useState(Types.SKILL_VIEW)
	const [selected_slo, setSelectedSlo] = useState('')

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} subject={subject} lesson_name="" lesson_no="" />
			<Headings heading="Results" sub_heading="" />
			<div className="flex flex-row justify-around w-full my-3 mx-6">
				<button
					className={
						type === Types.SKILL_VIEW
							? 'border-none rounded-3xl text-white bg-sea-green-tip-brand py-2 px-6 outline-none'
							: 'rounded-3xl text-sea-green-tip-brand broder border-solid border-sea-green-tip-brand py-2 px-6 bg-white outline-none'
					}
					onClick={() => setType(Types.SKILL_VIEW)}>
					Skill View
				</button>
				<button
					className={
						type === Types.CHILD_VIEW
							? 'border-none rounded-3xl text-white bg-sea-green-tip-brand py-2 px-6 outline-none'
							: 'rounded-3xl text-sea-green-tip-brand broder border-solid border-sea-green-tip-brand py-2 px-6 bg-white outline-none'
					}
					onClick={() => setType(Types.CHILD_VIEW)}>
					Child View
				</button>
			</div>
			{type === Types.SKILL_VIEW && (
				<SkillView
					quizzes={targeted_instruction.quizzes}
					setSelectedSlo={setSelectedSlo}
					setType={setType}
				/>
			)}
			{type === Types.SINGLE_SLO_VIEW && <SingleSloView slo={selected_slo} />}
			{type === Types.CHILD_VIEW && <ChildView setType={setType} />}
			{type === Types.SINGLE_STD_VIEW && <SingleStdView setType={setType} />}
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	targeted_instruction: state.targeted_instruction
}))(DetailedQuizResult)
