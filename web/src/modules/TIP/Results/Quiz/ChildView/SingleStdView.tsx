import React from 'react'
import clsx from 'clsx'

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
			<div className="flex flex-row justify-between w-full bg-blue-tip-brand py-5 items-center text-white font-bold">
				<div className="w-1/2 flex justify-center">Skills</div>
				<div className="w-1/2 flex flex-row justify-around">
					<div>Quiz</div>
					<div>Midpoint</div>
				</div>
			</div>
			{[1, 2, 3].map((std, index) => (
				<div
					key={index}
					className={`flex flex-row justify-between w-full py-2 items-center ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
						}`}
					onClick={() => setType(Types.SINGLE_STD_VIEW)}>
					<div className="w-1/2 flex justify-center">SLo Names</div>
					<div className="w-1/2 flex flex-row justify-around">
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
					</div>
				</div>
			))}
		</div>
	)
}

export default ChildView
