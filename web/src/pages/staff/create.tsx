import React, { useEffect, useState } from 'react'
import { v4 } from 'node-uuid'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation, useParams } from 'react-router-dom'
import clsx from 'clsx'
import moment from 'moment'
import Dynamic from '@cerp/dynamic'
import toast from 'react-hot-toast'

import { SwitchButton } from 'components/input/switch'
import { isValidPhone } from 'utils/helpers'
import { createFacultyMerge, deleteFaculty, uploadFacultyProfilePicture } from 'actions'
import { cnicRegex, StaffType } from 'constants/index'
import { ShowHidePassword } from 'components/password'
import { hash, formatCNIC } from 'utils'
import { getImageString, getDownsizedImage } from 'utils/image'
import { PhoneIcon } from '@heroicons/react/solid'

import { UploadImage } from 'components/image'
import { numberRegex } from 'constants/index'
import { PhoneInput } from 'components/input/PhoneInput'
import PhoneCall from 'components/Phone/PhoneCall'

const blankTeacher = (): MISTeacher => ({
	id: v4(),
	Name: '',
	CNIC: '',
	Gender: '',
	Username: '',
	Password: '',
	Married: false,
	Phone: '',
	Salary: '',
	Active: true,

	ManCNIC: '',
	ManName: '',
	Birthdate: '',
	Address: '',
	StructuredQualification: '',
	Qualification: '',
	Experience: '',
	HireDate: moment().format('YYYY-MM-DD'),
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
	Type: ''
})

const Qualification: Record<string, string> = {
	matric: 'Matric',
	intermediate: 'Intermediate',
	graduation: 'Graduation',
	masters: 'Masters',
	phd: 'PhD',
	other: 'Other'
}

const Experience: Record<string, string> = {
	A: '<1 year',
	B: '<2 years',
	C: '<4 years',
	D: '<6 years',
	E: '<8 years',
	F: '<10 years',
	G: '>=10 years'
}

interface RouteInfo {
	id: string
}

type StateProps = {
	profile: MISTeacher
	showPassword: boolean
	redirect: string
}

export const CreateOrUpdateStaff = () => {
	const { id } = useParams<RouteInfo>()
	const location = useLocation()
	const isNewStaff = () => location.pathname.indexOf('new') >= 0

	const dispatch = useDispatch()
	const { faculty } = useSelector((state: RootReducerState) => state.db)
	const { faculty_id } = useSelector((state: RootReducerState) => state.auth)
	const { Admin } = faculty[faculty_id]

	const existingStaff = faculty[id]

	const [state, setState] = useState<StateProps>({
		profile: {
			...(existingStaff ?? blankTeacher()),
			HasLogin: isNewStaff() ? true : existingStaff && existingStaff.HasLogin,
			permissions: isNewStaff()
				? blankTeacher().permissions
				: existingStaff && existingStaff.permissions
		},
		showPassword: false,
		redirect: ''
	})

	// better to use nested properties from state
	const { profile, showPassword, redirect } = state

	useEffect(() => {
		if (isNewStaff()) {
			return
		}

		const nextStaff = faculty[id]
		if (nextStaff) {
			setState(prevState => ({ ...prevState, profile: nextStaff }))
		}
	}, [faculty])

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (!isValidPhone(profile.Phone) && profile.Phone !== '') {
			return toast.error('Please provide correct phone number!')
		}

		if (profile.Password.length !== 128) {
			hash(profile.Password).then(hashed => {
				dispatch(createFacultyMerge({ ...profile, Password: hashed }))
			})
			if (isNewStaff()) {
				toast.success('New staff has been added.')
			} else {
				toast.success('Staff profile has been updated.')
			}

			setTimeout(() => {
				setState({ ...state, redirect: '/staff' })
			}, 1500)
		} else {
			dispatch(createFacultyMerge(profile))

			toast.success('Staff profile has been updated.')
		}
	}

	// TODO: replace this with generic handler
	const handleInput = (
		event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>
	) => {
		const { name, value } = event.target

		if (name === 'ManCNIC' || name === 'CNIC') {
			if (value.length <= 15 && cnicRegex.test(value)) {
				return setState({
					...state,
					profile: {
						...state.profile,
						[name]: formatCNIC(value)
					}
				})
			}
			if (value === '') {
				return setState({
					...state,
					profile: {
						...state.profile,
						[name]: formatCNIC(value)
					}
				})
			}

			return
		}

		setState({
			...state,
			profile: {
				...profile,
				[name]: value
			}
		})
	}

	// TODO: replace this with generic handler
	const handleInputByPath = (path: string[], value: boolean) => {
		//Checks if Current user is admin and then allows editing of permissions
		if (['permissions', 'SubAdmin', 'Admin'].some(i => path.includes(i))) {
			if (!Admin) {
				return toast.error('You are not allowed to set permissions')
			}
		}
		const updatedProfile = Dynamic.put(profile, path, value) as MISTeacher
		setState({ ...state, profile: updatedProfile })
	}

	const uploadProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		getImageString(e)
			.then(res => getDownsizedImage(res, 180, 'jpeg'))
			.then(imgString => {
				dispatch(uploadFacultyProfilePicture(profile.id, imgString))
			})
	}

	const uploadProfileImageFromCamera = (imgString: string) => {
		getDownsizedImage(imgString, 600, 'jpeg').then(img => {
			setState({
				...state,
				profile: {
					...state.profile,
					ProfilePicture: { ...state.profile.ProfilePicture, image_string: img }
				}
			})
			dispatch(uploadFacultyProfilePicture(state.profile.id, img))
		})
	}

	const deleteStaff = () => {
		// TODO: for now using window confirmation
		// will change it to Alert Modal

		if (window.confirm('There is no undo, Are you sure you want to delete?')) {
			dispatch(deleteFaculty(profile.id))

			toast.success('Staff has been deleted.')

			setTimeout(() => {
				setState({ ...state, redirect: '/staff' })
			}, 1000)
		}
	}

	// this will only works when new users would be creating or delete action happen
	if (redirect) {
		return <Redirect to={redirect} />
	}

	return (
		<>
			<div className="px-5 text-gray-700 relative">
				<div
					className={clsx(
						'md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 py-5 mb-10',
						{
							'mt-8': isNewStaff()
						}
					)}>
					<div className="text-white text-center font-semibold my-2">
						Personal Information
					</div>
					{!isNewStaff() && (
						<div className="flex flex-row items-baseline justify-between w-3/5 md:w-1/4">
							<UploadImage
								src={
									state.profile.ProfilePicture?.url ??
									state.profile.ProfilePicture?.image_string
								}
								handleImageChange={uploadProfileImage}
								handleCameraImageTaken={uploadProfileImageFromCamera}
							/>
						</div>
					)}
					<form
						id="staff-form"
						className="text-white space-y-4 px-4 w-full md:w-3/5"
						onSubmit={handleSubmit}>
						<div>Full Name*</div>
						<input
							name="Name"
							onChange={handleInput}
							required
							value={profile.Name}
							placeholder="Type name"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div>Gender</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={'male'}
									checked={profile.Gender === 'male'}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Male</div>
							</div>
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={'female'}
									checked={profile.Gender === 'female'}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Female</div>
							</div>
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={'other'}
									checked={profile.Gender === 'other'}
									className="mr-2 form-radio tw-radio"
								/>
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
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Teaching Staff</div>
							</div>
							<div className="flex items-center">
								<input
									name="Type"
									onChange={handleInput}
									type="radio"
									value={StaffType.NON_TEACHING}
									checked={profile.Type === StaffType.NON_TEACHING}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Non-Teaching Staff</div>
							</div>
						</div>

						<div>CNIC</div>
						<input
							name="CNIC"
							onChange={handleInput}
							value={profile.CNIC}
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div>Personal Contact</div>
						<div className="flex items-center flex-row w-full">
							<div className="flex w-full flex-col ">
								<PhoneInput
									name="Phone"
									value={profile.Phone}
									error={
										numberRegex.test(profile.Phone) ||
										!(profile.Phone?.length <= 11)
									}
									onChange={handleInput}
									className="tw-input w-full tw-is-form-bg-black"
								/>
							</div>
							<PhoneCall phone={profile.Phone} />
						</div>
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
								className="tw-input w-full tw-is-form-bg-black"
							/>
							<div
								onClick={() => setState({ ...state, showPassword: !showPassword })}
								className="absolute bg-gray-700 cursor-pointer flex inset-y-0 items-center m-2  px-3 py-2 right-0">
								{<ShowHidePassword open={showPassword} />}
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
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div className="text-lg font-semibold text-center">
							Additional Information
						</div>

						<div>Marital Status</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									name="Married"
									onChange={() => handleInputByPath(['Married'], false)}
									type="radio"
									checked={!profile.Married}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Single</div>
							</div>
							<div className="flex items-center">
								<input
									name="Married"
									onChange={() => handleInputByPath(['Married'], true)}
									type="radio"
									checked={profile.Married}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Married</div>
							</div>
						</div>

						<div>
							{profile.Married
								? profile.Gender === 'male'
									? 'Father Name'
									: 'Spouse Name'
								: 'Father Name'}
						</div>
						<input
							name="ManName"
							onChange={handleInput}
							value={profile.ManName}
							placeholder="Type name"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div>
							{profile.Married
								? profile.Gender === 'male'
									? 'Father CNIC'
									: 'Spouse CNIC'
								: 'Father CNIC'}
						</div>
						<input
							name="ManCNIC"
							value={profile.ManCNIC}
							onChange={handleInput}
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div>Address</div>
						<textarea
							name="Address"
							value={profile.Address}
							onChange={handleInput}
							rows={2}
							placeholder="street address"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div className="text-lg font-semibold text-center">
							Educational Information
						</div>

						<div className="flex flex-row flex-wrap justify-between space-x-2">
							<div className="flex flex-col space-y-1">
								<div>Qualification</div>
								<select
									name="Qualification"
									onChange={handleInput}
									className="tw-select"
									value={profile.Qualification}>
									<option>Select</option>
									{Object.entries(Qualification).map(([k, v]) => (
										<option key={k} value={k}>
											{v}
										</option>
									))}
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
									{Object.entries(Experience).map(([k, v]) => (
										<option key={k} value={k}>
											{v}
										</option>
									))}
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
									callback={() => handleInputByPath(['Active'], !profile.Active)}
								/>
							</div>
						</div>

						{!profile.SubAdmin && (
							<SwitchButton
								title={'Admin Status'}
								state={profile.Admin}
								callback={() => handleInputByPath(['Admin'], !profile.Admin)}
							/>
						)}

						{!profile.Admin && (
							<SwitchButton
								title={'Sub Admin Status'}
								state={profile.SubAdmin}
								callback={() => handleInputByPath(['SubAdmin'], !profile.SubAdmin)}
							/>
						)}

						{!profile.Admin && (
							<>
								<SwitchButton
									title={'Allow Setup View'}
									state={profile?.permissions?.setupPage}
									callback={() =>
										handleInputByPath(
											['permissions', 'setupPage'],
											!profile?.permissions?.setupPage
										)
									}
								/>

								<SwitchButton
									title={'Allow Daily Stats View'}
									state={profile?.permissions?.dailyStats}
									callback={() =>
										handleInputByPath(
											['permissions', 'dailyStats'],
											!profile?.permissions?.dailyStats
										)
									}
								/>

								<SwitchButton
									title={'Allow Fee Info View'}
									state={profile?.permissions?.fee}
									callback={() =>
										handleInputByPath(
											['permissions', 'fee'],
											!profile?.permissions?.fee
										)
									}
								/>

								<SwitchButton
									title={'Allow Expense View'}
									state={profile?.permissions?.expense}
									callback={() =>
										handleInputByPath(
											['permissions', 'expense'],
											!profile?.permissions?.expense
										)
									}
								/>

								<SwitchButton
									title={'Allow Prospective View'}
									state={profile?.permissions?.prospective}
									callback={() =>
										handleInputByPath(
											['permissions', 'prospective'],
											!profile?.permissions?.prospective
										)
									}
								/>

								<SwitchButton
									title={'Allow Family View'}
									state={profile?.permissions?.family}
									callback={() =>
										handleInputByPath(
											['permissions', 'family'],
											!profile?.permissions?.family
										)
									}
								/>
							</>
						)}

						<button
							type="submit"
							className={'w-full items-center tw-btn-blue py-3 font-semibold my-4'}>
							{isNewStaff() ? 'Save' : 'Update'}
						</button>
						{!isNewStaff() && id !== faculty_id && (
							<button
								type="button"
								onClick={deleteStaff}
								className={
									'w-full items-center tw-btn-red py-3 font-semibold my-4'
								}>
								Delete
							</button>
						)}
					</form>
				</div>
			</div>
		</>
	)
}
