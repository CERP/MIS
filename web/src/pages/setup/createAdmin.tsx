import React, { useState } from 'react'
import moment from 'moment'
import { v4 } from 'node-uuid'

import { validateMobileNumber } from 'utils/helpers'
import { EyePassword } from 'components/Password'

import UserIconSvg from 'assets/svgs/user.svg'
import { useDispatch } from 'react-redux'
import { hash } from 'utils'
import { createFacultyMerge } from 'actions'

type TAdminCreateForm = {
	onBack: (close: boolean) => void
}

const blankTeacher: MISTeacher = {
	id: v4(),
	Name: "",
	CNIC: "",
	Gender: "",
	Username: "",
	Password: "",
	Married: false,
	Phone: "",
	Salary: "",
	Active: true,

	ManCNIC: "",
	ManName: "",
	Birthdate: "",
	Address: "",
	StructuredQualification: "",
	Qualification: "",
	Experience: "",
	HireDate: moment().format("MM-DD-YYYY"),
	Admin: true,
	HasLogin: true,
	tags: {},
	attendance: {},
	permissions: {
		fee: true,
		setupPage: true,
		dailyStats: true,
		expense: true,
		prospective: true,
		family: true
	}
}

export const AdminCreateForm: React.FC<TAdminCreateForm> = ({ onBack }) => {

	const dispatch = useDispatch()

	const [state, setState] = useState<MISTeacher>(blankTeacher)
	const [openEye, setOpenEye] = useState(false)

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setState({ ...state, [name]: value })
	}

	const createAdmin = (event: React.FormEvent) => {
		event.preventDefault()

		if (!validateMobileNumber(state.Phone)) {
			return window.alert("Please provide correct phone number!")
		}

		hash(state.Password)
			.then(hashed => {
				dispatch(createFacultyMerge({ ...state, Password: hashed }, true))
			})
	}

	return (
		<div className="relative md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 my-4 md:mt-8">
			<div className="text-white text-center text-base my-5">Please Create your Admin profile</div>
			<div className="w-24 h-24">
				<img className="rounded-full" src={UserIconSvg} alt="school-logo" />
			</div>
			<form className="text-white space-y-4 md:w-4/3 px-4" onSubmit={createAdmin}>
				<div className="">Name*</div>
				<input
					name="Name"
					required
					onChange={handleInput}
					placeholder="e.g. John Doe"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Personal Number*</div>
				<input
					name="Phone"
					required
					onChange={handleInput}
					placeholder="e.g. 03xxxxxxxx"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Password*</div>
				<div className="w-full relative">
					<input
						name="Password"
						required
						onChange={handleInput}
						type={openEye ? 'text' : 'password'}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						placeholder="Enter password"
						className="tw-input w-full bg-transparent border-blue-brand ring-1" />
					<div
						onClick={() => setOpenEye(!openEye)}
						className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
						{
							<EyePassword open={openEye} />
						}
					</div>
				</div>
				<button className={"w-full items-center tw-btn-blue py-3 font-semibold my-4"}>
					Create Account
					</button>
				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
			<div className="absolute left-5 top-10">
				<div
					onClick={() => onBack(false)}
					className="w-10 h-8 flex items-center justify-center rounded-md shadow-md bg-white text-blue-brand cursor-pointer">
					<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
				</div>
			</div>
		</div>
	)
}