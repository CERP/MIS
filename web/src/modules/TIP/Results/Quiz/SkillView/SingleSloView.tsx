import React from 'react'
import Headings from '../../../Headings'
import { User } from 'assets/icons'

interface P {
	slo: string
}

const SingleSloView: React.FC<P> = ({ slo }) => {
	return (
		<div className="w-full">
			<div className="flex justify-center w-full font-bold">
				<Headings heading={`SLO : ${slo}`} sub_heading="" />
			</div>
			<div className="flex flex-row justify-between w-full bg-blue-tip-brand p-2 items-center text-white font-bold">
				<div className="w-1/2 flex justify-center">Names</div>
				<div className="w-1/2 flex flex-row justify-around">
					<div>Quiz</div>
					<div>Midpoint</div>
				</div>
			</div>
			{[1, 2, 3].map((std, index) => (
				<div
					key={index}
					className={`flex flex-row justify-between w-full p-2 items-center ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
						}`}>
					<div className="w-1/2 flex justify-center">
						<img className="h-10 w-10 mr-5" src={User} />
						<div className="flex flex-col justify-between">
							<div className="font-bold">Humna</div>
							<div className="">982HF</div>
						</div>
					</div>
					<div className="w-1/2 flex flex-row justify-around">
						<div>30%</div>
						<div>60%</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default SingleSloView
