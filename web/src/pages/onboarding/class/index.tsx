import React, { useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import Dynamic from '@cerp/dynamic'
import { useDispatch, useSelector } from 'react-redux'

import { createEditClass } from 'actions'
import { createMerges } from 'actions/core'
import { OnboardingStage } from 'constants/index'
import { PlusButton } from 'components/Button/plus'
import { blankClass, defaultClasses } from 'constants/form-defaults'
import UserIconSvg from 'assets/svgs/user.svg'

interface CreateClassProps {
	onBack?: (close: boolean) => void
	skipStage: (stage?: MISOnboarding['stage']) => void
}

export const CreateClass = ({ skipStage }: CreateClassProps) => {
	const dispatch = useDispatch()
	const { faculty } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState(blankClass())
	const [newSubject, setNewSubject] = useState('')

	// at this stage we only have on class with default section
	const defaultSectionId = Object.keys(state.sections)[0]

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		// validate the fields
		// show alerts based on each

		// dispatch createClass merge
		dispatch(createEditClass(state))

		// dispatch update onboarding stage
		dispatch(
			createMerges([
				{
					path: ['db', 'onboarding', 'stage'],
					value: OnboardingStage.ADD_STUDENTS
				}
			])
		)
	}

	// TODO: replace it with generic function
	const handleInput = (
		event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>
	) => {
		const { name, value } = event.target

		// need to improve this logic
		if (name === 'section') {
			const v = value ? value : 'DEFAULT'
			handleInputByPath(['sections', defaultSectionId, 'name'], v)
			return
		}

		setState({ ...state, [name]: value })
	}

	// TODO: replace it with generic function with reset path of dependent single variable
	const handleInputByPath = (path: string[], value: string | boolean) => {
		const updatedState = Dynamic.put(state, path, value) as MISClass
		setState(updatedState)
	}

	const addNewSubject = () => {
		if (!newSubject) {
			toast.error('Please enter subject name')
		}

		const updatedState = Dynamic.put(state, ['subjects', newSubject], true) as MISClass
		setState(updatedState)
		setNewSubject('')
	}

	// const addNewSection = () => {
	// 	if (newSection) {
	// 		const updatedState = Dynamic.put(state, ["sections", v4(), "name"], newSection) as MISClass
	// 		setState(updatedState)
	// 		setNewSection('')
	// 	}
	// }

	// const deleteSection = (id: string) => {
	// 	const updatedState = Dynamic.delete(state, ["sections", id]) as MISClass
	// 	setState(updatedState)
	// }

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 py-4 my-4 md:mt-8">
			<div className="text-white text-center text-base mb-4">Please Add your First Class</div>

			<form id="admin-account" className="text-white space-y-4 px-4" onSubmit={handleSubmit}>
				<div>Name*</div>
				<select
					name="name"
					onChange={handleInput}
					required
					className="tw-select w-full border-blue-brand ring-1 text-base">
					<option value="">Select Class</option>
					{Object.keys(defaultClasses).map(c => (
						<option key={c}>{c}</option>
					))}
				</select>

				<div>Section*</div>
				<div className="flex flex-row items-center justify-between">
					<input
						name="section"
						required
						onChange={handleInput}
						placeholder="Type section name"
						className="w-full tw-input tw-is-form-bg-black"
					/>
				</div>

				<div>Subjects*</div>
				<div className="grid grid-cols-3 gap-3">
					{Object.keys(state.subjects).map((s, index) => (
						<div
							onClick={() => handleInputByPath(['subjects', s], !state.subjects[s])}
							key={s + index}
							className={clsx(
								'text-center p-1 border rounded-xl text-white text-sm',
								{
									'bg-teal-brand': state.subjects[s]
								}
							)}>
							<span>{s}</span>
						</div>
					))}
				</div>
				<div className="flex flex-row items-center justify-between">
					<input
						onChange={e => setNewSubject(e.target.value)}
						value={newSubject}
						placeholder="Type new subject name"
						autoComplete="off"
						className="tw-input tw-is-form-bg-black"
					/>
					<PlusButton handleClick={addNewSubject} className="ml-4" />
				</div>

				<div>Assign Class Teacher*</div>
				<div className="grid grid-cols-3 gap-5">
					{Object.values(faculty)
						.filter(f => f && f.Active && f.Name)
						.sort((a, b) => a.Name.localeCompare(b.Name))
						.map(faculty => (
							<div
								key={faculty.id}
								onClick={() =>
									handleInputByPath(
										['sections', defaultSectionId, 'faculty_id'],
										faculty.id
									)
								}
								className="flex flex-col items-center space-y-2">
								<img
									className={clsx(
										'w-16 h-16 rounded-full cursor-pointer border-2 border-transparent hover:border-green-brand',
										{
											'border-2 border-green-brand':
												state.sections[defaultSectionId].faculty_id ===
												faculty.id
										}
									)}
									src={UserIconSvg}
									alt="user-logo"
								/>

								<div
									className={clsx('text-xs', {
										'text-teal-brand':
											state.sections[defaultSectionId].faculty_id ===
											faculty.id
									})}>
									{faculty.Name}
								</div>
							</div>
						))}
				</div>

				<div className="flex flex-col justify-center">
					<button
						type={'submit'}
						className="w-full items-center tw-btn-blue py-3 font-semibold my-4">
						Create Class
					</button>
					<button
						type={'button'}
						onClick={() => skipStage(OnboardingStage.COMPLETED)}
						className="tw-btn bg-orange-brand text-white">
						Skip
					</button>
				</div>
			</form>
		</div>
	)
}
