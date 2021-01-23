import React, { useState } from 'react'
import { v4 } from 'node-uuid'
import moment from 'moment'

import { EyePassword } from 'components/Password'

import UserIconSvg from 'assets/svgs/user.svg'
import { SwitchButton } from 'components/input/switch'
import { StaffType } from 'constants/index'
import Dynamic from '@cerp/dynamic'
import { hash } from 'utils'
import { validateMobileNumber } from 'utils/helpers'
import { createFacultyMerge } from 'actions'
import { useDispatch } from 'react-redux'

type TAddStaffProps = {
	onBack?: (close: boolean) => void
}

const initialState: MISTeacher = {
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
		fee: false,
		setupPage: false,
		dailyStats: false,
		expense: false,
		prospective: false,
		family: false
	},
	type: StaffType.TEACHING
}

export const AddStaff: React.FC<TAddStaffProps> = ({ onBack }) => {

	const dispatch = useDispatch()

	const [state, setState] = useState(initialState)
	const [openEye, setOpenEye] = useState(false)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (!validateMobileNumber(state.Phone)) {
			return window.alert("Please provide correct phone number!")
		}

		hash(state.Password)
			.then(hashed => {
				dispatch(createFacultyMerge({ ...state, Password: hashed }, true))
			})

	}

	const handleInput = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>) => {
		const { name, value, checked, type } = event.target
		setState({ ...state, [name]: value })
	}

	const handleSwitchValue = (path: string[], value: boolean) => {
		const updatedState = Dynamic.put(state, path, value) as MISTeacher
		setState(updatedState)
	}

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 my-4 md:mt-8">
			<div className="text-white text-center text-base my-5">Please Add Info to add Staff</div>
			<div className="w-24 h-24">
				<img className="rounded-full" src={UserIconSvg} alt="school-logo" />
			</div>
			<form id='admin-account' className="text-white space-y-4 md:w-4/3 px-4" onSubmit={handleSubmit}>
				<div className="">Name*</div>
				<input
					name="Name"
					onChange={handleInput}
					required
					placeholder="e.g. John Doe"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Personal Number*</div>
				<input
					name="Phone"
					onChange={handleInput}
					required
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

				<div className="">Staff Type</div>
				<div className="flex items-center flex-wrap justify-between">
					<div className="flex items-center">
						<input
							name="type"
							type="radio"
							checked={true}
							className="mr-2 w-4 h-4" />
						<div className="text-sm">Teaching Staff</div>
					</div>
					<div className="flex items-center">
						<input
							name="type"
							type="radio"
							className="mr-2 w-4 h-4" />
						<div className="text-sm">Non-Teaching Staff</div>
					</div>
				</div>

				<SwitchButton title={"Admin Status"}
					state={state.Admin}
					callback={() => handleSwitchValue(["Admin"], !state.Admin)} />

				<SwitchButton title={"Allow Setup View"}
					state={state.permissions.setupPage}
					callback={() => handleSwitchValue(["permissions", "setupPage"], !state.permissions.setupPage)} />

				<SwitchButton title={"Allow Fee Info View"}
					state={state.permissions.fee}
					callback={() => handleSwitchValue(["permissions", "fee"], !state.permissions.fee)} />

				<SwitchButton title={"Allow Expense View"}
					state={state.permissions.expense}
					callback={() => handleSwitchValue(["permissions", "expense"], !state.permissions.expense)} />

				<SwitchButton title={"Allow Prospective View"}
					state={state.permissions.prospective}
					callback={() => handleSwitchValue(["permissions", "prospective"], !state.permissions.prospective)} />

				<SwitchButton title={"Allow Family View"}
					state={state.permissions.family}
					callback={() => handleSwitchValue(["permissions", "family"], !state.permissions.family)} />

				<button className={"w-full items-center tw-btn-blue py-3 font-semibold my-4"}>Add Staff</button>
				<button className={"w-full items-center tw-btn bg-orange-brand"}>Skip</button>

				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
		</div>
	)
}