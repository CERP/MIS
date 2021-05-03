import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import Dynamic from '@cerp/dynamic'
import { UserIcon, TrashIcon, PhoneIcon } from '@heroicons/react/solid'

import { AppLayout } from 'components/Layout/appLayout'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { isValidStudent } from 'utils'
import { StudentDropdownSearch } from 'components/input/search'
import { addStudentToFamily, saveFamilyInfo } from 'actions'
import Hyphenator from 'utils/Hyphenator'
import toTitleCase from 'utils/toTitleCase'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { createMerges } from 'actions/core'

type SingleFamilyProps = RouteComponentProps<{ id: string }>

type State = Partial<MISStudent> & {
	siblings?: {
		[id: string]: MISStudent
	}
	redirectTo?: string
}

export const SingleFamily = ({ match, location }: SingleFamilyProps) => {
	const dispatch = useDispatch()
	const { students, classes, settings } = useSelector((state: RootReducerState) => state.db)

	const famId = match.params.id
	const isNewFam = location.pathname.indexOf('new') >= 0

	const siblings = getSiblings(famId, students)

	const [state, setState] = useState<State>({
		Phone: (siblings.find(s => s.Phone !== '') || { Phone: '' }).Phone,
		AlternatePhone: (siblings.find(s => s.AlternatePhone !== '') || { AlternatePhone: '' })
			.AlternatePhone,
		ManName: (siblings.find(s => s.ManName !== '') || { ManName: '' }).ManName,
		ManCNIC: (siblings.find(s => s.ManCNIC !== '') || { ManCNIC: '' }).ManCNIC,
		Address: (siblings.find(s => s.Address !== '') || { Address: '' }).Address
	})

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes)
	}, [classes])

	// make sure if all students removed from family, redirect to families module
	useEffect(() => {
		// to avoid redirect when famId = new, add isNewFam check
		if (!isNewFam && famId && siblings.length === 0) {
			setState(prevState => ({ ...prevState, redirectTo: '/families' }))
		}
	}, [siblings, famId, isNewFam])

	// to show warning msg to override sibling information, if it's different
	const siblingsUnMatchingInfo = () => {
		return siblings.some(
			s =>
				s.Phone !== siblings[0].Phone ||
				s.ManCNIC !== siblings[0].ManCNIC ||
				s.ManName !== siblings[0].ManName ||
				s.Address !== siblings[0].Address
		)
	}

	const handelAddStudent = (studentId: string) => {
		const student = students[studentId]

		// store students and wait for user to click on
		// save button to insert the students with input
		// family id
		if (isNewFam) {
			setState({
				...state,
				Phone: student.Phone,
				AlternatePhone: student.AlternatePhone ?? '',
				ManName: student.ManName,
				ManCNIC: student.ManCNIC,
				Address: student.Address,
				siblings: {
					...(state.siblings || {}),
					[studentId]: {
						...student,
						FamilyID: state.FamilyID?.replaceAll(' ', '-')
					}
				}
			})
		} else {
			// add student directly if famId exists
			dispatch(addStudentToFamily(student, famId))
			toast.success('Student has been added')
		}
	}

	const handleSave = () => {
		if (isNewFam) {
			if (!state.FamilyID) {
				toast.success('Please enter family name or id')
				return
			}

			// new addition of hyphen '-' in family name or id, if there's space
			const siblingStudents = Object.values(state.siblings).map(s => s)

			// dispatch an action to save students with new fam id
			const family: MISFamilyInfo = {
				ManCNIC: state.ManCNIC,
				ManName: state.ManName,
				Phone: state.Phone,
				Address: state.Address,
				AlternatePhone: state.AlternatePhone
			}

			console.log(siblingStudents, family)

			dispatch(saveFamilyInfo(siblingStudents, family, state.FamilyID))
			toast.success('New family has been created')

			// redirect to '/families'
			setTimeout(() => {
				setState({ ...state, redirectTo: '/families' })
			}, 1000)

			return
		}

		// Remove extra props here (state.siblings)
		dispatch(saveFamilyInfo(siblings, state as MISFamilyInfo))
		toast.success('Family information has been updated')
	}

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
	) => {
		const { name, value } = event.target

		if (name === 'ManCNIC') {
			setState({ ...state, ManCNIC: Hyphenator(value) })
			return
		}

		setState({ ...state, [name]: value })
	}

	const handleRemoveStudent = (student: MISStudent) => {
		if (isNewFam) {
			const updated = Dynamic.delete(state, ['siblings', student.id]) as State

			// check if there's no sibling, remove family info as well
			// from previously added student
			if (Object.keys(updated.siblings || {}).length === 0) {
				setState({
					FamilyID: state.FamilyID
				})
			} else {
				setState(updated)
			}

			return
		}

		// direct create merge action instead of creating a new action
		// in actions.ts and import it here
		// TODO: move to actions.ts for abstractions purpose
		dispatch(
			createMerges([
				{
					path: ['db', 'students', student.id, 'FamilyID'],
					value: ''
				}
			])
		)

		toast.success(student.Name + ' has been removed')
	}

	if (state.redirectTo) {
		return <Redirect to={state.redirectTo} />
	}

	const pageTitle = isNewFam ? 'Create Family' : 'Edit Family'

	// TODO: think of better way to create first family and add ability
	// to multiple siblings (have to check if already student has been added or not)
	// TODO: think about better family ids, change space to hyphen

	return (
		<AppLayout title={pageTitle}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mb-8 text-center">{pageTitle}</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 p-5 md:py-10 my-5">
					<form id="staff-form" className="text-white space-y-4 px-4 w-full md:w-3/5">
						<div>Family Name/ID</div>
						<input
							name="FamilyID"
							required
							disabled={isNewFam ? false : !!famId} // don't update the if
							value={isNewFam ? state.FamilyID : famId}
							onChange={handleInputChange}
							placeholder="Type name or id"
							className={clsx('tw-input w-full tw-is-form-bg-black', {
								'pointer-events-none bg-gray-500': isNewFam ? false : !!famId
							})}
						/>
						{(isNewFam ? state.siblings : true) && (
							<>
								<div>Guardian Name</div>
								<input
									name="ManName"
									value={state.ManName}
									onChange={handleInputChange}
									placeholder="Type name here"
									className="tw-input w-full tw-is-form-bg-black"
								/>
								<div>CNIC</div>
								<input
									name="ManCNIC"
									value={state.ManCNIC}
									onChange={handleInputChange}
									placeholder="Type CNIC here"
									className="tw-input w-full tw-is-form-bg-black"
								/>
								<div>Address</div>
								<textarea
									name="Address"
									value={state.Address}
									onChange={handleInputChange}
									rows={2}
									placeholder="Type street address"
									className="tw-input w-full tw-is-form-bg-black focus-within:bg-transparent"
								/>
								<div>Contact</div>
								<div className="flex items-center flex-row w-full">
									<input
										name="Phone"
										type="number"
										value={state.Phone}
										onChange={handleInputChange}
										placeholder="03xxxxxxxxx"
										className="tw-input w-full tw-is-form-bg-black"
									/>
									<PhoneCall phone={state.Phone} />
								</div>
								<div>Contact (Other)</div>
								<div className="flex items-center flex-row w-full">
									<input
										value={state.AlternatePhone}
										onChange={handleInputChange}
										name="AlternatePhone"
										type="number"
										placeholder="03xxxxxxxxx"
										className="tw-input w-full tw-is-form-bg-black"
									/>
									<PhoneCall phone={state.AlternatePhone} />
								</div>
							</>
						)}

						{siblingsUnMatchingInfo() && (
							<div className="text-red-brand">
								Warning: Some siblings do not have matching information. Press Save
								to overwrite
							</div>
						)}

						<div className="flex flex-col space-y-2">
							{(isNewFam ? Object.values(state.siblings || {}) : siblings).map(s => (
								<ListCard
									key={s.id}
									student={s}
									sections={sections}
									removeStudent={() => handleRemoveStudent(s)}
								/>
							))}
						</div>

						{(isNewFam ? Object.keys(state.siblings || {}).length === 0 : true) && (
							<>
								<div>Add Siblings</div>
								<StudentDropdownSearch
									classes={classes}
									students={students}
									onSelectStudent={id => handelAddStudent(id)}
								/>
							</>
						)}

						<button
							type="button"
							onClick={handleSave}
							className={clsx(
								'tw-btn w-full',
								// make sure if there's no student selected to be added in family, disable button
								isNewFam &&
									(!state.FamilyID ||
										Object.keys(state.siblings || {}).length === 0)
									? 'bg-gray-400 pointer-events-none'
									: 'bg-blue-brand'
							)}>
							{isNewFam ? 'Save' : 'Update'}
						</button>
					</form>
				</div>
			</div>
		</AppLayout>
	)
}

const getSiblings = (famId: string, students: RootDBState['students']) => {
	return Object.values(students).filter(
		std => isValidStudent(std) && std.Active && std.FamilyID === famId
	)
}

interface ListCardProps {
	student: MISStudent
	sections: AugmentedSection[]
	removeStudent: () => void
}

const ListCard = ({ student, sections, removeStudent }: ListCardProps) => {
	const section = sections.find(s => s.id === student.section_id)

	return (
		<div className="flex flex-row items-center p-2 bg-white w-full justify-between rounded-md text-gray-900">
			<div className="flex flex-row items-center">
				{student.ProfilePicture?.url || student.ProfilePicture?.image_string ? (
					<img
						className="w-8 h-8 mr-2 rounded-full"
						src={student.ProfilePicture?.url || student.ProfilePicture?.image_string}
						alt={student.Name}
					/>
				) : (
					<UserIcon className="w-8 h-8 mr-2 text-blue-brand rounded-full" />
				)}
				<div className="flex flex-col">
					<div className="text-sm">{toTitleCase(student.Name)}</div>
					<div className="text-xs text-gray-500">{toTitleCase(student.ManName)}</div>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between w-2/5">
				<div className="flex flex-col items-start">
					<div className="text-sm">{toTitleCase(section?.className)}</div>
					<div className="text-xs text-gray-500">{toTitleCase(section?.name)}</div>
				</div>
				<div className="ml-4 cursor-pointer" onClick={removeStudent}>
					<TrashIcon className="text-red-brand w-6 h-6" />
				</div>
			</div>
		</div>
	)
}

type PhoneCallProps = {
	phone: string
}
const PhoneCall = ({ phone }: PhoneCallProps) => (
	<a
		className={clsx(
			'md:hidden ml-2 text-white h-10 w-10 rounded-md flex items-center justify-center',
			phone ? 'bg-blue-brand' : 'pointer-events-none bg-gray-500 text-gray-300'
		)}
		href={`tel:${phone}`}>
		<PhoneIcon className="w-6 h-6" />
	</a>
)
