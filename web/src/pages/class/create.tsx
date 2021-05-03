import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'node-uuid'
import toast from 'react-hot-toast'
import Dynamic from '@cerp/dynamic'
import clsx from 'clsx'

import { createEditClass, deleteSection, deleteSubject } from 'actions'
import { AppLayout } from 'components/Layout/appLayout'
import { PlusButton } from 'components/Button/plus'

const blankClass: MISClass = {
	id: v4(),
	name: '',
	classYear: 0,
	sections: {
		[v4()]: {
			name: 'DEFAULT'
		}
	},
	subjects: {
		Maths: true,
		English: true,
		Urdu: true,
		Islamiat: true
	}
}

const defaultClasses: Record<string, number> = {
	Preschool: 0,
	'Play Group': 1,
	Nursery: 2,
	Prep: 3,
	'Class 1': 4,
	'Class 2': 5,
	'Class 3': 6,
	'Class 4': 7,
	'Class 5': 8,
	'Class 6': 9,
	'Class 7': 10,
	'Class 8': 11,
	'Class 9': 12,
	'Class 10': 13,
	'O Level': 14,
	'A Level': 15
}

type State = {
	class: MISClass
	newSection: string
	newSubject: string
	redirectTo: string
}

export const CreateOrUpdateClass: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	const classId = match.params.id
	const isNewClass = location.pathname.indexOf('new') >= 0

	const dispatch = useDispatch()
	const { faculty, classes } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		class: classId ? classes[classId] : blankClass,
		newSection: '',
		newSubject: '',
		redirectTo: ''
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		//TODO: validate the fields
		//TODO: show alerts based on each

		// dispatch createClass merge
		dispatch(createEditClass(state.class))
		const msg = isNewClass ? 'New class has been created' : 'Class info has been updated'
		toast.success(msg)

		if (isNewClass) {
			setTimeout(() => {
				setState({ ...state, redirectTo: '/classes' })
			}, 1500)
		}
	}

	const handleInput = (
		event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>
	) => {
		const { name, value, type } = event.target

		if (name === 'name') {
			return setState({
				...state,
				class: {
					...state.class,
					[name]: value,
					classYear: defaultClasses[value]
				}
			})
		}

		if (type === 'number') {
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
			updatedState = Dynamic.put(updatedState, resetPath, '')
		}

		setState(updatedState)
	}

	const addNewSubject = () => {
		if (state.newSubject.trim()) {
			handleInputByPath(['class', 'subjects', state.newSubject.trim()], true, ['newSubject'])
		}
	}

	const deleteByPath = (path: string[]) => {
		const updatedState = Dynamic.delete(state, path) as State
		setState(updatedState)
	}

	const removeSubject = (subject: string) => {
		deleteByPath(['class', 'subjects', subject])
		if (!isNewClass) {
			dispatch(deleteSubject(state.class.id, subject))
		}
	}

	const removeSection = (sectionId: string) => {
		// TODO: change it with custom alert component
		if (!window.confirm('Are you sure you want to delete?')) {
			return
		}

		// delete from local page state
		if (isNewClass) {
			deleteByPath(['class', 'sections', sectionId])
		}

		if (!isNewClass) {
			// delete from root and server
			dispatch(deleteSection(state.class.id, sectionId))
		}
	}

	const addNewSection = () => {
		setState({
			...state,
			class: {
				...state.class,
				sections: {
					...state.class.sections,
					[v4()]: {
						name: ''
					}
				}
			}
		})
	}

	if (state.redirectTo) {
		return <Redirect to={state.redirectTo} />
	}

	return (
		<AppLayout title={`${isNewClass ? 'Add New Class' : 'Update Class'}`}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">
					{isNewClass ? 'Add New Class' : 'Update Class'}
				</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 py-5 my-4 md:mt-8">
					<div className="text-white text-center text-base my-5">
						Fill Class Information
					</div>

					<form
						id="class-form"
						className="text-white space-y-4 px-4 w-full md:w-3/5"
						onSubmit={handleSubmit}>
						<div>Name*</div>
						<div>
							<datalist id="class-name">
								{Object.keys(defaultClasses).map(c => (
									<option key={c}>{c}</option>
								))}
							</datalist>
							<input
								list="class-name"
								name="name"
								required
								value={state.class.name}
								onChange={handleInput}
								className="tw-input w-full tw-is-form-bg-black"
								placeholder="Select or type class name"
							/>
						</div>

						<div>Class Order*</div>
						<input
							type="number"
							name="classYear"
							required
							className="tw-input w-full  tw-is-form-bg-black"
							value={state.class.classYear}
							onChange={handleInput}
						/>

						<div>Subjects*</div>
						<div className="grid grid-cols-3 md:grid-cols-5 gap-3">
							{Object.entries(state.class.subjects).map(([subject, value], index) => (
								<div
									onClick={() => removeSubject(subject)}
									key={subject + index}
									className={clsx(
										'text-center p-1 border rounded-xl text-white text-sm',
										{
											'bg-teal-brand': value
										}
									)}>
									<span>{subject}</span>
								</div>
							))}
						</div>
						<div className="flex flex-row items-center justify-between">
							<input
								onChange={e => handleInputByPath(['newSubject'], e.target.value)}
								value={state.newSubject}
								placeholder="Type new subject name"
								autoComplete="off"
								className="tw-input w-full tw-is-form-bg-black"
							/>
							<PlusButton handleClick={addNewSubject} className="ml-4" />
						</div>

						<div>Sections</div>
						{Object.entries(state.class.sections).map(
							([id, section], index, originArray) => {
								return (
									<div key={id} className="space-y-4">
										{
											<div className="flex flex-row items-center justify-between">
												<input
													onChange={e =>
														handleInputByPath(
															['class', 'sections', id, 'name'],
															e.target.value
														)
													}
													placeholder={'Type section name'}
													value={section.name}
													className="tw-input w-full tw-is-form-bg-black"
												/>
											</div>
										}

										{
											<div className="flex flex-row justify-between items-center w-full">
												<div className="w-1/2">Assign Teacher</div>
												<select
													className="tw-select w-1/2"
													value={state.class.sections[id].faculty_id}
													onChange={e =>
														handleInputByPath(
															['class', 'sections', id, 'faculty_id'],
															e.target.value
														)
													}>
													<option value={''}>Choose</option>
													{Object.values(faculty)
														.filter(f => f && f.Active && f.Name)
														.sort((a, b) =>
															a.Name.localeCompare(b.Name)
														)
														.map(faculty => (
															<option
																value={faculty.id}
																key={faculty.id}>
																{faculty.Name}
															</option>
														))}
												</select>
											</div>
										}

										{!(originArray.length === 1) && (
											<div
												className="tw-btn-red text-center"
												onClick={() => removeSection(id)}>
												Delete Section
											</div>
										)}
									</div>
								)
							}
						)}

						<div className="flex flex-row items-center">
							<PlusButton handleClick={addNewSection} className="mr-4" />
							<div>Add Another Class Section</div>
						</div>

						<div className="flex flex-col justify-center">
							<button
								type={'submit'}
								className="w-full items-center tw-btn-blue py-3 font-semibold my-4">
								{isNewClass ? 'Create Class' : 'Update Class'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</AppLayout>
	)
}
