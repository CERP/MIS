import React, { useState } from 'react'
import { v4 } from 'node-uuid'
import moment from 'moment'
import Dynamic from '@cerp/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { SwitchButton } from 'components/input/switch'
import { validateMobileNumber } from 'utils/helpers'
import { createFacultyMerge, deleteFaculty, uploadFacultyProfilePicture } from 'actions'
import { StaffType } from 'constants/index'
import { EyePassword } from 'components/Password'
import { hash } from 'utils'
import { getImageString, getDownsizedImage } from 'utils/image'

import UserIconSvg from 'assets/svgs/user.svg'

const blankTeacher = (): MISTeacher => ({
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
	HireDate: moment().format("YYYY-MM-DD"),
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
	Type: ""
})

const Qualification: Record<string, string> = {
	matric: "Matric",
	intermediate: "Intermediate",
	graduation: "Graduation",
	masters: "Masters",
	phd: "PhD",
	other: "Other"
}

const Experience: Record<string, string> = {
	A: "<1 year",
	B: "<2 years",
	C: "<4 years",
	D: "<6 years",
	E: "<8 years",
	F: "<10 years",
	G: ">=10 years"
}

interface RouteInfo {
	id: string
}

type CreateOrUpdateStaffProps = RouteComponentProps<RouteInfo>

type StateProps = {
	profile: MISTeacher
	showPassword: boolean
	redirect: string | boolean
}

export const CreateOrUpdateStaff: React.FC<CreateOrUpdateStaffProps> = ({ match, location }) => {

	const { id } = match.params
	const isNewStaff = () => location.pathname.indexOf("new") >= 0

	const dispatch = useDispatch()
	const { faculty } = useSelector((state: RootReducerState) => state.db)

	const editableFaculty = faculty[id]

	const [state, setState] = useState<StateProps>({
		profile: {
			...editableFaculty || blankTeacher(),
			HasLogin: isNewStaff ? true : editableFaculty && editableFaculty.HasLogin,
			permissions: isNewStaff ? blankTeacher().permissions : editableFaculty && editableFaculty.permissions,
		},
		showPassword: false,
		redirect: false
	})

	// better to use nested properties from state
	const { profile, showPassword, redirect } = state


	// TODO: have to handle in coming props
	// Alert: it's is very important

	// useEffect(() => {

	// } , [profile, editableFaculty])


	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (!validateMobileNumber(profile.Phone)) {
			return window.alert("Please provide correct phone number!")
		}

		if (profile.Password.length !== 128) {
			hash(profile.Password)
				.then(hashed => {
					dispatch(createFacultyMerge({ ...profile, Password: hashed }))
				})

			// TODO: show RHT
			// also think about the redirection
			setTimeout(() => {
				setState({ ...state, redirect: '/staff' })
			}, 1500)

		} else {
			dispatch(createFacultyMerge(profile))

			// TODO: show RHT
			// for now adding windows.alert

			setTimeout(() => {
				window.alert("Profile updated")
			}, 1500)
		}
	}

	const handleInput = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>) => {
		const { name, value, checked, type } = event.target

		setState({ ...state, profile: { ...profile, [name]: value } })
	}

	const handleInputByPath = (path: string[], value: boolean) => {
		const updatedProfile = Dynamic.put(profile, path, value) as MISTeacher
		setState({ ...state, profile: updatedProfile })
	}

	const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		getImageString(e)
			.then(res => getDownsizedImage(res, 180, "jpeg"))
			.then(imgString => {

				dispatch(uploadFacultyProfilePicture(profile.id, imgString))

			})
	}

	const deleteStaff = () => {
		// for using window confirmation
		// will change it to Alert Modal

		if (window.confirm("Are you sure you want to delete?")) {
			dispatch(deleteFaculty(profile.id))

			setTimeout(() => {
				setState({ ...state, redirect: '/staff' })
			}, 1000)
		}

		// TODO: show RHT
	}

	// this will only works when new users would be creating or delete action happen
	if (redirect) {
		return (
			<Redirect to={redirect as string} />
		)
	}

	return (
		<AppLayout title={`${isNewStaff ? "New Staff" : "Update Staff"}`}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">{isNewStaff ? "Add Staff" : 'Update Staff'}</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="text-white text-center text-base my-5">Personal Information</div>
					<div className="flex flex-row items-baseline justify-between w-3/5">
						<div className="bg-white p-1 rounded-full text-teal-500">
							<svg className="w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<div className="w-24 h-24">
							<img className="rounded-full" src={UserIconSvg} alt="faculty" />
						</div>
						<label className="bg-white p-1 rounded-full text-teal-500">
							<input type="file" className="hidden" accept="image/*" onChange={handleProfileImage} />
							<svg className="w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
							</svg>
						</label>
					</div>
					<form id='admin-account' className="text-white space-y-4 px-4" onSubmit={handleSubmit}>
						<div>Full Name*</div>
						<input
							name="Name"
							onChange={handleInput}
							required
							value={profile.Name}
							placeholder="e.g. John Doe"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />


						<div>Gender</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={"male"}
									checked={profile.Gender === "male"}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Male</div>
							</div>
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={"female"}
									checked={profile.Gender === "female"}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Female</div>
							</div>
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={"other"}
									checked={profile.Gender === "other"}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Other</div>
							</div>
						</div>

						<div>Staff Type</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center mr-2">
								<input
									name="Type"
									onChange={handleInput}
									type="radio"
									value={StaffType.TEACHING}
									checked={profile.Type === StaffType.TEACHING}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Teaching Staff</div>
							</div>
							<div className="flex items-center">
								<input
									name="Type"
									onChange={handleInput}
									type="radio"
									value={StaffType.NON_TEACHING}
									checked={profile.Type === StaffType.NON_TEACHING}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Non-Teaching Staff</div>
							</div>
						</div>

						<div>CNIC</div>
						<input
							name="CNIC"
							onChange={handleInput}
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div>Personal Contact*</div>
						<input
							name="Phone"
							onChange={handleInput}
							required
							value={profile.Phone}
							placeholder="e.g. 03xxxxxxxx"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div>Password*</div>
						<div className="w-full relative">
							<input
								name="Password"
								required
								value={profile.Password}
								onChange={handleInput}
								type={showPassword ? 'text' : 'password'}
								autoCapitalize="off"
								autoCorrect="off"
								autoComplete="off"
								placeholder="Enter password"
								className="tw-input w-full bg-transparent border-blue-brand ring-1" />
							<div
								onClick={() => setState({ ...state, showPassword: !showPassword })}
								className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
								{
									<EyePassword open={showPassword} />
								}
							</div>
						</div>

						{/* 
							TODO: Change salary from string to number in typings
						*/}
						<div>Salary</div>
						<input
							name="Salary"
							type="number"
							value={profile.Salary}
							onChange={handleInput}
							placeholder="e.g. 10,000 PKR"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div className="text-lg font-semibold text-center">Additional Information</div>

						<div>Marital Status</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									name="Married"
									onChange={() => handleInputByPath(["Married"], false)}
									type="radio"
									checked={!profile.Married}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Single</div>
							</div>
							<div className="flex items-center">
								<input
									name="Married"
									onChange={() => handleInputByPath(["Married"], true)}
									type="radio"
									checked={profile.Married}
									className="mr-2 w-4 h-4" />
								<div className="text-sm">Married</div>
							</div>
						</div>

						<div>{profile.Married ? "Spouse Name" : "Father Name"}</div>
						<input
							name="ManName"
							onChange={handleInput}
							value={profile.ManName}
							placeholder="e.g. John Doe"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div>{profile.Married ? "Spouse CNIC" : "Father CNIC"}</div>
						<input
							name="ManCNIC"
							value={profile.ManCNIC}
							onChange={handleInput}
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div>Address</div>
						<textarea
							name="Address"
							value={profile.Address}
							onChange={handleInput}
							rows={2}
							placeholder="street address"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />


						<div className="text-lg font-semibold text-center">Educational Information</div>

						<div className="flex flex-row flex-wrap justify-between space-x-2">
							<div className="flex flex-col space-y-1">
								<div>Qualification</div>
								<select
									name="Qualification"
									onChange={handleInput}
									className="tw-select"
									value={profile.Qualification}>
									<option>Select</option>
									{
										Object.entries(Qualification)
											.map(([k, v]) => (
												<option key={k} value={k}>{v}</option>
											))
									}
								</select>
							</div>
							<div className="flex flex-col space-y-1">
								<div>Experience</div>
								<select
									name="Experience"
									onChange={handleInput}
									className="tw-select"
									value={profile.Experience}>
									<option>Select</option>
									{
										Object.entries(Experience)
											.map(([k, v]) => (
												<option key={k} value={k}>{v}</option>
											))
									}
								</select>
							</div>
						</div>

						<div className="flex flex-row justify-between space-x-2 items-center">
							<div className="flex flex-col space-y-1">
								<div>Join Date</div>
								<input
									name="HireDate"
									type="date"
									value={profile.HireDate}
									onChange={handleInput}
									className="tw-select w-36 text-sm px-1.5"
								/>
							</div>
							<div className="flex flex-col space-y-1">
								<div>Active Status</div>
								<SwitchButton
									state={profile.Active}
									callback={() => handleInputByPath(["Active"], !profile.Active)} />
							</div>
						</div>

						{!profile.SubAdmin &&
							<SwitchButton title={"Admin Status"}
								state={profile.Admin}
								callback={() => handleInputByPath(["Admin"], !profile.Admin)} />
						}

						{!profile.Admin &&
							<SwitchButton title={"Sub Admin Status"}
								state={profile.SubAdmin}
								callback={() => handleInputByPath(["SubAdmin"], !profile.SubAdmin)} />
						}

						{
							!profile.Admin && <>
								<SwitchButton title={"Allow Setup View"}
									state={profile?.permissions?.setupPage}
									callback={() => handleInputByPath(["permissions", "setupPage"], !profile?.permissions?.setupPage)} />

								<SwitchButton title={"Allow Daily Stats View"}
									state={profile?.permissions?.dailyStats}
									callback={() => handleInputByPath(["permissions", "dailyStats"], !profile?.permissions?.dailyStats)} />

								<SwitchButton title={"Allow Fee Info View"}
									state={profile?.permissions?.fee}
									callback={() => handleInputByPath(["permissions", "fee"], !profile?.permissions?.fee)} />

								<SwitchButton title={"Allow Expense View"}
									state={profile?.permissions?.expense}
									callback={() => handleInputByPath(["permissions", "expense"], !profile?.permissions?.expense)} />

								<SwitchButton title={"Allow Prospective View"}
									state={profile?.permissions?.prospective}
									callback={() => handleInputByPath(["permissions", "prospective"], !profile?.permissions?.prospective)} />

								<SwitchButton title={"Allow Family View"}
									state={profile?.permissions?.family}
									callback={() => handleInputByPath(["permissions", "family"], !profile?.permissions?.family)} />
							</>
						}

						<button type="submit" className={"w-full items-center tw-btn-blue py-3 font-semibold my-4"}>
							{isNewStaff ? 'Save' : 'Update'}
						</button>
						{
							!isNewStaff &&
							<button
								type="button"
								onClick={deleteStaff}
								className={"w-full items-center tw-btn-red py-3 font-semibold my-4"}>Delete</button>
						}

					</form>
				</div>
			</div>
		</AppLayout>
	)
}