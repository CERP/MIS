import React from 'react'
import { connect } from 'react-redux'
import Headings from '../Headings'
import Card from '../Card'
import Subjects from '../Subjects'

interface P {
	targeted_instruction: RootReducerState['targeted_instruction']
}

const OralTest: React.FC<P> = () => {
	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card />
			<Headings heading="Oral Test" sub_heading={'Select the subject you want to evaluate'} />
			<Subjects class_name="" section_id="" />
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(OralTest)
