import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import Headings from '../Headings'
import Card from '../Card'
import Subjects from '../Subjects'

interface P {
	targeted_instruction: RootReducerState['targeted_instruction']
}

type PropsType = P & RouteComponentProps

const OralTest: React.FC<PropsType> = ({ match, targeted_instruction }) => {
	const url = match.url.split('/')

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card />
			<Headings heading="Oral Test" sub_heading="Select the subject you want to evaluate" />
			<Subjects url={url} targeted_instruction={targeted_instruction} />
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(OralTest)
