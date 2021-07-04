import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { v4 } from 'node-uuid'
import toast from 'react-hot-toast'

import { isValidPhone } from 'utils/helpers'
import { createStudentMerge } from 'actions'
import { numberRegex } from 'constants/index'
import { PhoneInput } from 'components/input/PhoneInput'
import { blankStudent } from 'constants/form-defaults'

interface AddStudentFormProps {
	section: AugmentedSection
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({ section }) => {
	const dispatch = useDispatch()

	console.log('check the id', section)

	// adding students to only created section
	const [state, setState] = useState({
		...blankStudent(),
		section_id: section?.id
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (!isValidPhone(state.Phone)) {
			return toast.error('Please enter correct phone number.')
		}

		dispatch(createStudentMerge(state))

		// reset state for new student
		setState({
			section_id: section?.id,
			...blankStudent()
		})
	}

	// TODO: replace it with generic change handler
	const handleInput = (
		event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>
	) => {
		const { name, value } = event.target
		setState({ ...state, [name]: value })
	}

	console.log(state)

	return (
		<form className="w-full text-white space-y-4 mt-4" onSubmit={handleSubmit}>
			<h2 className="text-center font-semibold">Add Students Data Manually</h2>

			<div className="">Name*</div>
			<input
				name="Name"
				type="text"
				onChange={handleInput}
				value={state.Name}
				required
				placeholder="Type name here"
				className="tw-input w-full tw-is-form-bg-black"
			/>
			<div className="">Father Name*</div>
			<input
				name="ManName"
				type="text"
				onChange={handleInput}
				value={state.ManName}
				required
				placeholder="Type father name here"
				className="tw-input w-full tw-is-form-bg-black"
			/>
			<div className="">Contact Number*</div>
			<PhoneInput
				name="Phone"
				onChange={handleInput}
				value={state.Phone}
				required
				error={
					state.Phone && (numberRegex.test(state.Phone) || !(state.Phone?.length <= 11))
				}
				className="tw-input w-full tw-is-form-bg-black"
			/>

			<button type="submit" className="w-full tw-btn-blue py-3 font-semibold">
				Save and Add new Student
			</button>
		</form>
	)
}
