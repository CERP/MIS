import React, { useState } from 'react'
import ClassViewCard from './ClassViewCard'
import ClassViewPrintable from '../../Printable/ClassView'
import Headings from '../../Headings'
import { isValidStudent } from 'utils'
interface P {
	students: RootDBState['students']
	sorted_sections: AugmentedSection[]
}

const ClassView: React.FC<P> = ({ students, sorted_sections }) => {
	const [section_id, setSectionId] = useState('')
	const total_students = Object.values(students ?? {}).filter(
		s =>
			s.section_id === section_id &&
			isValidStudent(s) &&
			s.Active &&
			(s.tags ? !s.tags['prospective'] : true)
	).length

	return (
		<>
			<div className="flex flex-row justify-around w-full print:hidden mb-5">
				<select className="tw-select" onChange={e => setSectionId(e.target.value)}>
					<option value="">Select Class</option>
					{sorted_sections.map(class_obj => {
						return (
							<option key={class_obj.class_id} value={class_obj.id}>
								{class_obj.namespaced_name}
							</option>
						)
					})}
				</select>
			</div>
			<Headings sub_heading={`Total Students = ${total_students}`} />
			<div className="h-10 items-center text-white text-xs bg-blue-tip-brand w-full mt-4 flex flex-row justify-around print:hidden">
				<div className="w-4/12 md:w-6/12 flex flex-row justify-between px-3 items-center m-2 text-sm md:text-base lg:text-lg">
					<div className="font-bold text-center">Name</div>
				</div>
				<div className="flex flex-row justify-between w-8/12 md:w-6/12 m-4 text-sm md:text-base lg:text-lg">
					{['Urdu', 'Maths', 'Eng'].map(sub => (
						<div key={sub} className="font-bold w-2/6 flex justify-center items-center">
							{sub}
						</div>
					))}
				</div>
			</div>
			<div className="flex flex-col print:hidden overflow-y-auto h-80">
				{Object.values(students ?? {})
					.filter(t => t.section_id === section_id)
					.map(std => (
						<ClassViewCard key={std.id} std={std} />
					))}
			</div>
			<ClassViewPrintable students={students} section_id={section_id} />
			<div className="w-full mt-5 text-center print:hidden">
				<button
					className="bg-blue-tip-brand font-bold text-sm md:text-base lg:text-lg border-none rounded-md text-white py-2 w-11/12 mb-4"
					onClick={() => window.print()}>
					Print
				</button>
			</div>
		</>
	)
}

export default ClassView
