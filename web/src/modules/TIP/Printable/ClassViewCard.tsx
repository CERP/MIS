import React from 'react'
import { convertLearningGradeToGroupName } from 'utils/TIP'

interface P {
	std: MISStudent
}

const ClassViewCard: React.FC<P> = ({ std }) => {
	return (
		<td className="h-10 items-center mt-4 flex flex-row justify-around border-b border-black">
			<div className="w-4/12 md:w-6/12 flex flex-row justify-between px-3 items-center m-2">
				<div className="font-bold text-center">{std.Name}</div>
			</div>
			<div className="flex flex-row justify-between w-8/12 md:w-6/12 m-4">
				{Object.entries(std?.targeted_instruction?.learning_level || {})
					.sort(([sub]) => sub.localeCompare(sub))
					.map(([, grade_obj]) => {
						const grade = convertLearningGradeToGroupName(grade_obj.grade)
						return (
							<div
								key={grade}
								className="w-2/6 flex justify-center items-center cursor-pointer">
								<div>{grade === 'Remediation Not Needed' ? 'none' : grade}</div>
							</div>
						)
					})}
			</div>
		</td>
	)
}

export default ClassViewCard
