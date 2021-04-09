import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { User } from 'assets/icons'
import './style.css'

interface P {
	std_name: string
	roll_num: string
	range: string

	setRange: (range: string) => void
}

type PropsType = P & RouteComponentProps

const SingleStdGrading: React.FC<PropsType> = ({ std_name, roll_num, range, setRange }) => {
	return (
		<div className="mb-1 bg-gray-200 w-ful text-sm md:text-base lg:text-lg flex flex-row justify-around md:justify-around lg:justify-around">
			<div className="flex flex-col justify-between items-center text-center w-1/2">
				<img className="h-8 w-8" src={User} />
				<div>{std_name}</div>
				<div>{roll_num}</div>
			</div>
			<div className="flex items-center w-1/2 justify-center">
				<div className="rounded-full bg-white py-2 px-4 md:px-5 lg:px-8 h-4 shadow-lg flex items-center">
					<input
						className="rounded-lg appearance-none bg-gray-400 h-1 w-128 outline-none cursor-pointer"
						type="range"
						min="1"
						max="100"
						step="1"
						value={range}
						onChange={e => setRange(e.target.value)}
					/>
				</div>
			</div>
		</div>
	)
}

export default withRouter(SingleStdGrading)
