import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { User } from 'assets/icons'
import clsx from 'clsx'

interface P {
	student: MISStudent
}

type PropsType = P & RouteComponentProps

const getProgress = (obtained_marks: number) => {
	const percentage = (obtained_marks / 10) * 100
	if (percentage > 60) {
		return 'Mastered'
	} else if (percentage >= 40) {
		return 'Working'
	} else {
		return 'Struggling'
	}
}

const SingleStdResult: React.FC<PropsType> = ({ match, student }) => {
	const { quiz_id, class_name, subject } = match.params as Params

	const quiz_result = student?.targeted_instruction?.quiz_result
	const obtained_marks = quiz_result[class_name][subject][quiz_id].obtained_marks
	const progress = getProgress(obtained_marks)

	return (
		<div className="mb-3 bg-white w-ful text-sm md:text-base lg:text-lg flex flex-row justify-around md:justify-around lg:justify-around">
			<div className="w-1/3 flex justify-center">
				<div className="w-full md:w-1/2 lg:w-1/2 flex flex-row justify-start items-center">
					<img className="h-8 w-8" src={User} />
					<div>{student.Name}</div>
				</div>
			</div>
			<div className="flex items-center w-1/3 justify-center">{obtained_marks}</div>
			<div className="flex items-center w-1/3 justify-center">
				<div className="w-full md:w-1/2 lg:w-1/3 flex flex-row justify-start items-cente">
					<div
						className={clsx(
							'bg-blue-900 rounded-full h-5 w-5 mr-3',
							{
								'bg-sea-green-tip-brand': progress === 'Mastered',
								'bg-yellow-tip-brand': progress === 'Working'
							},
							'bg-red-tip-brand'
						)}></div>
					<div
						className={clsx(
							'font-bold',
							{
								'text-sea-green-tip-brand': progress === 'Mastered',
								'text-yellow-tip-brand': progress === 'Working'
							},
							'text-red-tip-brand'
						)}>
						{progress}
					</div>
				</div>
			</div>
		</div>
	)
}

export default withRouter(SingleStdResult)
