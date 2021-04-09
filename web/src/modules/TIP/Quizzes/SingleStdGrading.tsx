import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { User } from 'assets/icons'
import './style.css'

interface P {
	student: MISStudent
}

type PropsType = P & RouteComponentProps

const SingleStdGrading: React.FC<PropsType> = ({ student }) => {
	const [range, setRange] = useState(0)
	console.log('dekho', range)
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
						onChange={e => setRange(parseInt(e.target.value))}
					/>
				</div>
			</div>
		</div>
	)
}

export default withRouter(SingleStdGrading)
