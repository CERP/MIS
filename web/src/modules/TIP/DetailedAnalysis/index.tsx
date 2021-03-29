import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import Headings from '../Headings'
import Card from '../Card'
import GroupView from './GroupView'
import ClassView from './ClassView'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
interface P {
	classes: RootDBState['classes']
	students: RootDBState['students']
	targeted_instruction: RootReducerState['targeted_instruction']
}

const DetailedAnalysis: React.FC<P> = ({ classes, students, targeted_instruction }) => {
	const [view_type, setViewType] = useState('')

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

	return (
		<div className="bg-white h-full mt-20">
			<Card class_name="" subject="" lesson_name="" lesson_no="" />
			{view_type === '' && (
				<div className="py-10">
					<Headings
						heading=""
						sub_heading="Do you want to see Class view or Group view"
					/>
				</div>
			)}
			<div className="flex flex-row justify-around px-3 print:hidden">
				<button
					className={`border-none shadow-lg rounded-md p-3 outline-none ${view_type === 'class_view'
							? 'bg-sea-green-tip-brand text-white'
							: 'bg-white text-blue-900'
						}`}
					onClick={() => setViewType('class_view')}>
					Class View
				</button>
				<button
					className={`border-none shadow-lg rounded-md p-3 outline-none ${view_type === 'group_view'
							? 'bg-sea-green-tip-brand text-white'
							: 'bg-white text-blue-900'
						}`}
					onClick={() => setViewType('group_view')}>
					Group View
				</button>
			</div>
			{view_type === 'class_view' && (
				<div className="py-10">
					<Headings heading="" sub_heading="Select your Class" />
				</div>
			)}
			{view_type === 'group_view' && (
				<div className="py-10">
					<Headings heading="" sub_heading="Select your Group and Subject" />
				</div>
			)}
			{view_type === 'class_view' && (
				<ClassView sorted_sections={sorted_sections} students={students} />
			)}
			{view_type === 'group_view' && (
				<GroupView sorted_sections={sorted_sections} students={students} />
			)}
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	classes: state.db.classes,
	targeted_instruction: state.targeted_instruction
}))(DetailedAnalysis)
