import React, { useState } from 'react'
import clsx from 'clsx'
import { User } from 'assets/icons'

interface P {
	filtered_students: MISStudent[]
	targeted_instruction: RootReducerState['targeted_instruction']

	setType: (type: Types) => void
	setSelectedStd: (std: MISStudent) => void
}

enum Types {
	SKILL_VIEW,
	CHILD_VIEW,
	SINGLE_STD_VIEW,
	SINGLE_SLO_VIEW
}

const ChildView: React.FC<P> = ({
	filtered_students,
	targeted_instruction,
	setType,
	setSelectedStd
}) => {
	const [page_num, setPageNum] = useState(1)

	return (
		<div className="w-full">
			<div className="bg-blue-tip-brand text-white flex flex-row justify-between items-center w-full py-2">
				<div className="w-1/3 flex justify-center font-bold">Names</div>
				<div className="w-2/3 flex flex-row justify-start">
					{Object.entries(targeted_instruction.quizzes)
						.slice(0, 3)
						.map(([quiz_id, quiz]) => (
							<div
								key={quiz_id}
								className="flex flex-col justify-start text-center text-xs md:text-sm lg:text-base w-1/3">
								<div>Quiz {quiz.quiz_order}</div>
								<div>{quiz.quiz_title}</div>
							</div>
						))}
				</div>
			</div>
			{filtered_students.map(std => (
				<div
					key={std.id}
					className="flex flex-row justify-between w-full items-center bg-gray-100 mb-1"
					onClick={() => (setType(Types.SINGLE_STD_VIEW), setSelectedStd(std))}>
					<div className="w-1/3 flex justify-center items-center">
						<div className="flex flex-row w-full md:w-3/5 lg:w-1/2 items-center">
							<img className="h-10 w-10 mr-2" src={User} />
							<div className="flex flex-col justify-between">
								<div className="font-bold">{std.Name}</div>
								<div className="">{std.RollNumber}</div>
							</div>
						</div>
					</div>
					<div className="w-2/3 flex flex-row justify-start ml-1">
						{Object.entries(std.targeted_instruction.quiz_result)
							.slice(0, 3)
							.map(([quiz_id, quiz]) => {
								const percentage = (quiz.obtain_marks / quiz.total_marks) * 100
								return (
									<div
										key={quiz_id}
										className={clsx(
											'flex flex-row justify-center items-center py-4 h-10 ml-1 w-1/3',
											{
												'bg-green-250': percentage >= 75,
												'bg-yellow-250': percentage < 75 && percentage >= 40
											},
											'bg-red-250'
										)}>
										{percentage}%
									</div>
								)
							})}
					</div>
				</div>
			))}
			<div className="bg-gray-100 h-16 px-2 fixed w-full flex items-center bottom-0">
				<div className="font-bold text-sea-green-tip-brand text-lg md:text-base lg:text-lg">
					Pages
				</div>
				{[1, 2, 3].map(no => (
					<div
						key={no}
						className={`cursor-pointer shadow-lg ml-5 rounded-md bg-white py-2 px-4 border-solid border-sea-green-tip-brand text-sea-green-tip-brand`}>
						{no}
					</div>
				))}
			</div>
		</div>
	)
}

export default ChildView
