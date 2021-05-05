import React from 'react'
import clsx from 'clsx'
import { BackArrow, BlackUser } from 'assets/icons'
import { convertLearningGradeToGroupName } from 'utils/TIP'
interface P {
	learning_levels: MISStudent['targeted_instruction']['learning_level']

	setIsComponentVisible: (value: boolean) => void
}

const StudentProfileModal: React.FC<P> = ({ learning_levels, setIsComponentVisible }) => {
	return (
		<div className="flex flex-col rounded-t-xl padding-3 bg-white">
			<div className="p-2 shadow-lg text-center rounded-t-lg bg-light-blue-tip-brand text-white flex flex-col justify-between items-center text-sm md:text-lg lg:text-lg">
				<div className="w-full py-2 pl-4 flex flex-row justify-between">
					<div
						className="w-7 h-7 bg-white rounded-full shadow-lg flex justify-center items-center"
						onClick={() => setIsComponentVisible(false)}>
						<img className="h-3 w-3" src={BackArrow} />
					</div>
					<div className="flex justify-between flex-col mr-5">
						<img
							className="-top-10 left-36 absolute flex justify-center rounded-full h-16 w-16"
							src={BlackUser}
							alt="img"
						/>
						<div className="text-xs md:text-base lg:text-lg">Name</div>
						<div className="text-xs md:text-base lg:text-lg">Roll Num</div>
					</div>
					<div></div>
				</div>
				<div className="text-xs md:text-xs lg:text-lg flex flex-row justify-between w-full pt-2 font-bold">
					<div>Subjects</div>
					<div>Oral Test</div>
					<div>Sorting Result</div>
					<div>Reassigned to</div>
				</div>
			</div>
			<div>
				<div className="text-xs md:text-base lg:text-lg w-full">
					{Object.entries(learning_levels || {}).map(([sub, grade_obj]) => {
						const grade = convertLearningGradeToGroupName(grade_obj.grade)
						const is_oral = grade_obj.is_oral ? 'yes' : 'No'
						return (
							<div
								key={grade}
								className="p-2 flex flex-row justify-between items-center">
								<div className="w-1/4 font-bold">{sub}</div>
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
											'w-11/12 text-white flex flex-wrap justify-center rounded-md items-center shadow-lg cursor-pointer text-sm md:text-base lg:text-lg px-3 py-1',
											{
												'bg-light-blue-tip-brand': grade === 'Blue',
												'bg-yellow-tip-brand': grade === 'Yellow',
												'bg-green-tip-brand': grade === 'Green',
												'bg-orange-tip-brand': grade === 'Orange',
												'bg-gray-600': grade === 'Remediation Not Needed'
											}
										)}>
										{grade === 'Remediation Not Needed' ? 'none' : grade}
									</div>
								</div>
								<div className="w-1/4 flex flex-wrap justify-center items-center px-3 py-1">
									<div
										className={clsx(
											'w-11/12 text-white flex flex-wrap justify-center rounded-md items-center shadow-lg cursor-pointer text-sm md:text-base lg:text-lg px-3 py-1',
											{
												'bg-light-blue-tip-brand': grade === 'Blue',
												'bg-yellow-tip-brand': grade === 'Yellow',
												'bg-green-tip-brand': grade === 'Green',
												'bg-orange-tip-brand': grade === 'Orange',
												'bg-gray-600': grade === 'Remediation Not Needed'
											}
										)}>
										{grade === 'Remediation Not Needed' ? 'none' : grade}
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
