import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import Dynamic from '@cerp/dynamic'
import { v4 } from 'node-uuid'
import clsx from 'clsx'

import { createEditClass, deleteSection, deleteSubject } from 'actions'
import { AppLayout } from 'components/Layout/appLayout'

import UserIconSvg from 'assets/svgs/user.svg'


const blankClass: MISClass = {
	id: v4(),
	name: "",
	classYear: 0,
	sections: {
		[v4()]: {
			name: "DEFAULT"
		}
	},
	subjects: {
		"Maths": false,
		"English": false,
		"Urdu": false,
		"Islamiat": false
	},
}

const defaultClasses: Record<string, number> = {
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

type State = {
	class: MISClass
	newSection: string
	newSubject: string
}

export const CreateOrUpdateClass: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {

	const classId = match.params.id
	const isNew = () => location.pathname.indexOf("new") >= 0

	const dispatch = useDispatch()
	const { faculty, classes } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		class: classId ? classes[classId] : blankClass,
		newSection: '',
		newSubject: ''
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		// validate the fields
		// show alerts based on each

		// dispatch createClass merge
		dispatch(createEditClass(state.class))
	}

	const handleInput = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>) => {
		const { name, value, type } = event.target

		if (name === "name") {
			return setState({
				...state,
				class: {
					...state.class,
					[name]: value,
					classYear: defaultClasses[value]
				}
			})
		}

		if (type === "number") {
			return setState({
				...state,
				class: {
					...state.class,
					[name]: parseInt(value)
				}
			})
		}

		setState({ ...state, class: { ...state.class, [name]: value } })
	}

	const handleInputByPath = (path: string[], value: string | boolean, resetPath?: string[]) => {

		let updatedState = Dynamic.put(state, path, value)

		// if there's path whose value should be set to an empty string
		if (resetPath) {
			updatedState = Dynamic.put(updatedState, resetPath, "")
		}

		setState(updatedState)
	}

	const addNewSubject = () => {
		if (state.newSubject.trim()) {
			handleInputByPath(
				["class", "subjects", state.newSubject.trim()],
				true,
				["newSubject"]
			)
		}
	}

	const addNewSection = () => {
		if (state.newSection.trim()) {

			// TODO: change this logic to if it's only one
			// default section
			const defaultSectionId = Object.keys(state.class.sections).length === 1
				&& Object.values(state.class.sections)[0].name === "DEFAULT"
				&& Object.keys(state.class.sections)[0]

			handleInputByPath(
				["class", "sections", defaultSectionId || v4(), "name"],
				state.newSection.trim(),
				["newSection"]
			)
		}
	}

	const deleteByPath = (path: string[]) => {
		const updatedState = Dynamic.delete(state, path) as State
		setState(updatedState)
	}

	const removeSubject = (subject: string) => {
		deleteByPath(["class", "subjects", subject])
		dispatch(deleteSubject(state.class.id, subject))
	}

	const removeSection = (sectionId: string) => {
		// delete from local page state
		deleteByPath(["class", "sections", sectionId])

		// delete from root and server
		dispatch(deleteSection(state.class.id, sectionId))
	}

	return (
		<AppLayout title={`${isNew() ? "Add New Class" : "Update Class"}`}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">{isNew() ? "Add New Class" : 'Update Class'}</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 my-4 md:mt-8">

					<div className="text-white text-center text-base my-5">Fill Class Information</div>

					<form id='mis-class' className="text-white space-y-4 px-4" onSubmit={handleSubmit}>

						<div>Name*</div>
						<div>
							<datalist
								id="class-name">
								{

									Object.keys(defaultClasses)
										.map(c => <option key={c}>{c}</option>)
								}
							</datalist>
							<input
								list="class-name"
								name="name"
								required
								value={state.class.name}
								onChange={handleInput}
								className="tw-input w-full bg-transparent border-blue-brand ring-1"
								placeholder="Select or type class name" />
						</div>

						<div>Class Order*</div>
						<input type="number"
							name="classYear"
							required
							className="tw-input w-full  bg-transparent border-blue-brand ring-1"
							value={state.class.classYear} onChange={handleInput} />

						<div>Section*</div>
						<div className="grid grid-cols-5 gap-3">
							{
								Object.keys(state.class.sections).length !== 1
								&&
								Object.entries(state.class.sections)
									.map(([id, section]) => (
										<div
											key={id}
											onClick={() => removeSection(id)}
											className={clsx("text-center p-1 border cursor-pointer rounded-xl text-white text-sm bg-green-brand hover:bg-red-brand", {})}>
											<span>{section.name}</span>
										</div>))
							}
						</div>

						<div className="flex flex-row items-center justify-between">
							<input
								onChange={(e) => handleInputByPath(["newSection"], e.target.value)}
								placeholder="Type section name"
								value={state.newSection}
								className="tw-input bg-transparent border-blue-brand ring-1" />
							<div
								onClick={addNewSection}
								className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">+</div>
						</div>

						<div>Subjects*</div>
						<div className="grid grid-cols-3 gap-3">
							{
								Object.keys(state.class.subjects)
									.map((s, index) => (
										<div
											onClick={() => removeSubject(s)}
											key={s + index}
											className={clsx("text-center p-1 border rounded-xl text-white text-sm", {
												"bg-teal-500": state.class.subjects[s]
											})}>
											<span>{s}</span>
										</div>))
							}
						</div>
						<div className="flex flex-row items-center justify-between">
							<input
								onChange={(e) => handleInputByPath(["newSubject"], e.target.value)}
								value={state.newSubject}
								placeholder="Type new subject name"
								autoComplete="off"
								className="tw-input bg-transparent border-blue-brand ring-1" />
							<div
								onClick={addNewSubject}
								className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">+</div>
						</div>

						<div>Assign Section Teacher*</div>
						<div className="grid grid-cols-3 gap-5">
							{
								Object.values(faculty)
									.filter(f => f && f.Active && f.Name)
									.sort((a, b) => a.Name.localeCompare(b.Name))
									.map(faculty => (
										<div
											key={faculty.id}
											onClick={() => addNewSection()}
											className="flex flex-col items-center space-y-2">
											<img
												className={clsx("w-16 h-16 rounded-full cursor-pointer border-2 border-transparent hover:border-green-brand", {
													"border-2 border-green-brand": false
												})}
												src={UserIconSvg} alt="user-logo" />

											<div className={clsx("text-xs", {
												"text-green-brand": false
											})}>
												{faculty.Name}</div>
										</div>
									))
							}
						</div>

						<div className="flex flex-col justify-center">
							<button
								type={"submit"}
								className="w-full items-center tw-btn-blue py-3 font-semibold my-4">
								{isNew() ? 'Create Class' : 'Update Class'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</AppLayout>
	)
}