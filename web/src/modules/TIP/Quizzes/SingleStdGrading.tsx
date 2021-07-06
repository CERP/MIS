import React, { useState } from 'react'
import { WhiteAvatar } from 'assets/icons'
import clsx from 'clsx'

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
					{obtained_marks !== undefined && (
						<div
							className={clsx(
								`flex justify-center items-center bg-white rounded-full w-max px-2 h-7 shadow-lg absolute transform -translate-y-6 translate-x-${obtained_marks > 5
									? getTranslateValue(obtained_marks)
									: obtained_marks * 2
								}`,
								{
									'bg-red-500 text-white': obtained_marks === -1
								}
							)}>
							{obtained_marks === -1 ? 'Absent' : obtained_marks}
						</div>
					)}
					<input
						className={clsx(
							`rounded-lg appearance-none bg-gray-400 h-1 w-128 outline-none cursor-pointer opacity-none`,
							{
								'opacity-30': obtained_marks === undefined
							}
						)}
						type="range"
						min={-1}
						max={total_marks}
						step={1}
						value={obtained_marks}
						onChange={e => onMark(parseInt(e.target.value), student.id)}
					/>
				</div>
			</div>
		</div>
	)
}

export default SingleStdGrading
