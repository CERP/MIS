import React, { useState } from 'react'
import { v4 } from 'node-uuid'
import { useSelector } from 'react-redux'
import Dynamic from '@cerp/dynamic'

import UserIconSvg from 'assets/svgs/user.svg'
import clsx from 'clsx'

type TCreateClassProps = {
	onBack?: (close: boolean) => void
	skipStage?: () => void
}

const initialState: MISClass = {
	id: v4(),
	name: "",
	classYear: 0,
	sections: {},
	subjects: {
		"Maths": false,
		"English": false,
		"Urdu": false,
		"Islamiat": false
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

export const CreateClass: React.FC<TCreateClassProps> = ({ skipStage }) => {

	const [state, setState] = useState(initialState)

	const [newSubject, setNewSubject] = useState('')
	const [newSection, setNewSection] = useState('')
	const [classTeacher, setClassTeacher] = useState('') // teacher id should be assigned to each of the created section

	const { faculty } = useSelector((state: RootReducerState) => state.db)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

	}

	const handleInput = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>) => {
		const { name, value, checked, type } = event.target
		setState({ ...state, [name]: value })
	}

	const handleInputByPath = (path: string[], value: boolean) => {
		const updatedState = Dynamic.put(state, path, value) as MISClass
		setState(updatedState)
	}

	const addNewSubject = () => {
		const updatedState = Dynamic.put(state, ["subjects", newSubject], true) as MISClass
		setState(updatedState)
		setNewSubject('')
	}

	const addNewSection = () => {
		if (newSection) {
			const updatedState = Dynamic.put(state, ["sections", v4(), "name"], newSection) as MISClass
			setState(updatedState)
			setNewSection('')
		}
	}

	const deleteSection = (id: string) => {
		const updatedState = Dynamic.delete(state, ["sections", id]) as MISClass
		setState(updatedState)
	}

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 my-4 md:mt-8">

			<div className="text-white text-center text-base my-5">Please Add your First Class</div>

			<form id='admin-account' className="text-white space-y-4 px-4" onSubmit={handleSubmit}>
				<div>Name*</div>
				<select
					name="name"
					onChange={handleInput}
					required
					className="tw-select w-full border-blue-brand ring-1 text-base">
					<option>Select Class</option>
					{

						Object.keys(defaultClasses)
							.map(c => <option key={c}>{c}</option>)
					}
				</select>

				<div>Sections*</div>
				<div className="grid grid-cols-5 gap-3">
					{
						Object.entries(state.sections)
							.map(([id, section]) => (
								<div
									key={id}
									onClick={() => deleteSection(id)}
									className={clsx("text-center p-1 border cursor-pointer rounded-xl text-white text-sm bg-green-brand hover:bg-red-brand", {})}>
									<span>{section.name}</span>
								</div>))
					}
				</div>
				<div className="flex flex-row items-center justify-between">
					<input
						name="section"
						onChange={(e) => setNewSection(e.target.value)}
						value={newSection}
						placeholder="Type section name"
						className="tw-input bg-transparent border-blue-brand ring-1" />
					<div
						onClick={addNewSection}
						className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">+</div>
				</div>

				<div>Subjects*</div>
				<div className="grid grid-cols-3 gap-3">
					{
						Object.keys(state.subjects)
							.map((s, index) => (
								<div
									onClick={() => handleInputByPath(["subjects", s], !state.subjects[s])}
									key={s + index}
									className={clsx("text-center p-1 border rounded-xl text-white text-sm", {
										"bg-teal-500": state.subjects[s]
									})}>
									<span>{s}</span>
								</div>))
					}
				</div>
				<div className="flex flex-row items-center justify-between">
					<input
						onChange={(e) => setNewSubject(e.target.value)}
						value={newSubject}
						placeholder="Type new subject name"
						autoComplete="off"
						className="tw-input bg-transparent border-blue-brand ring-1" />
					<div
						onClick={addNewSubject}
						className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">+</div>
				</div>

				<div>Assign Class Teacher*</div>
				<div className="grid gird-cols-6 gap-4">
					{
						Object.values(faculty)
							.filter(f => f && f.Active && f.Name)
							.sort((a, b) => a.Name.localeCompare(b.Name))
							.map(faculty => (
								<div
									key={faculty.id}
									onClick={() => setClassTeacher(faculty.id)}
									className="flex flex-col items-center space-y-2">
									<img
										className={clsx("w-16 h-16 rounded-full cursor-pointer border-2 border-transparent hover:border-green-brand", {
											"border-2 border-green-brand": classTeacher === faculty.id
										})}
										src={UserIconSvg} alt="user-logo" />

									<div className={clsx("text-xs", {
										"text-green-brand": classTeacher === faculty.id
									})}>
										{faculty.Name}</div>
								</div>
							))
					}
				</div>

				<div className="flex flex-col justify-center">
					<button
						type={"submit"}
						className="w-full items-center tw-btn-blue py-3 font-semibold my-4">Create Class</button>
					<button
						type={"button"}
						onClick={skipStage}
						className="tw-btn bg-orange-brand text-white">Skip</button>
				</div>
				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
		</div>
	)
}