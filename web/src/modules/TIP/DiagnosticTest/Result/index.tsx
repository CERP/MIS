import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import { getClassnameFromSectionId } from 'utils/TIP'
import Classes from '../../Classes'
import Card from '../../Card'
import Headings from '../../Headings'
import Subjects from '../../Subjects'

interface P {
	classes: RootDBState['classes']
	targeted_instruction: RootReducerState['targeted_instruction']
}

type PropsType = P & RouteComponentProps

const DiagnosticTestResult: React.FC<PropsType> = ({ match, targeted_instruction, classes }) => {
	const [sectionId, setSectionId] = useState('')
	const url = match.url.split('/')

	const valid_classes = Object.values(targeted_instruction.tests)
		.filter(t => t.type === 'Diagnostic')
		.map(x => x.grade)
		.reduce<Record<string, boolean>>(
			(agg, curr) => ({
				...agg,
				[curr.toLowerCase()]: true
			}),
			{}
		)

	// for all the sections in the school, we will only show ones which have
	// a diagnostic test for it. the name has to be close enough to one of the valid_classes
	// which we extract from the diagnostic tests
	const sorted_sections = useMemo(() => getSectionsFromClasses(classes), [])
		.sort((a, b) => (a.classYear || 0) - (b.classYear || 0))
		.filter(s => {
			return valid_classes[s.className.toLowerCase()]
		})

	const class_name = useMemo(() => getClassnameFromSectionId(sorted_sections, sectionId), [
		sectionId
	])
	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} />
			<Headings
				heading="Starting Test Result"
				sub_heading={
					class_name
						? 'Select the subject you want to evaluate'
						: 'Select the class you want to evaluate'
				}
			/>
			{class_name ? (
				<Subjects
					class_name={class_name}
					section_id={sectionId}
					url={url}
					targeted_instruction={targeted_instruction}
				/>
			) : (
				<Classes setSectionId={setSectionId} sortedSections={sorted_sections} />
			)}
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	classes: state.db.classes,
	targeted_instruction: state.targeted_instruction
}))(DiagnosticTestResult)
