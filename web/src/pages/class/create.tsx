import React, { useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import Dynamic from '@cerp/dynamic'
import { v4 } from 'node-uuid'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { createEditClass, deleteSection, deleteSubject, passOutStudents } from 'actions'
import { AppLayout } from 'components/Layout/appLayout'
import { PlusButton } from 'components/Button/plus'
import { blankClass, defaultClasses } from 'constants/form-defaults'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'

type State = {
	class: MISClass
	newSection: string
	newSubject: string
	redirectTo: string
	subjectToDelete: string
}

export const CreateOrUpdateClass: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	const classId = match.params.id
	const isNewClass = location.pathname.indexOf('new') >= 0
	const { ref, setIsComponentVisible, isComponentVisible } = useComponentVisible(false)

	const dispatch = useDispatch()
	const { faculty, classes } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		class: classId ? classes[classId] : blankClass(),
		newSection: '',
		newSubject: '',
		redirectTo: '',
		subjectToDelete: ''
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
		const { name, value, type, valueAsNumber } = event.target

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
					[name]: parseInt(value) > 0 ? valueAsNumber : 0
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

		setIsComponentVisible(false)
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
			// delete from server
			deleteByPath(['class', 'sections', sectionId])
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

	if (!isNewClass && state.class.name === 'Temporary' && state.class.classYear === 9999) {
		return (
			<AppLayout title="Finish School" showHeaderTitle>
				<div className="p-5 md:p-10 md:pt-5 md:pb-0 relative">
					<div className="md:w-4/5 text-white md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 py-5 my-4">
						<h1 className="text-lg md:text-xl font-medium">Temporary Class</h1>
						<p className="md:text-center p-2 leading-relaxed ">
							This is a class which is automatically generated when you promote
							students of your final class.
							<br /> You can delete this class and pass out your students by clicking
							the <span className="font-medium italic">Finish School</span> button
							below
						</p>
						<button
							onClick={() => dispatch(passOutStudents(classes[classId]))}
							className="md:w-1/2 w-11/12 items-center tw-btn-red py-3 font-semibold ">
							Finish School
						</button>
					</div>
				</div>
			</AppLayout>
		)
	}

	return (
		<AppLayout title={isNewClass ? 'Add new Class' : 'Update Class'} showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 md:pb-0 relative">
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 py-5 my-4">
					<div className="text-white text-center text-base my-5 font-semibold">
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
									onClick={() => {
										setState({ ...state, subjectToDelete: subject })
										setIsComponentVisible(true)
									}}
									key={subject + index}
									className={clsx(
										'text-center p-1 border rounded-xl text-white text-sm cursor-pointer',
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
			{isComponentVisible && state.subjectToDelete && (
				<TModal>
					<div className="bg-white md:p-10 p-8 text-center text-sm" ref={ref}>
						<div className="font-semibold text-lg">
							Are you sure you want to delete {state.subjectToDelete}
						</div>

						<div className="flex flex-row justify-between space-x-4 mt-4">
							<button
								onClick={() => setIsComponentVisible(false)}
								className="py-1 md:py-2 tw-btn bg-gray-400 hover:bg-gray-500 text-white w-full">
								Cancel
							</button>
							<button
								onClick={() => removeSubject(state.subjectToDelete)}
								className="py-1 md:py-2 tw-btn-red w-full font-semibold">
								Confirm
							</button>
						</div>
					</div>
				</TModal>
			)}
		</AppLayout>
	)
}
