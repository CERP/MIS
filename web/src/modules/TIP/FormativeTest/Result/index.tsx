import React, { useState } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import Headings from '../../Headings'
import Levels from '../../Levels'
import Card from '../../Card'
import Subjects from '../../Subjects'

interface P {
	targeted_instruction: RootReducerState['targeted_instruction']
}

type PropsType = P & RouteComponentProps

const FormativeTestResult: React.FC<PropsType> = ({ match, targeted_instruction }) => {
	const [class_name, setClassName] = useState('')
	const url = match.url.split('/')

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} />
			<Headings
				heading="Midpoint Test Result"
				sub_heading={
					class_name
						? 'Select the subject you want to evaluate'
						: 'Select the Group you want to evaluate'
				}
			/>
			{class_name ? (
				<Subjects
					class_name={class_name}
					url={url}
					targeted_instruction={targeted_instruction}
				/>
			) : (
				<Levels setSectionId={setClassName} />
			)}
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(FormativeTestResult)
