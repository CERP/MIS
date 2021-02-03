import React, { useState } from 'react';
import { getGradesFromTests } from 'utils/TIP'
import { connect } from 'react-redux'
import Headings from '../Headings'
import Levels from '../Levels'
import Card from '../Card'
import Subjects from '../Subjects'

interface P {
	targeted_instruction: RootReducerState["targeted_instruction"]
}

const SummativeTest: React.FC<P> = (props) => {
	const [class_name, setClassName] = useState('');
	const grades = getGradesFromTests(props.targeted_instruction)

	return <div className="flex flex-wrap content-between">
		<Card class_name={class_name} subject='' />
		<Headings heading="Summative Test" sub_heading={class_name ? "Select the subject you want to evaluate" : "Select the Group you want to evaluate"} />
		{class_name ?
			<Subjects class_name={class_name} section_id='' /> :
			<Levels
				setSectionId={setClassName}
				grades={grades}
			/>}
	</div>
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(SummativeTest)

