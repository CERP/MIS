import React, { useEffect, useMemo, useState } from 'react'
import Dynamic from '@cerp/dynamic'
import { RouteComponentProps } from 'react-router-dom'
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
import { AppLayout } from 'components/Layout/appLayout'
import { isValidPhone } from 'utils/helpers'
import { getImageString, getDownsizedImage } from 'utils/image'

import { UploadImage } from 'components/image'

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

type CreateOrUpdateStaffProps = RouteComponentProps<RouteInfo>

type State = {
	profile: MISStudent
	redirect: string | boolean
	newTag: string
	classId?: string
}

export const CreateOrUpdateStudent: React.FC<CreateOrUpdateStaffProps> = ({ match }) => {
	const { id } = match.params
	const isNewStudent = () => location.pathname.indexOf('new') >= 0

	const dispatch = useDispatch()
	const {
		auth,
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

		const nextStudent = students[match.params.id]

		if (nextStudent) {
			setState(prevState => ({ ...prevState, profile: nextStudent }))
		}
	}, [students])

	const uniqueTags = useMemo(() => {
		const tags = new Set<string>()

		Object.values(students)
			.filter(s => s.id && s.Name)
			.forEach(s => {
				Object.keys(s.tags || {}).forEach(tag => tags.add(tag))
			})

		return tags
	}, [])

	const sections = useMemo(() => getSectionsFromClasses(classes), [classes])

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (!isValidPhone(state.profile.Phone)) {
			return toast.error('Please provide correct phone number.')
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
		const { name, value, checked, type } = event.target

		setState({ ...state, profile: { ...state.profile, [name]: value } })
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
			dispatch(uploadStudentProfilePicture(state.profile, img))
		})
	}

	return (
		<AppLayout title={`${isNewStudent() ? 'New Student' : 'Update Student'}`}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative print:hidden">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">
					{isNewStudent() ? 'Add Student' : 'Update Student'}
				</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="text-white text-center text-base my-5">
						Personal Information
					</div>
					<div className="flex flex-row items-baseline justify-between w-3/5 md:w-1/4">
						<UploadImage
							src={
								state.profile.ProfilePicture?.url ||
								state.profile.ProfilePicture?.image_string
							}
							handleImageChange={uploadProfileImage}
							handleCameraImageTaken={takeImage}
						/>
					</div>
					<form
						id="student-form"
						className="text-white space-y-4 px-4 w-full md:w-3/5"
						onSubmit={handleSubmit}>
						<div>Full Name*</div>
						<input
							name="Name"
							onChange={handleInput}
							required
							value={state.profile.Name}
							placeholder="Type name"
							className="tw-input w-full bg-transparent border-blue-brand ring-1"
						/>

						<div>Gender</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									name="Gender"
									onChange={handleInput}
									type="radio"
									value={'male'}
									checked={state.profile.Gender === 'male'}
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
									checked={state.profile.Gender === 'female'}
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
									checked={state.profile.Gender === 'other'}
									className="mr-2 w-4 h-4"
								/>
								<div className="text-sm">Other</div>
							</div>
						</div>

						<div>Father/Gaurdian Name</div>
						<input
							name="ManName"
							onChange={handleInput}
							value={state.profile.ManName}
							placeholder="Type name"
							className="tw-input w-full bg-transparent border-blue-brand ring-1"
						/>

						{/* <div className="flex flex-row items-center space-x-4"> */}
						{/* <div className="flex flex-col space-y-4 w-full">
								<div>Class</div>
								<select
									name="classId"
									onChange={(e) => handleInputByPath(["classId"], e.target.value, ["profile", "section_id"])}
									className="tw-select">
									<option value={""}>Choose</option>
									{
										Object.values(classes)
											.filter(c => c)
											.map(c => (
												<option key={c.id} value={c.id}>{toTitleCase(c.name)}</option>
											))
									}
								</select>
							</div> */}
						{/* <div className="flex flex-col space-y-4 w-full"> */}
						<div>Class-Section</div>
						<select
							name="section_id"
							required
							value={state.profile.section_id}
							onChange={handleInput}
							className="tw-select w-full">
							<option value={''}>Choose</option>
							{
								// getSectionsFromClasses(state.classId ? { [state.classId]: classes[state.classId] } : {})
								sections
									.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
									.filter(s => s && s.id && s.name)
									.map(s => (
										<option key={s.id} value={s.id}>
											{toTitleCase(s.namespaced_name, '-')}
										</option>
									))
							}
						</select>
						{/* </div> */}
						{/* </div> */}

						<div className="flex flex-row justify-between items-center space-x-4">
							<div className="flex flex-col space-y-4">
								<div>Roll #</div>
								<input
									name="RollNumber"
									onChange={handleInput}
									value={state.profile.RollNumber}
									placeholder="Type roll #"
									className="tw-input w-full bg-transparent border-blue-brand ring-1"
								/>
							</div>
							<div className="flex flex-col space-y-4">
								<div>Admission #</div>
								<input
									name="AdmissionNumber"
									onChange={handleInput}
									value={state.profile.AdmissionNumber}
									placeholder="Type admimission #"
									className="tw-input w-full bg-transparent border-blue-brand ring-1"
								/>
							</div>
						</div>

						<div>Contact Number</div>
						<input
							name="Phone"
							onChange={handleInput}
							value={state.profile.Phone}
							placeholder="Type phone #"
							className="tw-input w-full bg-transparent border-blue-brand ring-1"
						/>

						<div className="text-lg font-semibold text-center">
							Additional Information
						</div>
						<div>Date of Birth</div>
						<input
							name="Birthdate"
							type="date"
							value={moment(state.profile.Birthdate).format('YYYY-MM-DD')}
							onChange={handleInput}
							className="tw-input tw-input w-full bg-transparent border-blue-brand ring-1"
						/>

						<div>B-Form Number</div>
						<input
							name="BForm"
							onChange={handleInput}
							value={state.profile.BForm}
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full bg-transparent border-blue-brand ring-1"
						/>

						<div>Father/Gaurdian CNIC</div>
						<input
							name="ManCNIC"
							onChange={handleInput}
							value={state.profile.ManCNIC}
							placeholder="xxxxx-xxxxxxx-x"
							className="tw-input w-full bg-transparent border-blue-brand ring-1"
						/>

						<div>Alternative Contact Number</div>
						<input
							name="AlternatePhone"
							onChange={handleInput}
							value={state.profile.AlternatePhone}
							placeholder="Type phone #"
							className="tw-input w-full bg-transparent border-blue-brand ring-1"
						/>

						<div>Address</div>
						<textarea
							name="Address"
							value={state.profile.Address}
							onChange={handleInput}
							rows={2}
							placeholder="Type street address"
							className="tw-input w-full bg-transparent border-blue-brand ring-1"
						/>

						<div className="flex flex-row justify-between space-x-4 items-center">
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
									className="tw-input w-full bg-transparent border-blue-brand ring-1"
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
						<div className="grid grid-cols-4 md:grid-cols-5 gap-3">
							{Object.entries(state.profile.tags).map(([tag, value], index) => (
								<div
									onClick={() => deleteByPath(['profile', 'tags', tag])}
									key={tag + index}
									className={clsx(
										'text-center p-1 border rounded-xl text-white text-sm',
										{
											'bg-teal-500': value
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
								className="tw-input w-full bg-transparent border-blue-brand ring-1"
							/>
							<div
								onClick={addTag}
								className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">
								+
							</div>
						</div>

						<div className="flex flex-row items-center">
							<div className="mr-4 w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer bg-blue-brand hover:bg-blue-400">
								+
							</div>
							<div>Show Payment Section</div>
						</div>

						<div className="flex flex-row justify-center space-x-4">
							<button
								type="button"
								onClick={() => window.print()}
								className="w-full items-center tw-btn-blue py-3 font-semibold my-4">
								Print Form
							</button>

							<button
								type={'submit'}
								className="w-full items-center tw-btn bg-green-brand py-3 font-semibold my-4">
								{isNewStudent() ? 'Save' : 'Update'}
							</button>
						</div>

						{!isNewStudent() && (
							<button
								type={'button'}
								onClick={deleteStudent}
								className="w-full items-center tw-btn-red py-3 font-semibold my-4">
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
		</AppLayout>
	)
}
