import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { User } from 'assets/icons'
import './style.css'

interface P {
	student: MISStudent
	quiz_id: string
	std_result: QuizResult

	setStdResult: (std_result: QuizResult) => void
}

type PropsType = P & RouteComponentProps

type QuizResult = {
	[std_id: string]: number
}

const SingleStdGrading: React.FC<PropsType> = ({ student, quiz_id, setStdResult, std_result }) => {
	const quiz_result = student?.targeted_instruction?.quiz_result
	const obtain_marks = quiz_result && quiz_result[quiz_id] && quiz_result[quiz_id].obtain_marks
	const [test, setTest] = useState<QuizResult>({})
	const [range, setRange] = useState(obtain_marks ? obtain_marks : 0)

	const onMark = (value: number, std_id: string) => {
		setRange(value)

		setTest({ ...test, [std_id]: value })
		// setStdResult({ ...std_result })
		console.log('dekhooooo', test)
	}

	return (
		<div className="mb-1 bg-gray-200 w-ful text-sm md:text-base lg:text-lg flex flex-row justify-around md:justify-around lg:justify-around">
			<div className="flex flex-col justify-between items-center text-center w-1/2">
				<img className="h-8 w-8" src={User} />
				<div>{student.Name}</div>
				<div>{student.RollNumber}</div>
			</div>
			<div className="flex items-center w-1/2 justify-center">
				<div className="rounded-full bg-white py-2 px-4 md:px-5 lg:px-8 h-4 shadow-lg flex items-center">
					<input
						className="rounded-lg appearance-none bg-gray-400 h-1 w-128 outline-none cursor-pointer"
						type="range"
						min="1"
						max="10"
						step="1"
						value={range}
						onChange={e => onMark(parseInt(e.target.value), student.id)}
					/>
				</div>
			</div>
		</div>
	)
}

export default withRouter(SingleStdGrading)
