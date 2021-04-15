import React from 'react'
import clsx from 'clsx'
import { User } from 'assets/icons'

interface P {
	filtered_students: MISStudent[]
	targeted_instruction: RootReducerState['targeted_instruction']

	setType: (type: Types) => void
}

enum Types {
	SKILL_VIEW,
	CHILD_VIEW,
	SINGLE_STD_VIEW,
	SINGLE_SLO_VIEW
}

const ChildView: React.FC<P> = ({ filtered_students, targeted_instruction, setType }) => {
	return (
		<div className="w-full">
			<div className="bg-blue-tip-brand text-white flex flex-row justify-between items-center w-full py-2">
				<div className="w-1/3 flex justify-center font-bold">Names</div>
				<div className="w-2/3 flex flex-row justify-between">
					{Object.entries(targeted_instruction.quizzes)
						.slice(0, 2)
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
			{filtered_students.map((std, index) => (
				<div
					key={index}
					className="flex flex-row justify-between w-full items-center bg-gray-100 mb-1"
					onClick={() => setType(Types.SINGLE_STD_VIEW)}>
					<div className="w-1/3 flex justify-center">
						<img className="h-10 w-10 mr-5" src={User} />
						<div className="flex flex-col justify-between">
							<div className="font-bold">{std.Name}</div>
							<div className="">{std.RollNumber}</div>
						</div>
					</div>
					<div className="w-2/3 flex flex-row justify-around">
						{Object.entries(std.targeted_instruction.quiz_result)
							.slice(0, 3)
							.map(([quiz_id, quiz]) => {
								const percentage = (quiz.obtain_marks / quiz.total_marks) * 100
								return (
									<div
										key={quiz_id}
										className={clsx(
											'flex flex-row justify-center items-center py-4 w-1/3',
											{
												'bg-green-250': percentage >= 80,
												'bg-yellow-250': percentage >= 40
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
		</div>
	)
}

export default ChildView
