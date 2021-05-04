import React, { useMemo, useState } from 'react'
import { getStudentsByGroup, getClassnameFromSectionId } from 'utils/TIP'
import GroupViewPrintable from '../Printable/GroupView'
import GroupViewCard from './GroupViewCard'

interface P {
	students: RootDBState['students']
	sorted_sections: AugmentedSection[]
}

type OrderedGroupItem = {
	group: TIPGrades
	color: TIPLearningGroups
}

const ordered_groups: Array<OrderedGroupItem> = [
	{ group: 'KG', color: 'Blue' },
	{ group: '1', color: 'Yellow' },
	{ group: '2', color: 'Green' },
	{ group: '3', color: 'Orange' },
	{ group: 'Oral Test', color: 'Oral' },
	{ group: 'Not Needed', color: 'Remediation Not Needed' }
]

const subjects: TIPSubjects[] = ['English', 'Urdu', 'Maths']

const GroupView: React.FC<P> = ({ students, sorted_sections }) => {
	const [group, setGroup] = useState<TIPGrades>('1')
	const [subject, setSubject] = useState<TIPSubjects>('English')

	const filtered_students = useMemo(() => getStudentsByGroup(students, group, subject), [
		subject,
		group
	])

	return (
		<>
			<div className="flex flex-row justify-around w-full print:hidden">
				<select className="tw-select" onChange={e => setGroup(e.target.value as TIPGrades)}>
					<option value="">Group</option>
					{ordered_groups.map(ordered_group => (
						<option key={ordered_group.group} value={ordered_group.group}>
							{ordered_group.color}
						</option>
					))}
				</select>
				<select
					className="tw-select"
					onChange={e => setSubject(e.target.value as TIPSubjects)}>
					<option value="">Subject</option>
					{subjects.map(sub => (
						<option key={sub} value={sub}>
							{sub}
						</option>
					))}
				</select>
			</div>
			<div className="h-10 items-center text-white text-xs bg-blue-tip-brand w-full mt-4 flex flex-row justify-around print:hidden">
				<div className="w-6/12 flex flex-row justify-between px-3 items-center m-2 text-sm md:text-base lg:text-lg">
					<div className="font-bold text-center">Name</div>
				</div>
				<div className="flex flex-row justify-between w-6/12 m-4 text-sm md:text-base lg:text-lg font-bold">
					<div>Roll no</div>
					<div>Class</div>
				</div>
			</div>
			<div className="flex flex-col print:hidden overflow-y-auto h-80">
				{Object.values(filtered_students || {}).map(std => {
					const class_name = getClassnameFromSectionId(sorted_sections, std.section_id)
					return (
						<GroupViewCard
							key={std.id}
							name={std.Name}
							roll_no={std.RollNumber}
							class_name={class_name}
						/>
					)
				})}
			</div>
			<GroupViewPrintable students={filtered_students} sorted_sections={sorted_sections} />
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

export default GroupView
