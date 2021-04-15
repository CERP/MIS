import React from 'react'
import Headings from '../../../Headings'
import { User } from 'assets/icons'

interface P {
	slo: string[]
	singleSloQuizResult: SingleSloQuizResult
}

const SingleSloView: React.FC<P> = ({ slo, singleSloQuizResult }) => {
	return (
		<div className="w-full">
			<div className="flex justify-center w-full font-bold">
				<Headings heading={`SLO : ${slo}`} sub_heading="" />
			</div>
			<div className="mt-5 flex flex-row justify-between w-full bg-blue-tip-brand p-2 items-center text-white font-bold">
				<div className="w-1/2 flex justify-center">Names</div>
				<div className="w-1/2 flex flex-row justify-around">
					<div>Quiz</div>
					<div>Midpoint</div>
				</div>
			</div>
			{Object.values(singleSloQuizResult).map((obj, index) => (
				<div
					key={index}
					className={`flex flex-row justify-between w-full p-2 items-center ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
						}`}>
					<div className="w-1/2 flex justify-center">
						<img className="h-10 w-10 mr-5" src={User} />
						<div className="flex flex-col justify-between">
							<div className="font-bold">{obj.std_name}</div>
							<div className="">{obj.std_roll_num}</div>
						</div>
					</div>
					<div className="w-1/2 flex flex-row justify-around">
						<div>{obj.quiz_marks}%</div>
						<div>{obj.midpoint_test_marks}%</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default SingleSloView
