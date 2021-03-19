import React from 'react'
import { getClassnameFromSectionId } from 'utils/TIP'
import GroupViewCard from '../DetailedAnalysis/GroupViewCard'

interface P {
	students: MISStudent[]
	sorted_sections: AugmentedSection[]
}

const GroupViewPrintable: React.FC<P> = ({ students, sorted_sections }) => {
	return (
		<>
			<div className="h-10 items-center text-white w-full mt-4 flex flex-row justify-around hidden print:block">
				<table className="w-full border border-black">
					<thead>
						<tr>
							<div className="h-10 items-center w-full mt-4 flex flex-row justify-around">
								<div className="w-6/12 flex flex-row justify-between px-3 items-center m-2">
									<div className="font-bold text-center">Name</div>
								</div>
								<div className="flex flex-row justify-between w-6/12 m-4">
									<td className="font-bold">Roll no</td>
									<td className="font-bold">Class</td>
								</div>
							</div>
						</tr>
					</thead>
					<tbody>
						<tr>
							{Object.values(students || {}).map(std => {
								const class_name = getClassnameFromSectionId(
									sorted_sections,
									std.section_id
								)
								return (
									<GroupViewCard
										key={std.id}
										name={std.Name}
										roll_no={std.RollNumber}
										class_name={class_name}
									/>
								)
							})}
						</tr>
					</tbody>
				</table>
			</div>
		</>
	)
}

export default GroupViewPrintable
