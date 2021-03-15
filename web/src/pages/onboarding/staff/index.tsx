import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'node-uuid'
import { hash } from 'utils'
import Dynamic from '@cerp/dynamic'
import moment from 'moment'
import toast from 'react-hot-toast'

import { SwitchButton } from 'components/input/switch'
import { isValidPhone } from 'utils/helpers'
import { ShowHidePassword } from 'components/password'
import { createFacultyMerge, uploadFacultyProfilePicture } from 'actions'
import { createMerges } from 'actions/core'
import { OnboardingStage, StaffType } from 'constants/index'

import { getDownsizedImage, getImageString } from 'utils/image'
import { UploadImage } from 'components/image'

interface AddStaffProps {
	onBack?: (close: boolean) => void
	skipStage: (stage?: MISOnboarding['stage']) => void
}

// TODO: move this to single source of defaults
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
	HireDate: moment().format('MM-DD-YYYY'),
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
	Type: StaffType.TEACHING
})

const Qualification: Record<string, string> = {
	matric: 'Matric',
	intermediate: 'Intermediate',
	graduation: 'Graduation',
	masters: 'Masters',
	phd: 'PhD',
	other: 'Other'
}

type State = {
	profile: MISTeacher
	showHidePassword: boolean
	showAdditionalFields: boolean
}

export const AddStaff: React.FC<AddStaffProps> = ({ skipStage }) => {
	const dispatch = useDispatch()

	const { faculty } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		profile: blankTeacher(),
		showHidePassword: false,
		showAdditionalFields: false
	})

	const { profile, showAdditionalFields, showHidePassword } = state

	useEffect(() => {
		setState(prevState => ({
			...prevState,
			profile: {
				...prevState.profile,
				ProfilePicture: faculty[prevState.profile.id]?.ProfilePicture
			}
		}))
	}, [faculty])

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (!isValidPhone(profile.Phone)) {
			return toast.error('Please provide correct phone number.')
		}

		hash(profile.Password).then(hashed => {
			dispatch(createFacultyMerge({ ...state.profile, Password: hashed }, false))
			dispatch(
				createMerges([
					{
						path: ['db', 'onboarding', 'stage'],
						value: OnboardingStage.ADD_CLASS
					}
				])
			)

			toast.success('New staff has been added.')
		})
	}

	const handleInput = (
		event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>
	) => {
		const { name, value } = event.target

		setState({ ...state, profile: { ...state.profile, [name]: value } })
	}

	const handleInputByPath = (path: string[], value: boolean) => {
		const updatedState = Dynamic.put(state, path, value) as State
		setState(updatedState)
	}

	const uploadProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		getImageString(e)
			.then(res => getDownsizedImage(res, 180, 'jpeg'))
			.then(imgString => {
				dispatch(uploadFacultyProfilePicture(profile.id, imgString))
				toast.success('Image uploaded')
			})
	}

	const uploadProfileImageFromCamera = (imgString: string) => {
		getDownsizedImage(imgString, 600, 'jpeg').then(img => {
			dispatch(uploadFacultyProfilePicture(state.profile.id, img))
			toast.success('Image uploaded')
		})
	}

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 my-4 py-4 md:mt-8">
			<div className="text-white text-center text-base mb-4">Please fill Information</div>
			<div className="flex flex-row items-baseline justify-between w-3/5 md:w-1/4">
				<UploadImage
					src={profile.ProfilePicture?.url || profile.ProfilePicture?.image_string}
					handleImageChange={uploadProfileImage}
					handleCameraImageTaken={uploadProfileImageFromCamera}
				/>
			</div>
			<form id="admin-account" className="text-white space-y-4 px-4" onSubmit={handleSubmit}>
				<div className="">Name*</div>
				<input
					name="Name"
					onChange={handleInput}
					required
					placeholder="Type name here"
					className="tw-input w-full bg-transparent border-blue-brand ring-1"
				/>
				<div className="">Personal Number*</div>
				<input
					name="Phone"
					onChange={handleInput}
					required
					placeholder="e.g. 03xxxxxxxx"
					className="tw-input w-full bg-transparent border-blue-brand ring-1"
				/>
				<div className="">Password*</div>
				<div className="w-full relative">
					<input
						name="Password"
						required
						onChange={handleInput}
						type={showHidePassword ? 'text' : 'password'}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						placeholder="Enter password"
						className="tw-input w-full bg-transparent border-blue-brand ring-1"
					/>
					<div
						onClick={() => setState({ ...state, showHidePassword: !showHidePassword })}
						className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
						{<ShowHidePassword open={showHidePassword} />}
					</div>
				</div>

				<div className="">Staff Type</div>
				<div className="flex items-center">
					<input
						name="type"
						onChange={handleInput}
						type="radio"
						value={StaffType.TEACHING}
						checked={profile.Type === StaffType.TEACHING}
						className="mr-2 w-4 h-4"
					/>
					<div className="text-sm">Teaching Staff</div>
				</div>

				{!showAdditionalFields && (
					<div className="flex flex-row items-center justify-between">
						<div
							onClick={() =>
								setState({ ...state, showAdditionalFields: !showAdditionalFields })
							}
							className="w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">
							+
						</div>
						<div className="text-sm">Show Additional Fields</div>
					</div>
				)}
				{showAdditionalFields && (
					<>
						<div className="">Gender</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={'male'}
									checked={profile.Gender === 'male'}
									className="mr-2 w-4 h-4"
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
									className="mr-2 w-4 h-4"
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
									className="mr-2 w-4 h-4"
								/>
								<div className="text-sm">Other</div>
							</div>
						</div>

						<div className="">CNIC</div>
						<input
							name="CNIC"
							onChange={handleInput}
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full bg-transparent border-blue-brand ring-1"
						/>

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

						<div className="flex flex-row items-center justify-between">
							<div
								onClick={() =>
									setState({
										...state,
										showAdditionalFields: !showAdditionalFields
									})
								}
								className="w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-red-brand hover:bg-red-500">
								-
							</div>
							<div className="text-sm">Hide Additional Fields</div>
						</div>
					</>
				)}

				<SwitchButton
					title={'Admin Status'}
					state={profile.Admin}
					callback={() => handleInputByPath(['profile', 'Admin'], !profile.Admin)}
				/>

				{!profile.Admin && (
					<>
						<SwitchButton
							title={'Allow Setup View'}
							state={profile.permissions.setupPage}
							callback={() =>
								handleInputByPath(
									['profile', 'permissions', 'setupPage'],
									!profile.permissions.setupPage
								)
							}
						/>

						<SwitchButton
							title={'Allow Daily Stats View'}
							state={profile.permissions.dailyStats}
							callback={() =>
								handleInputByPath(
									['profile', 'permissions', 'dailyStats'],
									!profile.permissions.dailyStats
								)
							}
						/>

						<SwitchButton
							title={'Allow Fee Info View'}
							state={profile.permissions.fee}
							callback={() =>
								handleInputByPath(['permissions', 'fee'], !profile.permissions.fee)
							}
						/>

						<SwitchButton
							title={'Allow Expense View'}
							state={profile.permissions.expense}
							callback={() =>
								handleInputByPath(
									['profile', 'permissions', 'expense'],
									!profile.permissions.expense
								)
							}
						/>

						<SwitchButton
							title={'Allow Prospective View'}
							state={profile.permissions.prospective}
							callback={() =>
								handleInputByPath(
									['profile', 'permissions', 'prospective'],
									!profile.permissions.prospective
								)
							}
						/>

						<SwitchButton
							title={'Allow Family View'}
							state={profile.permissions.family}
							callback={() =>
								handleInputByPath(
									['profile', 'permissions', 'family'],
									!profile.permissions.family
								)
							}
						/>
					</>
				)}

				<button
					type="submit"
					className={'w-full items-center tw-btn-blue py-3 font-semibold my-4'}>
					Save
				</button>

				<button
					type="button"
					onClick={() => skipStage()}
					className={'w-full items-center tw-btn bg-orange-brand'}>
					Skip
				</button>
			</form>
		</div>
	)
}
