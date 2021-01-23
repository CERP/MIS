import React, { useState } from 'react'
import { v4 } from 'node-uuid'

type TCreateClassProps = {}

const initialState: MISClass = {
	id: v4(),
	name: "",
	classYear: 0,
	sections: {
		[v4()]: {
			name: "DEFAULT"
		}
	},
	subjects: {
		"Maths": true,
		"English": true,
		"Urdu": true,
		"Islamiat": true
	},
}

const defaultClasses = {
	"Nursery": 0,
	"Class 1": 1,
	"Class 2": 2,
	"Class 3": 3,
	"Class 4": 4,
	"Class 5": 5,
	"Class 6": 6,
	"Class 7": 7,
	"Class 8": 8,
	"Class 9": 9,
	"Class 10": 10,
	"O Level": 11,
	"A Level": 12
}

export const CreateClass: React.FC<TCreateClassProps> = () => {

	const [state, setState] = useState(initialState)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

	}

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 my-4 md:mt-8">

			<div className="text-white text-center text-base my-5">Please Add your First Class</div>

			<form id='admin-account' className="text-white space-y-4 md:w-4/3 px-4" onSubmit={handleSubmit}>
				<div className="">Name*</div>
				<select
					name="class"
					required
					className="tw-select w-full border-blue-brand ring-1">
					<option>Select Class</option>
					{

						Object.keys(defaultClasses)
							.map(c => <option key={c}>{c}</option>)
					}
				</select>
				<div className="">Sections*</div>
				<input
					name="section"
					required
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Subjects*</div>

				<div className="flex flex-row items-center space-x-4 flex-wrap space-y-1 md:space-y-0">
					{
						Object.keys(state.subjects)
							.map((s, index) => (<div key={s + index} className="px-2 p-1 border rounded-xl text-white text-sm">{s}</div>))
					}
					<div className="w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer ml-auto bg-blue-brand hover:bg-blue-400">+</div>
				</div>


				<div className="">Assign Class Teacher*</div>
				<div className="flex">

				</div>
				<div className="flex flex-col justify-center">
					<button className="w-full items-center tw-btn-blue py-3 font-semibold my-4">Create Class</button>
					<button className="tw-btn bg-orange-brand text-white">Skip</button>
				</div>
				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
		</div>
	)
}