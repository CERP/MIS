import React, { useState } from 'react'
import { WhiteAvatar } from 'assets/icons'

interface P {
	student: MISStudent
	obtained_marks: number
	total_marks: number

	handleChange: (std_id: string, marks: number) => void
}

const SingleStdGrading: React.FC<P> = ({ student, obtained_marks, total_marks, handleChange }) => {
	const [range, setRange] = useState(obtained_marks ?? -1)

	const onMark = (value: number, std_id: string) => {
		setRange(value)
		handleChange(std_id, range)
	}

	const getTranslateValue = (marks: number) => {
		switch (marks) {
			case 6:
				return 14
			case 7:
				return 16
			case 8:
				return 20
			case 9:
				return 24
			case 10:
				return 28
			default:
				return 0
		}
	}

	return (
		<div className="mb-1 bg-gray-200 w-ful text-sm md:text-base lg:text-lg flex flex-row justify-around">
			<div className="flex flex-col justify-center items-center w-1/2">
				<img className="h-8 w-8" src={WhiteAvatar} />
				<div>{student.Name}</div>
				<div>{student.RollNumber}</div>
			</div>
			<div className="flex items-center w-1/2 justify-center">
				<div className="rounded-full bg-white py-2 px-4 md:px-5 lg:px-8 h-4 shadow-lg flex items-center">
					<div
						className={`bg-white rounded-full w-min px-2 h-7 flex justify-center items-center absolute shadow-lg transform -translate-y-6 translate-x-${obtained_marks > 5
								? getTranslateValue(obtained_marks)
								: obtained_marks * 2
							}`}>
						{obtained_marks === -1 ? 'Absent' : obtained_marks}
					</div>
					<input
						className="rounded-lg appearance-none bg-gray-400 h-1 w-128 outline-none cursor-pointer"
						type="range"
						min={-1}
						max={total_marks}
						step={1}
						value={obtained_marks}
						onChange={e => onMark(parseInt(e.target.value), student.id)}
					/>
				</div>
				<button
					className="bg-sea-green-tip-brand bg-te border-none rounded-md shadow-lg p-2 m-2"
					onClick={e => onMark(-1, student.id)}>
					{obtained_marks === -1 ? 'A' : 'P'}
				</button>
			</div>
		</div>
	)
}

export default SingleStdGrading
