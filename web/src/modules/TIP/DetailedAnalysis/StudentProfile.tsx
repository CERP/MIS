import React from 'react'
import clsx from 'clsx'
import { BackArrow, WhiteUser } from 'assets/icons'
import { convertLearningGradeToGroupName } from 'utils/TIP'
interface P {
	std: MISStudent
	learning_levels: MISStudent['targeted_instruction']['learning_level']

	setIsComponentVisible: (value: boolean) => void
}

const StudentProfileModal: React.FC<P> = ({ std, learning_levels, setIsComponentVisible }) => {
	return (
		<div className="flex flex-col rounded-t-xl padding-3 bg-white">
			<div className="p-2 shadow-lg text-center rounded-t-lg bg-light-blue-tip-brand text-white flex flex-col justify-between items-center text-sm md:text-lg lg:text-lg">
				<div className="w-full py-2 pl-4 flex flex-row justify-between">
					<div
						className="w-7 h-7 bg-white rounded-full shadow-lg flex justify-center items-center"
						onClick={() => setIsComponentVisible(false)}>
						<img className="h-3 w-3" src={BackArrow} />
					</div>
					<div className="flex justify-center items-center flex-col">
						<div className="flex items-center justify-center">
							<img
								className="rounded-full h-16 w-16"
								src={std?.ProfilePicture?.url ?? WhiteUser}
								alt="img"
							/>
						</div>
						<div className="text-xs md:text-base lg:text-lg">{std?.Name}</div>
						<div className="text-xs md:text-base lg:text-lg">{std?.RollNumber}</div>
					</div>
					<div></div>
				</div>
				<div className="text-xs md:text-xs lg:text-lg flex flex-row justify-between w-full pt-2 font-bold">
					<div className="pl-3">Subjects</div>
					<div>Oral Test</div>
					<div>Sorting Result</div>
					<div>Reassigned to</div>
				</div>
			</div>
			<div>
				<div className="text-xs md:text-base lg:text-lg w-full">
					{Object.entries(learning_levels || {}).map(([sub, grade_obj], index) => {
						const is_oral = grade_obj.is_oral ? 'yes' : 'No'
						const sorted_history = Object.keys(grade_obj?.history || {}).sort((a, b) =>
							a.localeCompare(b, 'en', { numeric: true })
						)
						console.log(sorted_history)
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

export default StudentProfileModal
