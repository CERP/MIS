import React, { useState } from 'react'
import { v4 } from 'node-uuid'
import { useSelector } from 'react-redux'

import UserIconSvg from 'assets/svgs/user.svg'

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
	const { faculty } = useSelector((state: RootReducerState) => state.db)

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
				<div className="flex flex-row items-center justify-between">
					<input
						name="section"
						placeholder="Type section name"
						className="tw-input bg-transparent border-blue-brand ring-1" />
					<div className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">+</div>
				</div>

				<div className="">Subjects*</div>
				<div className="grid grid-cols-3 gap-3">
					{
						Object.keys(state.subjects)
							.map((s, index) => (<div key={s + index} className="text-center p-1 border rounded-xl text-white text-sm">{s}</div>))
					}
				</div>
				<div className="flex flex-row items-center justify-between">
					<input
						name="subject"
						placeholder="Type new subject name"
						autoComplete="off"
						required
						className="tw-input bg-transparent border-blue-brand ring-1" />
					<div className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">+</div>
				</div>

				<div className="">Assign Class Teacher*</div>
				<div className="grid gird-cols-3 gap-4">
					{
						Object.values(faculty)
							.filter(f => f && f.Active && f.Name)
							.sort((a, b) => a.Name.localeCompare(b.Name))
							.map(faculty => (
								<div key={faculty.id} className="flex flex-col items-center space-y-2">
									<img className="w-16 h-16 rounded-full" src={UserIconSvg} alt="user-logo" />
									<div className="text-xs">{faculty.Name}</div>
								</div>
							))
					}
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