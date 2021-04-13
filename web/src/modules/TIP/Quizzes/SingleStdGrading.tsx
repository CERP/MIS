import React, { useState } from 'react'
import { User } from 'assets/icons'

interface P {
	student: MISStudent
	obtain_marks: number

	handleChange: (std_id: string, marks: number) => void
}

const SingleStdGrading: React.FC<P> = ({ student, obtain_marks, handleChange }) => {
	const [range, setRange] = useState(obtain_marks ?? 0)

	const onMark = (value: number, std_id: string) => {
		setRange(value)
		handleChange(std_id, range)
	}

	return (
		<div className="mb-1 bg-gray-200 w-ful text-sm md:text-base lg:text-lg flex flex-row justify-around">
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
						min={0}
						max={10}
						step={1}
						value={obtain_marks}
						onChange={e => onMark(parseInt(e.target.value), student.id)}
					/>
				</div>
			</div>
		</div>
	)
}

export default SingleStdGrading
