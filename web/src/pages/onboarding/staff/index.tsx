import React, { useState } from 'react'
import { v4 } from 'node-uuid'
import { useDispatch } from 'react-redux'
import { hash } from 'utils'
import { EyePassword } from 'components/Password'
import moment from 'moment'
import Dynamic from '@cerp/dynamic'

import { SwitchButton } from 'components/input/switch'
import { StaffType } from 'constants/index'
import { validateMobileNumber } from 'utils/helpers'
import { createFacultyMerge } from 'actions'

import UserIconSvg from 'assets/svgs/user.svg'

type TAddStaffProps = {
	onBack?: (close: boolean) => void
	skipStage?: () => void
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
	Admin: false,
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
	type: ""
}

export const AddStaff: React.FC<TAddStaffProps> = ({ onBack, skipStage }) => {

	const dispatch = useDispatch()

	const [state, setState] = useState(initialState)
	const [openEye, setOpenEye] = useState(false)
	const [showAdditionalFields, setShowAdditionalFields] = useState(false)

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

	const handleInputByPath = (path: string[], value: boolean) => {
		const updatedState = Dynamic.put(state, path, value) as MISTeacher
		setState(updatedState)
	}

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 my-4 md:mt-8">
			<div className="text-white text-center text-base my-5">Please Add Info to add Staff</div>
			<div className="w-24 h-24">
				<img className="rounded-full" src={UserIconSvg} alt="school-logo" />
			</div>
			<form id='admin-account' className="text-white space-y-4 px-4" onSubmit={handleSubmit}>
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
							onChange={handleInput}
							type="radio"
							value={StaffType.TEACHING}
							checked={state.type === StaffType.TEACHING}
							className="mr-2 w-4 h-4" />
						<div className="text-sm">Teaching Staff</div>
					</div>
					<div className="flex items-center">
						<input
							name="type"
							onChange={handleInput}
							type="radio"
							value={StaffType.NON_TEACHING}
							checked={state.type === StaffType.NON_TEACHING}
							className="mr-2 w-4 h-4" />
						<div className="text-sm">Non-Teaching Staff</div>
					</div>
				</div>

				{!showAdditionalFields &&
					<div className="flex flex-row items-center justify-between">
						<div
							onClick={() => setShowAdditionalFields(!showAdditionalFields)}
							className="w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">+</div>
						<div className="text-sm">Show Additional Fields</div>
					</div>
				}
				{
					showAdditionalFields && <>
						<div className="">Gender</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={"male"}
									checked={state.Gender === "male"}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Male</div>
							</div>
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={"female"}
									checked={state.Gender === "female"}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Female</div>
							</div>
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={"other"}
									checked={state.Gender === "other"}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Other</div>
							</div>
						</div>

						<div className="">CNIC*</div>
						<input
							name="CNIC"
							onChange={handleInput}
							required
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div className="">Qualification</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									name="Qualification"
									onChange={handleInput}
									type="radio"
									value={"BS/BSc"}
									checked={state.Qualification === "BS/BSc"}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">BS/BSc</div>
							</div>
							<div className="flex items-center">
								<input
									name="Qualification"
									onChange={handleInput}
									type="radio"
									value={"MS/MSc"}
									checked={state.Qualification === "MS/MSc"}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">MS/MSc</div>
							</div>
							<div className="flex items-center">
								<input
									name="Qualification"
									onChange={handleInput}
									type="radio"
									value={"Ph.D"}
									checked={state.Qualification === "Ph.D"}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Other</div>
							</div>
						</div>

						<div className="flex flex-row items-center justify-between">
							<div
								onClick={() => setShowAdditionalFields(!showAdditionalFields)}
								className="w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-red-brand hover:bg-red-500">-</div>
							<div className="text-sm">Hide Additional Fields</div>
						</div>

					</>
				}

				<SwitchButton title={"Admin Status"}
					state={state.Admin}
					callback={() => handleInputByPath(["Admin"], !state.Admin)} />

				{
					!state.Admin && <>
						<SwitchButton title={"Allow Setup View"}
							state={state.permissions.setupPage}
							callback={() => handleInputByPath(["permissions", "setupPage"], !state.permissions.setupPage)} />

						<SwitchButton title={"Allow Fee Info View"}
							state={state.permissions.fee}
							callback={() => handleInputByPath(["permissions", "fee"], !state.permissions.fee)} />

						<SwitchButton title={"Allow Expense View"}
							state={state.permissions.expense}
							callback={() => handleInputByPath(["permissions", "expense"], !state.permissions.expense)} />

						<SwitchButton title={"Allow Prospective View"}
							state={state.permissions.prospective}
							callback={() => handleInputByPath(["permissions", "prospective"], !state.permissions.prospective)} />

						<SwitchButton title={"Allow Family View"}
							state={state.permissions.family}
							callback={() => handleInputByPath(["permissions", "family"], !state.permissions.family)} />
					</>
				}

				<button className={"w-full items-center tw-btn-blue py-3 font-semibold my-4"}>Add Staff</button>
				<button
					type={"button"}
					onClick={skipStage}
					className={"w-full items-center tw-btn bg-orange-brand"}>Skip</button>

				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
		</div>
	)
}