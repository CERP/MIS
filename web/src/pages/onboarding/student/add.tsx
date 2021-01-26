import React, { useCallback, useState } from 'react'
import { v4 } from 'node-uuid'
import { useDispatch } from 'react-redux'

import { validateMobileNumber } from 'utils/helpers'
import { createStudentMerge } from 'actions'


const blankStudent = (): MISStudent => ({
	id: v4(),
	Name: "",
	RollNumber: "",
	BForm: "",
	Gender: "",
	Phone: "",
	AlternatePhone: "",
	Fee: 0,
	Active: true,

	ManCNIC: "",
	ManName: "",
	Birthdate: "",
	Address: "",
	Notes: "",
	StartDate: new Date().getTime(),
	AdmissionNumber: "",
	BloodType: "",
	FamilyID: "",
	Religion: "",

	fees: {},
	payments: {},
	attendance: {},
	section_id: "",
	tags: {},
	exams: {},
	certificates: {},
	prospective_section_id: "",
	diagnostic_result: {},
	learning_levels: {}
})

interface AddStudentFormProps {
	section: AugmentedSection
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({ section }) => {

	const dispatch = useDispatch()

	const [state, setState] = useState({
		section_id: section?.id,
		...blankStudent()
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (!validateMobileNumber(state.Phone)) {
			return window.alert("Please enter correct phone!")
		}

		dispatch(createStudentMerge(state))

		// reset state for new student
		setState({
			section_id: section?.id,
			...blankStudent()
		})
	}

	const handleInput = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>) => {
		const { name, value } = event.target
		setState({ ...state, [name]: value })
	}

	return (
		<form className="w-full text-white space-y-4 mt-4" onSubmit={handleSubmit}>

			<div className="text-center">Add Students Data Manually</div>

			<div className="">Name*</div>
			<input
				name="Name"
				type="text"
				onChange={handleInput}
				value={state.Name}
				required
				placeholder="e.g. John Doe"
				className="tw-input w-full bg-transparent border-blue-brand ring-1" />
			<div className="">Father Name*</div>
			<input
				name="ManName"
				type="text"
				onChange={handleInput}
				value={state.ManName}
				required
				placeholder="e.g. John Doe"
				className="tw-input w-full bg-transparent border-blue-brand ring-1" />
			<div className="">Contact Number*</div>
			<input
				name="Phone"
				type="number"
				onChange={handleInput}
				value={state.Phone}
				required
				placeholder="e.g. 03xxxxxxxx"
				className="tw-input w-full bg-transparent border-blue-brand ring-1" />

			<button type="submit" className="w-full tw-btn-blue py-3 font-semibold"> Save and Add new Student </button>
		</form>
	)
}