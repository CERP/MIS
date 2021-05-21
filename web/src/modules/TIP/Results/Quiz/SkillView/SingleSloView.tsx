import React from 'react'
import clsx from 'clsx'
import Headings from '../../../Headings'
import { BlackAvatar } from 'assets/icons'

interface P {
	slo: string[]
	singleSloQuizResult: SingleSloQuizResult
}

const SingleSloView: React.FC<P> = ({ slo, singleSloQuizResult }) => {
	return (
		<div className="w-full">
			<div className="flex justify-center w-full font-bold">
				<Headings heading={`SLO : ${slo}`} />
			</div>
			<div className="mt-5 flex flex-row justify-between w-full bg-blue-tip-brand items-center py-2 text-white font-bold">
				<div className="ml-4 md:ml-4 lg:ml-1 md:ml-6 w-1/2 md:w-1/3 lg:w-1/2 flex justify-center">
					Names
				</div>
				<div className="w-1/2 flex flex-row justify-around">
					<div>Quiz</div>
					<div>Midpoint</div>
				</div>
			</div>
			<div className="overflow-y-auto h-96">
				{Object.values(singleSloQuizResult).map((obj, index) => {
					const quiz =
						!obj?.quiz_marks && isNaN(obj.quiz_marks) ? 0 : obj?.quiz_marks.toFixed(0)
					const midpoint =
						!obj?.midpoint_test_marks && isNaN(obj?.midpoint_test_marks)
							? 0
							: obj?.midpoint_test_marks.toFixed(0)
					return (
						<div
							key={index}
							className={`mb-1 flex flex-row justify-between w-full items-center ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
								}`}>
							<div className="w-1/2 flex justify-center">
								<div className="flex flex-row w-3/4 md:w-3/5 lg:w-1/4">
									<img className="h-10 w-10 mr-5" src={BlackAvatar} />
									<div className="flex flex-col justify-between">
										<div className="font-bold">{obj.std_name}</div>
										<div>{obj.std_roll_num}</div>
									</div>
								</div>
							</div>
							<div className="w-1/2 flex flex-row justify-around">
								<div
									className={clsx(
										'flex flex-row justify-center items-center h-14 w-16',
										{
											'bg-green-250': obj.quiz_marks >= 75,
											'bg-yellow-250':
												obj.quiz_marks < 75 && obj.quiz_marks >= 40
										},
										'bg-red-250'
									)}>
									{quiz}%
								</div>
								<div
									className={clsx(
										'flex flex-row justify-center items-center h-14 w-16',
										{
											'bg-green-250': obj.midpoint_test_marks >= 75,
											'bg-yellow-250':
												obj.midpoint_test_marks < 75 &&
												obj.midpoint_test_marks >= 40
										},
										'bg-red-250'
									)}>
									{midpoint}%
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default SingleSloView
