import React from 'react'
import clsx from 'clsx'

interface P {
	singleStdQuizResult: SingleStdQuizResult

	setType: (type: Types) => void
}

enum Types {
	SKILL_VIEW,
	CHILD_VIEW,
	SINGLE_STD_VIEW,
	SINGLE_SLO_VIEW
}

const ChildView: React.FC<P> = ({ singleStdQuizResult, setType }) => {
	return (
		<div className="w-full">
			<div className="flex flex-row justify-between w-full bg-blue-tip-brand py-5 items-center text-white font-bold">
				<div className="w-1/2 flex justify-center">Skills</div>
				<div className="w-1/2 flex flex-row justify-around">
					<div>Quiz</div>
					<div>Midpoint</div>
				</div>
			</div>
			{Object.entries(singleStdQuizResult || {}).map(([slo, res], index) => (
				<div
					key={index}
					className={`flex flex-row justify-between w-full py-2 items-center ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
						}`}
					onClick={() => setType(Types.SINGLE_STD_VIEW)}>
					<div className="w-1/2 flex justify-center">{slo}</div>
					<div className="w-1/2 flex flex-row justify-around">
						<div
							className={clsx(
								'flex flex-row justify-center items-center p-4',
								{
									'bg-green-250': res.quiz_marks >= 80,
									'bg-yellow-250': res.quiz_marks <= 60 || res.quiz_marks >= 40
								},
								'bg-red-250'
							)}>
							{res.quiz_marks.toFixed(0)}%
						</div>
						<div
							className={clsx(
								'flex flex-row justify-center items-center p-4',
								{
									'bg-green-250': res.midpoint_test_marks >= 80,
									'bg-yellow-250':
										res.midpoint_test_marks <= 60 ||
										res.midpoint_test_marks >= 40
								},
								'bg-red-250'
							)}>
							{res.midpoint_test_marks.toFixed(0)}%
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default ChildView
