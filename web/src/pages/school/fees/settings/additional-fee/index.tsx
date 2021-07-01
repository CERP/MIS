import React, { useState } from 'react'
import clsx from 'clsx'
import cond from 'cond-construct'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'node-uuid'

import { createDeletes, createMerges } from 'actions/core'

import { AddFeeToStudent } from './single-student'
import { AddFeeToClass } from './single-class'
import { TModal } from 'components/Modal'
import { toTitleCase } from 'utils/toTitleCase'
import { isValidStudent } from 'utils'
import { MISFeePeriods } from 'constants/index'
import { useComponentVisible } from 'hooks/useComponentVisible'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

enum AddFeeOptions {
	STUDENT,
	CLASS,
	ALL
}

type State = {
	addFeeTo: AddFeeOptions
	classId: string
	studentId: string
	feeId: string
	fee: MISClassFee | MISStudentFee
}

const defaultFee: State['fee'] = {
	amount: 0,
	name: '',
	type: 'FEE',
	period: MISFeePeriods.SINGLE
}

export const AdditionalFee = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state: RootReducerState) => state.db.settings)
	const classes = useSelector((state: RootReducerState) => state.db.classes)
	const students = useSelector((state: RootReducerState) => state.db.students)

	const {
		ref: confirmAddFeeModalRef,
		isComponentVisible: confirmAddFeeModal,
		setIsComponentVisible: setConfirmAddFeeModal
	} = useComponentVisible(false)

	const [state, setState] = useState<State>({
		// this to make sure, no radio button show active state
		addFeeTo: 3, // TODO: use some understandable hack
		classId: '',
		studentId: '',
		feeId: '',
		fee: defaultFee
	})

	const setFee = (id: string) => {
		const student = students[state.studentId]
		const fee = student?.fees?.[id]
		setState({ ...state, feeId: id, fee })
	}

	const setClassFee = (id: string) => {
		if (!id) {
			setState({ ...state, feeId: undefined, fee: {} as MISClassFee | MISStudentFee })
		}

		const classAdditional = settings?.classes.additionalFees?.[state.classId]
		const fee = classAdditional?.[id]
		setState({ ...state, feeId: id, fee })
	}

	const addOrUpdateFee = () => {
		// if there's an updatable fee, get the id from state
		// if it isn't, generate unique id
		const feeId = state.feeId || v4()
		let addOrUpdateText = ''

		// For this case, we're keeping template in settings.classes.additionalFees
		// to generate payments on run time.
		// Note: make sure it will handle all cases to generate to payments for single or monthly payment
		if (state.addFeeTo === AddFeeOptions.CLASS) {
			addOrUpdateText = getClassName()
			dispatch(
				createMerges([
					{
						path: ['db', 'settings', 'classes', 'additionalFees', state.classId, feeId],
						value: state.fee
					}
				])
			)
		}

		if (state.addFeeTo === AddFeeOptions.STUDENT) {
			addOrUpdateText = toTitleCase(students[state.studentId].Name)
			dispatch(
				createMerges([
					{
						path: ['db', 'students', state.studentId, 'fees', feeId],
						value: state.fee
					}
				])
			)
		}

		if (state.addFeeTo === AddFeeOptions.ALL) {
			const filteredStudents = Object.values(students).filter(
				s => isValidStudent(s) && s.Active
			)

			addOrUpdateText = `All Students (${filteredStudents.length})`

			const merges = filteredStudents.reduce(
				(agg, curr) => [
					...agg,
					{
						path: ['db', 'students', curr.id, 'fees', feeId],
						value: state.fee
					}
				],
				[]
			)

			dispatch(createMerges(merges))
		}

		const toastText = state.feeId
			? `Additional fee has been added to ${addOrUpdateText}`
			: `Additional fee has been updated for ${addOrUpdateText}`

		toast.success(toastText)
		setConfirmAddFeeModal(false)

		setState({ ...state, fee: defaultFee, feeId: '' })
	}

	const deleteFee = () => {
		// TODO: use custom alert
		if (!window.confirm('Are you sure you want to remove fee?')) {
			return
		}

		if (state.addFeeTo === AddFeeOptions.CLASS) {
			dispatch(
				createDeletes([
					{
						path: [
							'db',
							'settings',
							'classes',
							'additionalFees',
							state.classId,
							state.feeId
						]
					}
				])
			)
		}

		if (state.addFeeTo === AddFeeOptions.STUDENT) {
			dispatch(
				createDeletes([
					{
						path: ['db', 'students', state.studentId, 'fees']
					}
				])
			)
		}

		toast.success('Addition fee has been deleted')
		setState({ ...state, fee: defaultFee, feeId: '' })
	}

	const renderAddView = () =>
		cond([
			[
				state.addFeeTo === AddFeeOptions.STUDENT,
				<AddFeeToStudent
					key={state.addFeeTo}
					students={students}
					classes={classes}
					setStudentId={id => setState({ ...state, studentId: id })}
					setFee={setFee}
					resetStudent={() =>
						setState({ ...state, studentId: '', feeId: '', fee: defaultFee })
					}
				/>
			],
			[
				state.addFeeTo === AddFeeOptions.CLASS,
				<AddFeeToClass
					key={state.addFeeTo}
					classes={classes}
					setClass={id => setState({ ...state, classId: id })}
					settings={settings}
					setFee={setClassFee}
				/>
			]
		])

	const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		// TODO: add validation here
		setConfirmAddFeeModal(true)
	}

	const setAddFeeTO = (option: AddFeeOptions) => {
		if (option === AddFeeOptions.STUDENT) {
			return setState({
				...state,
				addFeeTo: option,
				fee: defaultFee,
				feeId: undefined,
				classId: ''
			})
		}
		if (option === AddFeeOptions.CLASS) {
			return setState({
				...state,
				addFeeTo: option,
				fee: defaultFee,
				feeId: undefined,
				studentId: ''
			})
		}

		if (option === AddFeeOptions.ALL) {
			return setState({
				...state,
				addFeeTo: option,
				fee: defaultFee,
				feeId: undefined,
				studentId: '',
				classId: ''
			})
		}
	}

	const getClassName = () => {
		const selectedClass = classes[state.classId]
		return toTitleCase(selectedClass.name ?? '')
	}

	// only active students
	const getClassStudents = () => {
		// section ids
		const sections = getSectionsFromClasses(classes).reduce((agg, section) => {
			if (section.class_id === state.classId) {
				return [...agg, section.id]
			}
			return agg
		}, [])

		return Object.values(students ?? {}).filter(
			s => isValidStudent(s) && s.Active && sections.includes(s.section_id)
		)
	}

	const totalActiveStudents = Object.values(students).filter(s => isValidStudent(s) && s.Active)
		.length

	const isFormDisabled =
		!state.fee?.name?.trim() ||
		state.fee?.name?.trim().length < 3 ||
		!state.fee?.amount ||
		(state.addFeeTo === AddFeeOptions.STUDENT ? !state.studentId : false) ||
		(state.addFeeTo === AddFeeOptions.CLASS ? !state.classId : false)

	return (
		<div className="p-5 md:p-10 md:pt-0 md:pb-0 relative print:hidden">
			<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-4 rounded-2xl bg-gray-700 py-4 my-4 md:mt-8 text-white min-h-screen">
				<div className="text-center text-xl font-semibold">Manage additional Fees</div>
				<div className="px-4 w-full md:w-3/5 space-y-4">
					<div>Add Fee For:</div>
					<div className="flex items-center space-x-4 md:space-x-8">
						<div className="flex items-center">
							<input
								name="toStudent"
								type="radio"
								onChange={() => setAddFeeTO(AddFeeOptions.STUDENT)}
								checked={state.addFeeTo === AddFeeOptions.STUDENT}
								className="mr-2 form-radio tw-radio"
							/>
							<div className="text-sm">Student</div>
						</div>

						<div className="flex items-center">
							<input
								name="toClass"
								type="radio"
								onChange={() => setAddFeeTO(AddFeeOptions.CLASS)}
								checked={state.addFeeTo === AddFeeOptions.CLASS}
								className="mr-2 form-radio tw-radio"
							/>
							<div className="text-sm">Class</div>
						</div>
						{state.addFeeTo !== AddFeeOptions.STUDENT && (
							<div className="flex items-center">
								<input
									name="toAll"
									type="radio"
									onChange={() => setAddFeeTO(AddFeeOptions.ALL)}
									checked={state.addFeeTo === AddFeeOptions.ALL}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">All Students</div>
							</div>
						)}
					</div>
					{renderAddView()}
					{confirmAddFeeModal && (
						<TModal>
							<div
								className="bg-white md:p-10 p-8 space-y-2 text-center"
								ref={confirmAddFeeModalRef}>
								<div className="font-semibold text-lg md:text-xl">
									Confirm Additional Fee
								</div>
								<div className="text-sm">
									{state.fee?.period === 'MONTHLY'
										? '( Every Month )'
										: '( One Time )'}
								</div>
								<div className="text-teal-brand font-semibold text-lg">
									{state.fee.name} - Rs. {state.fee.amount}
								</div>
								<div className="">
									will be added to{' '}
									{state.addFeeTo === AddFeeOptions.CLASS
										? `${getClassName()} Class (${getClassStudents().length
										} students)`
										: state.addFeeTo === AddFeeOptions.STUDENT
											? toTitleCase(students[state.studentId].Name)
											: `All Active Students (${totalActiveStudents})`}
								</div>
								<div className="flex flex-row justify-between space-x-4">
									<button
										onClick={() => setConfirmAddFeeModal(false)}
										className="py-1 md:py-2 tw-btn bg-gray-400 hover:bg-gray-500 text-white w-full">
										Cancel
									</button>
									<button
										onClick={addOrUpdateFee}
										className="py-1 md:py-2 tw-btn-red w-full">
										Confirm
									</button>
								</div>
							</div>
						</TModal>
					)}
					<form className="space-y-4" onSubmit={handleSubmitForm}>
						<div className="flex flex-row items-center space-x-4">
							<div className="flex flex-col space-y-4 w-full">
								<label htmlFor="feeName">Label</label>
								<input
									name="feeName"
									type="text"
									required
									onChange={e =>
										setState({
											...state,
											fee: { ...state.fee, name: e.target.value }
										})
									}
									value={state.fee?.name ?? ''}
									placeholder="Enter label"
									className="tw-is-form-bg-black tw-input w-full"
								/>
							</div>
							<div className="flex flex-col space-y-4 w-3/5">
								<label>Amount</label>
								<input
									name="amount"
									type="number"
									required
									onChange={e =>
										setState({
											...state,
											// @ts-ignore
											fee: {
												...state.fee,
												amount: e.target.valueAsNumber ?? 0
											}
										})
									}
									value={state.fee?.amount ?? 0 > 0 ? state.fee?.amount : ''}
									placeholder="Enter amount"
									className="tw-is-form-bg-black tw-input w-full"
								/>
							</div>
						</div>

						<p>Duration</p>
						<div className="flex items-center space-x-8">
							<div className="flex items-center">
								<input
									id="duration"
									name="periodSingle"
									type="radio"
									onChange={() =>
										setState({
											...state,
											fee: {
												...state.fee,
												period: MISFeePeriods.SINGLE
											}
										})
									}
									checked={state.fee?.period === MISFeePeriods.SINGLE}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">One Time</div>
							</div>
							<div className="flex items-center">
								<input
									id="duration"
									name="periodMonthly"
									type="radio"
									onChange={() =>
										setState({
											...state,
											fee: {
												...state.fee,
												period: MISFeePeriods.MONTHLY
											}
										})
									}
									checked={state.fee?.period === MISFeePeriods.MONTHLY}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="sm:text-sm text-base">Every Month</div>
							</div>
						</div>
						<button
							disabled={isFormDisabled}
							type="submit"
							className={clsx(
								'tw-btn w-full font-semibold',
								isFormDisabled ? 'bg-gray-300 pointer-events-none' : 'bg-teal-brand'
							)}>
							{state.feeId ? 'Save Edited Fee' : 'Save Fee'}
						</button>
						{state.feeId && (
							<button
								onClick={deleteFee}
								type="button"
								className={'tw-btn bg-red-brand text-white w-full font-semibold'}>
								Delete Fee
							</button>
						)}
					</form>
				</div>
			</div>
		</div>
	)
}
