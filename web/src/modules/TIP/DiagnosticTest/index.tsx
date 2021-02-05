import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import { getClassnameFromSectionId } from 'utils/TIP'
import Classes from '../Classes'
import Card from '../Card'
import Headings from '../Headings';
import Subjects from '../Subjects'

interface P {
	classes: RootDBState["classes"]
	targeted_instruction: RootReducerState['targeted_instruction']
}

// We can only do diagnostic tests for Classes which match the string they are assigned to
const DiagnosticTest: React.FC<P> = (props) => {
	const [sectionId, setSectionId] = useState('');

	const valid_classes = Object.values(props.targeted_instruction.tests)
		.filter(t => t.type === "Diagnostic")
		.map(x => x.grade)
		.reduce<Record<string, boolean>>((agg, curr) => ({
			...agg,
			[curr.toLowerCase()]: true
		}), {})

	// for all the sections in the school, we will only show ones which have 
	// a diagnostic test for it. the name has to be close enough to one of the valid_classes
	// which we extract from the diagnostic tests
	const sorted_sections = useMemo(() => getSectionsFromClasses(props.classes), [])
		.sort((a, b) => (a.classYear || 0) - (b.classYear || 0))
		.filter(s => {
			return valid_classes[s.className.toLowerCase()]
			/*
			const matching = Object.keys(valid_classes)
				.filter(c => {
					return s.className.toLowerCase().indexOf(c) > -1
				})
				.length

			return matching == 1
			*/
		})

	const class_name = useMemo(() => getClassnameFromSectionId(sorted_sections, sectionId), [sectionId])

	return <div className="flex flex-wrap content-between">
		<Card class_name={class_name} subject='' />
		<Headings
			heading="Starting Test"
			sub_heading={class_name ? "Select the subject you want to evaluate" :
				"Select the class you want to evaluate"}
		/>
		{class_name ?
			<Subjects class_name={class_name} section_id={sectionId} /> :
			<Classes
				setSectionId={setSectionId}
				sortedSections={sorted_sections}
			/>}
	</div>
}

export default connect((state: RootReducerState) => ({
	classes: state.db.classes,
	targeted_instruction: state.targeted_instruction
}))(DiagnosticTest)
