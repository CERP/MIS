import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { v4 } from 'node-uuid'

import { isValidPhone } from 'utils/helpers'
import { createStudentMerge } from 'actions'


// TODO: move this to single single source of default
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

	// adding students to only created section
	const [state, setState] = useState({
		section_id: section?.id,
		...blankStudent()
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (!isValidPhone(state.Phone)) {
			// TODO: show RHT
			return window.alert("Please enter correct phone!")
		}

		dispatch(createStudentMerge(state))

		// reset state for new student
		setState({
			section_id: section?.id,
			...blankStudent()
		})
	}

	// TODO: replace it with generic change handler
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
				placeholder="Type name here"
				className="tw-input w-full bg-transparent border-blue-brand ring-1" />
			<div className="">Father Name*</div>
			<input
				name="ManName"
				type="text"
				onChange={handleInput}
				value={state.ManName}
				required
				placeholder="Type father name here"
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