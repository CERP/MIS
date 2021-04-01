import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import clsx from 'clsx'

import { AppLayout } from 'components/Layout/appLayout'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { isValidStudent } from 'utils'
import { StudentDropdownSearch } from 'components/input/search'
import { addStudentToFamily, saveFamilyInfo } from 'actions'
import Hyphenator from 'utils/Hyphenator'

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
	const isNewFamily = location.pathname.indexOf('new') >= 0

	const siblings = getSiblings(famId, students)

	const [state, setState] = useState<State>({
		Phone: (siblings.find(s => s.Phone !== '') || { Phone: '' }).Phone,
		AlternatePhone: (siblings.find(s => s.AlternatePhone !== '') || { AlternatePhone: '' })
			.AlternatePhone,
		ManName: (siblings.find(s => s.ManName !== '') || { ManName: '' }).ManName,
		ManCNIC: (siblings.find(s => s.ManCNIC !== '') || { ManCNIC: '' }).ManCNIC,
		Address: (siblings.find(s => s.Address !== '') || { Address: '' }).Address
	})

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
		if (isNewFamily) {
			setState({
				...state,
				Phone: student.Phone,
				AlternatePhone: student.AlternatePhone,
				ManName: student.ManName,
				ManCNIC: student.ManCNIC,
				Address: student.Address,
				siblings: {
					...(state.siblings || {}),
					[studentId]: student
				}
			})
		} else {
			// add student directly if famId exists
			dispatch(addStudentToFamily(student, famId))
			toast.success('Student has been added')
		}
	}

	const handleSave = () => {
		if (isNewFamily) {
			if (!state.FamilyID) {
				toast.success('Please enter family name or id')
				return
			}

			const siblingStudents = Object.values(state.siblings).map(student => ({
				...student,
				FamilyID: state.FamilyID
			}))

			// dispatch an action to save students with new fam id
			const family: MISFamilyInfo = {
				ManCNIC: state.ManCNIC,
				ManName: state.ManName,
				Phone: state.Phone,
				Address: state.Address,
				AlternatePhone: state.AlternatePhone
			}

			dispatch(saveFamilyInfo(siblingStudents, family))
			toast.success('New family has been created')

			// redirect to '/families'
			setTimeout(() => {
				setState({ ...state, redirectTo: '/families' })
			}, 1500)

			return
		}

		// Remove extra props here (state.siblings)
		dispatch(saveFamilyInfo(siblings, state as MISFamilyInfo, true))
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

	if (state.redirectTo) {
		return <Redirect to={state.redirectTo} />
	}

	const pageTitle = isNewFamily ? 'Create Family' : 'Edit Family'

	// TODO: show list of siblings
	// TODO: add logic to remove student from family
	// TODO: think of better way to create first family and add ability
	// to add more siblings (have to check if already student has been added or not)
	// TODO: refactor code and add appropriate toasts
	// TODO: think about better family ids, change space to hyphen

	return (
		<AppLayout title={pageTitle}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">{pageTitle}</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<form
						id="staff-form"
						className="text-white space-y-4 px-4 w-full md:w-3/5 mt-4">
						<div>Family Name/ID</div>
						<input
							name="FamilyID"
							required
							disabled={isNewFamily ? false : !!famId} // don't update the if
							value={isNewFamily ? state.FamilyID : famId}
							onChange={handleInputChange}
							placeholder="Type name or id"
							className={clsx('tw-input w-full tw-is-form-bg-black', {
								'pointer-events-none bg-gray-500': isNewFamily ? false : !!famId
							})}
						/>
						{(isNewFamily ? state.siblings : true) && (
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
									placeholder="Type CNIC without '-'"
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
								<input
									name="Phone"
									value={state.Phone}
									onChange={handleInputChange}
									placeholder="03xxxxxxxxx"
									className="tw-input w-full tw-is-form-bg-black"
								/>
								<div>Contact (Other)</div>
								<input
									value={state.AlternatePhone}
									onChange={handleInputChange}
									name="AlternatePhone"
									placeholder="03xxxxxxxxx"
									className="tw-input w-full tw-is-form-bg-black"
								/>{' '}
							</>
						)}

						{siblingsUnMatchingInfo() && (
							<div className="text-red-brand">
								Warning: Some siblings do not have matching information. Press Save
								to overwrite
							</div>
						)}

						{(isNewFamily ? Object.keys(state.siblings || {}).length === 0 : true) && (
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
								isNewFamily && !state.FamilyID
									? 'bg-gray-400 pointer-events-none'
									: 'bg-blue-brand'
							)}>
							{isNewFamily ? 'Save' : 'Update'}
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
