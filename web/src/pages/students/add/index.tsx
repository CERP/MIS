import React, { useEffect, useMemo, useState } from 'react'
import Dynamic from '@cerp/dynamic'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { v4 } from 'node-uuid'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import moment from 'moment'
import toast from 'react-hot-toast'

import { createStudentMerge, deleteStudentById, uploadStudentProfilePicture } from 'actions'
import { SwitchButton } from 'components/input/switch'
import toTitleCase from 'utils/toTitleCase'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import AdmissionForm from 'components/Printable/Student/admissionform'
import { isValidPhone } from 'utils/helpers'
import { formatCNIC } from 'utils'
import { getImageString, getDownsizedImage } from 'utils/image'

import { PhoneIcon } from '@heroicons/react/solid'
import { UploadImage } from 'components/image'
import { PlusButton } from 'components/Button/plus'
import { cnicRegex, numberRegex } from 'constants/index'
import { PhoneInput } from 'components/input/PhoneInput'
import PhoneCall from 'components/Phone/PhoneCall'

const blankStudent = (): MISStudent => ({
	id: v4(),
	Name: '',
	RollNumber: '',
	BForm: '',
	Gender: '',
	Phone: '',
	AlternatePhone: '',
	Fee: 0,
	Active: true,

	ManCNIC: '',
	ManName: '',
	Birthdate: '',
	Address: '',
	Notes: '',
	StartDate: new Date().getTime(),
	AdmissionNumber: '',
	BloodType: '',
	FamilyID: '',
	Religion: '',

	fees: {},
	payments: {},
	attendance: {},
	section_id: '',
	tags: {},
	exams: {},
	certificates: {},
	prospective_section_id: ''
})

interface RouteInfo {
	id: string
}

type State = {
	profile: MISStudent
	redirect: string | boolean
	newTag: string
	classId?: string
}

export const CreateOrUpdateStudent = () => {
	const history = useHistory()
	const { id } = useParams<RouteInfo>()
	const isNewStudent = () => location.pathname.indexOf('new') >= 0

	const dispatch = useDispatch()
	const {
		db: { students, classes, settings, assets }
	} = useSelector((state: RootReducerState) => state)

	const student = students[id]
		? students[id].tags
			? students[id]
			: {
				...students[id],
				tags: {}
			}
		: blankStudent()

	const [state, setState] = useState<State>({
		profile: student,
		redirect: false,
		newTag: ''
	})

	useEffect(() => {
		if (isNewStudent()) {
			return
		}

		const nextStudent = students[id]

		if (nextStudent) {
			setState(prevState => ({ ...prevState, profile: nextStudent }))
		}
	}, [students])

	const uniqueTags = useMemo(() => {
		const tags = new Set<string>()

		Object.values(students)
			.filter(s => s.id && s.Name)
			.forEach(s => {
				Object.keys(s.tags ?? {}).forEach(tag => tags.add(tag))
			})

		return tags
	}, [])

	const sections = useMemo(() => getSectionsFromClasses(classes), [classes])

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (!isValidPhone(state.profile.Phone) && state.profile.Phone !== '') {
			return toast.error('Please provide correct phone number.')
		}

		if (isNewStudent()) {
			for (const student of Object.values(students)) {
				if (
					student.RollNumber === state.profile.RollNumber &&
					state.profile.RollNumber != ''
				) {
					toast.error('This Roll Number is already assigned to an existing student')
					return
				}
				if (
					student.AdmissionNumber === state.profile.AdmissionNumber &&
					state.profile.AdmissionNumber != ''
				) {
					toast.error('This Admission Number is already assigned to an existing student')
					return
				}
			}
		}

		// TODO: introduce object props trim()
		dispatch(createStudentMerge(state.profile))

		const msg = isNewStudent()
			? 'New student has been added.'
			: 'Student profile has been updated.'
		toast.success(msg)

		if (isNewStudent()) {
			setTimeout(() => {
				setState({ ...state, redirect: '/students' })
			}, 1500)
		}
	}

	const handleInput = (
		event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>
	) => {
		const { name, value } = event.target

		if (name === 'ManCNIC' || name === 'BForm') {
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
				...state.profile,
				[name]: value
			}
		})
	}

	const handleInputByPath = (
		path: string[],
		value: string | number | boolean,
		resetPath?: string[]
	) => {
		let updatedState = Dynamic.put(state, path, value)

		// if there's path whose value should be set to an empty string
		if (resetPath) {
			updatedState = Dynamic.put(updatedState, resetPath, '')
		}

		setState(updatedState)
	}

	const deleteByPath = (path: string[]) => {
		const updatedState = Dynamic.delete(state, path) as State
		setState(updatedState)
	}

	const uploadProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		getImageString(e)
			.then(res => getDownsizedImage(res, 180, 'jpeg'))
			.then(imgString => {
				dispatch(uploadStudentProfilePicture(state.profile, imgString))
			})
	}

	const deleteStudent = () => {
		// TODO: for now using window confirmation
		// will change it to Alert Modal

		if (window.confirm('There is no undo, Are you sure you want to delete?')) {
			dispatch(deleteStudentById(state.profile.id))

			toast.success('Student has been deleted.')

			setTimeout(() => {
				setState({ ...state, redirect: '/students' })
				history.goBack()
			}, 1000)
		}
	}

	const addTag = () => {
		if (!state.newTag.trim()) {
			return
		}

		handleInputByPath(['profile', 'tags', state.newTag], true, ['newTag'])
	}

	const takeImage = (imgString: string) => {
		getDownsizedImage(imgString, 600, 'jpeg').then(img => {
			setState({
				...state,
				profile: {
					...state.profile,
					ProfilePicture: { ...state.profile.ProfilePicture, image_string: img }
				}
			})
			dispatch(uploadStudentProfilePicture(state.profile, img))
		})
	}
	if (state.redirect && isNewStudent()) {
		history.goBack()
	}
	return (
		<>
			<div className="relative px-5 text-gray-700 md:pb-0 print:hidden">
				<div
					className={clsx(
						'flex flex-col items-center pb-6 my-4 space-y-3 bg-gray-700 md:w-4/5 md:mx-auto rounded-2xl',
						{
							'md:mt-8': isNewStudent()
						}
					)}>
					<div className="my-5 text-base text-center text-white font-semibold">
						Personal Information
					</div>
					<div className="flex flex-row items-baseline justify-between w-3/5 md:w-1/4">
						<UploadImage
							src={
								state.profile.ProfilePicture?.url ??
								state.profile.ProfilePicture?.image_string
							}
							handleImageChange={uploadProfileImage}
							handleCameraImageTaken={takeImage}
						/>
					</div>
					<form
						id="student-form"
						className="w-full px-4 space-y-4 text-white md:w-3/5"
						onSubmit={handleSubmit}>
						<div>Full Name*</div>
						<input
							name="Name"
							onChange={handleInput}
							required
							value={state.profile.Name}
							placeholder="Name is Required"
							className="w-full bg-transparent tw-input border-blue-brand ring-1"
						/>

						<div>Father/Gaurdian Name</div>
						<input
							name="ManName"
							onChange={handleInput}
							value={state.profile.ManName}
							placeholder="Type name"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div>Gender</div>
						<div className="flex flex-wrap items-center justify-between">
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={'male'}
									checked={state.profile.Gender === 'male'}
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
									checked={state.profile.Gender === 'female'}
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
									checked={state.profile.Gender === 'other'}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Other</div>
							</div>
						</div>

						<div>Class-Section*</div>
						<select
							name="section_id"
							required
							value={state.profile.section_id}
							onChange={handleInput}
							className="w-full tw-select">
							<option value={''}>Choose</option>
							{sections
								.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
								.filter(s => s && s.id && s.name)
								.map(s => (
									<option key={s.id} value={s.id}>
										{toTitleCase(s.namespaced_name, '-')}
									</option>
								))}
						</select>

						<div className="flex flex-row items-center justify-between space-x-4">
							<div className="flex flex-col space-y-4">
								<div>Roll #</div>
								<input
									name="RollNumber"
									onChange={handleInput}
									value={state.profile.RollNumber}
									placeholder="Type roll #"
									className="tw-input w-full tw-is-form-bg-black"
								/>
							</div>
							<div className="flex flex-col space-y-4">
								<div>Admission #</div>
								<input
									name="AdmissionNumber"
									onChange={handleInput}
									value={state.profile.AdmissionNumber}
									placeholder="Type admimission #"
									className="tw-input w-full tw-is-form-bg-black"
								/>
							</div>
						</div>

						<div>Contact Number</div>
						<div className="flex flex-row w-full">
							<div className="flex w-full flex-col ">
								<PhoneInput
									name="Phone"
									value={state.profile.Phone}
									error={
										numberRegex.test(state.profile.Phone) ||
										!(state.profile.Phone?.length <= 11)
									}
									onChange={handleInput}
									className="tw-input w-full tw-is-form-bg-black"
								/>
							</div>
							<PhoneCall phone={state.profile.Phone} />
						</div>
						<div className="text-lg font-semibold text-center">
							Additional Information
						</div>
						<div>Date of Birth</div>
						<input
							name="Birthdate"
							type="date"
							value={moment(state.profile.Birthdate).format('YYYY-MM-DD')}
							onChange={handleInput}
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div>B-Form Number</div>
						<input
							name="BForm"
							onChange={handleInput}
							value={state.profile.BForm}
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div>Father/Gaurdian CNIC</div>
						<input
							name="ManCNIC"
							onChange={handleInput}
							value={state.profile.ManCNIC}
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div>Alternative Contact Number</div>
						<div className="flex flex-row w-full">
							<div className="flex w-full flex-col ">
								<PhoneInput
									name="AlternatePhone"
									value={state.profile.AlternatePhone}
									error={
										numberRegex.test(state.profile.AlternatePhone) ||
										!(state.profile.AlternatePhone?.length <= 11)
									}
									onChange={handleInput}
									className="tw-input w-full tw-is-form-bg-black"
								/>
							</div>
							<PhoneCall phone={state.profile.AlternatePhone} />
						</div>

						<div>Address</div>
						<textarea
							name="Address"
							value={state.profile.Address}
							onChange={handleInput}
							rows={2}
							placeholder="Type street address"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div>Notes</div>
						<textarea
							name="Notes"
							value={state.profile.Notes}
							onChange={handleInput}
							rows={2}
							placeholder="Type notes"
							className="tw-input w-full tw-is-form-bg-black"
						/>

						<div className="flex flex-row items-center justify-between space-x-4">
							<div className="flex flex-col space-y-4">
								<div>Admission Date</div>
								<input
									name="StartDate"
									type="date"
									defaultValue={moment(state.profile.StartDate).format(
										'YYYY-MM-DD'
									)}
									onChange={e =>
										handleInputByPath(
											['profile', 'StartDate'],
											e.target.valueAsNumber
										)
									}
									className="tw-input w-full tw-is-form-bg-black"
								/>
							</div>
							<div className="flex flex-col space-y-4">
								<div>Active Status</div>
								<SwitchButton
									state={state.profile.Active}
									callback={() =>
										handleInputByPath(
											['profile', 'Active'],
											!state.profile.Active
										)
									}
								/>
							</div>
						</div>

						<div className="text-center">Tags</div>
						<div className="grid grid-cols-4 gap-3 md:grid-cols-5">
							{Object.entries(state.profile.tags).map(([tag, value], index) => (
								<div
									onClick={() => deleteByPath(['profile', 'tags', tag])}
									key={tag + index}
									className={clsx(
										'text-center p-1 border rounded-xl text-white text-sm',
										{
											'bg-teal-brand': value
										}
									)}>
									<span>{tag}</span>
								</div>
							))}
						</div>
						<div className="flex flex-row items-center justify-between">
							<datalist id="tag-list">
								{[...uniqueTags].map(tag => (
									<option key={tag}>{tag}</option>
								))}
							</datalist>
							<input
								list="tag-list"
								value={state.newTag}
								onChange={e => handleInputByPath(['newTag'], e.target.value)}
								placeholder="Select or type new tag"
								autoComplete="off"
								className="tw-input w-full tw-is-form-bg-black"
							/>
							<PlusButton handleClick={addTag} className="ml-4" />
						</div>

						{/* <div className="flex flex-row items-center">
							<PlusButton
								handleClick={() => console.log('Not Implemented Yet')}
								className="mr-4"
							/>
							<div>Show Payment Section</div>
						</div> */}

						<div className="flex flex-row justify-center space-x-4">
							<button
								type="button"
								onClick={() => window.print()}
								className="items-center w-full py-3 my-4 font-semibold tw-btn-blue">
								Print Form
							</button>

							<button
								type={'submit'}
								className="items-center w-full py-3 my-4 font-semibold tw-btn bg-teal-brand">
								{isNewStudent() ? 'Save' : 'Update'}
							</button>
						</div>

						{!isNewStudent() && (
							<button
								type={'button'}
								onClick={deleteStudent}
								className="items-center w-full py-3 my-4 font-semibold tw-btn-red">
								Delete
							</button>
						)}
					</form>
				</div>
			</div>
			{/* TODO: fix styling of print page */}
			<AdmissionForm
				student={state.profile}
				school={{
					name: settings.schoolName,
					code: settings.schoolCode,
					logo: assets.schoolLogo || '',
					phone: settings.schoolPhoneNumber,
					address: settings.schoolAddress
				}}
				classes={classes}
			/>
		</>
	)
}
