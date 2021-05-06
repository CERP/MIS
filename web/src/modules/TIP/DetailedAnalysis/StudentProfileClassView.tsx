import React from 'react'
import clsx from 'clsx'
import StudentProfileHeader from './StudentProfileHeader'
import { convertLearningGradeToGroupName } from 'utils/TIP'

interface P {
	std: MISStudent
	learning_levels: MISStudent['targeted_instruction']['learning_level']

	setIsComponentVisible: (value: boolean) => void
}

const StudentProfileClassView: React.FC<P> = ({ std, learning_levels, setIsComponentVisible }) => {
	return (
		<div className="flex flex-col rounded-t-xl padding-3 bg-white">
			<StudentProfileHeader std={std} setIsComponentVisible={setIsComponentVisible} />
			<div>
				<div className="text-xs md:text-base lg:text-lg w-full">
					{Object.entries(learning_levels || {}).map(([sub, grade_obj], index) => {
						const is_oral = grade_obj.is_oral ? 'yes' : 'No'
						const sorted_history = Object.keys(grade_obj?.history || {}).sort((a, b) =>
							a.localeCompare(b, 'en', { numeric: true })
						)
						const previous_grade = convertLearningGradeToGroupName(
							grade_obj?.history?.[sorted_history[sorted_history.length - 1]]
								?.grade ?? grade_obj?.grade
						)
						const current_grade =
							Object.keys(grade_obj?.history || {}).length === 0
								? 'Not Reassigned'
								: convertLearningGradeToGroupName(grade_obj?.grade)

						return (
							<div
								key={index}
								className="p-2 flex flex-row justify-between items-center">
								<div className="w-1/4 font-bold flex justify-center items-center">
									{sub}
								</div>
								<div
									className={clsx(
										'w-1/4 font-bold flex justify-center items-center',
										{
											'text-red-tip-brand': is_oral === 'yes',
											'text-gray-600': is_oral === 'No'
										}
									)}>
									{is_oral}
								</div>
								<div className="w-1/4 flex flex-wrap justify-center items-center px-3 py-1">
									<div
										className={clsx(
											'w-11/12 text-white flex flex-wrap justify-center rounded-md items-center shadow-lg cursor-pointer text-xs md:text-sm lg:text-base px-3 py-2',
											{
												'bg-light-blue-tip-brand':
													previous_grade === 'Blue',
												'bg-yellow-tip-brand': previous_grade === 'Yellow',
												'bg-green-tip-brand': previous_grade === 'Green',
												'bg-orange-tip-brand': previous_grade === 'Orange',
												'bg-gray-400': previous_grade === 'Oral',
												'bg-gray-600':
													previous_grade === 'Remediation Not Needed'
											}
										)}>
										{previous_grade === 'Remediation Not Needed'
											? 'none'
											: previous_grade}
									</div>
								</div>
								<div className="w-1/4 flex flex-wrap justify-center items-center px-3 py-1">
									<div
										className={clsx(
											`w-11/12 text-white flex flex-wrap justify-center rounded-md items-center shadow-lg cursor-pointer text-xs md:text-sm lg:text-base ${current_grade === 'Not Reassigned'
												? 'py-0 px-1 text-center'
												: 'py-2 px-3'
											}`,
											{
												'bg-light-blue-tip-brand': current_grade === 'Blue',
												'bg-yellow-tip-brand': current_grade === 'Yellow',
												'bg-green-tip-brand': current_grade === 'Green',
												'bg-orange-tip-brand': current_grade === 'Orange',
												'bg-gray-400': current_grade === 'Oral',
												'bg-gray-600':
													current_grade === 'Remediation Not Needed',
												'bg-gray-300 text-red-tip-brand':
													current_grade === 'Not Reassigned'
											}
										)}>
										{current_grade === 'Remediation Not Needed'
											? 'none'
											: current_grade}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default StudentProfileClassView
