import React from 'react'
import clsx from 'clsx'
import { User } from 'assets/icons'

interface P {
	setType: (type: Types) => void
}

enum Types {
	SKILL_VIEW,
	CHILD_VIEW,
	SINGLE_STD_VIEW,
	SINGLE_SLO_VIEW
}

const ChildView: React.FC<P> = ({ setType }) => {
	return (
		<div className="w-full">
			<div className="bg-blue-tip-brand text-white flex flex-row justify-between items-center w-full py-2">
				<div className="w-1/3 flex justify-center font-bold">Names</div>
				<div className="w-2/3 flex flex-row justify-between">
					{[1, 2, 3].map(quiz => (
						<div
							key={quiz}
							className="flex flex-col justify-between text-center text-xs md:text-sm lg:text-base">
							<div>Quiz {quiz}</div>
							<div>Addition and Subtraction</div>
						</div>
					))}
				</div>
			</div>
			{[1, 2, 3].map((std, index) => (
				<div
					key={index}
					className="flex flex-row justify-between w-full items-center bg-gray-100 mb-1"
					onClick={() => setType(Types.SINGLE_STD_VIEW)}>
					<div className="w-1/3 flex justify-center">
						<img className="h-10 w-10 mr-5" src={User} />
						<div className="flex flex-col justify-between">
							<div className="font-bold">Humna</div>
							<div className="">982HF</div>
						</div>
					</div>
					<div className="w-2/3 flex flex-row justify-around">
						<div
							className={clsx(
								'flex flex-row justify-center items-center p-4',
								{
									'bg-green-250': 30 >= 80,
									'bg-yellow-250': 30 >= 40
								},
								'bg-red-250'
							)}>
							30%
						</div>
						<div
							className={clsx(
								'flex flex-row justify-center items-center p-4',
								{
									'bg-green-250': 60 >= 80,
									'bg-yellow-250': 60 >= 40
								},
								'bg-red-250'
							)}>
							60%
						</div>
						<div
							className={clsx(
								'flex flex-row justify-center items-center p-4',
								{
									'bg-green-250': 80 >= 80,
									'bg-yellow-250': 80 >= 40
								},
								'bg-red-250'
							)}>
							80%
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default ChildView
