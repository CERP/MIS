import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { AddFeeToStudent } from './single-student'
import { AddFeeToClass } from './single-class'
import cond from 'cond-construct'
import clsx from 'clsx'

enum AddFeeOptions {
	STUDENT,
	CLASS,
	ALL
}

enum FeePeriod {
	MONTHLY = 'MONTHLY',
	SINGLE = 'SINGLE'
}

type State = {
	addFeeTo: AddFeeOptions
	classId: string
	studentId: string
	feeId: string
	fee: MISClassFee | MISStudentFee
}

export const AdditionalFee = () => {
	const { settings, classes, students } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		addFeeTo: AddFeeOptions.STUDENT,
		classId: '',
		studentId: '',
		feeId: '',
		fee: {
			amount: 0,
			name: '',
			type: 'FEE',
			period: FeePeriod.SINGLE
		}
	})

	const setStudent = (sid: string) => {
		setState({ ...state, studentId: sid })
	}

	const setClass = (sid: string) => {
		setState({ ...state, studentId: sid })
	}

	const updateFee = (id: string) => {
		const student = students[state.studentId]
		const fee = student?.fees?.[id]
		setState({ ...state, fee })
	}

	const renderAddView = () =>
		cond([
			[
				state.addFeeTo === AddFeeOptions.STUDENT,
				<AddFeeToStudent
					key={state.addFeeTo}
					students={students}
					setStudentId={setStudent}
					setFeeId={updateFee}
					resetStudent={() => setState({ ...state, studentId: '', feeId: '' })}
				/>
			],
			[
				state.addFeeTo === AddFeeOptions.CLASS,
				<AddFeeToClass key={state.addFeeTo} classes={classes} setClassId={setClass} />
			]
		])

	const isFormDisabled =
		!state.fee.name?.trim() || state.fee.name?.trim().length < 3 || !state.fee?.amount

	return (
		<div className="p-5 md:p-10 md:pb-0 relative print:hidden">
			<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-4 rounded-2xl bg-gray-700 py-4 my-4 md:mt-8 text-white min-h-screen">
				<div className="text-center text-base">Manage additional Fees</div>
				<div className="space-y-6 px-4 w-full md:w-3/5">
					<div className="font-semibold">Add Fee For:</div>
					<div className="flex items-center flex-wrap justify-between">
						<div className="flex items-center">
							<input
								name="toStudent"
								type="radio"
								onChange={() =>
									setState({
										...state,
										addFeeTo: AddFeeOptions.STUDENT,
										classId: ''
									})
								}
								checked={state.addFeeTo === AddFeeOptions.STUDENT}
								className="mr-2 w-4 h-4 cursor-pointer"
							/>
							<div className="text-sm">Student</div>
						</div>

						<div className="flex items-center">
							<input
								name="toClass"
								type="radio"
								onChange={() =>
									setState({
										...state,
										addFeeTo: AddFeeOptions.CLASS,
										studentId: ''
									})
								}
								checked={state.addFeeTo === AddFeeOptions.CLASS}
								className="mr-2 w-4 h-4 cursor-pointer"
							/>
							<div className="text-sm">Class</div>
						</div>
						<div className="flex items-center">
							<input
								name="toAll"
								type="radio"
								onChange={() =>
									setState({
										...state,
										addFeeTo: AddFeeOptions.ALL,
										classId: '',
										studentId: ''
									})
								}
								checked={state.addFeeTo === AddFeeOptions.ALL}
								className="mr-2 w-4 h-4 cursor-pointer"
							/>
							<div className="text-sm">All</div>
						</div>
					</div>

					{renderAddView()}

					<form className="space-y-4">
						<div className="flex flex-row items-center space-x-4">
							<div className="flex flex-col space-y-4 w-full">
								<div>Label</div>
								<input
									name="name"
									type="text"
									required
									onChange={e =>
										setState({
											...state,
											fee: { ...state.fee, name: e.target.value }
										})
									}
									value={state.fee.name}
									placeholder="Enter label"
									className="tw-is-form-bg-black tw-input w-full"
								/>
							</div>
							<div className="flex flex-col space-y-4 w-3/5">
								<div>Amount</div>
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
									value={state.fee.amount > 0 ? state.fee.amount : ''}
									placeholder="Enter amount"
									className="tw-is-form-bg-black tw-input w-full"
								/>
							</div>
						</div>

						<div>Duration</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									name="periodSingle"
									type="radio"
									onChange={() =>
										setState({
											...state,
											fee: {
												...state.fee,
												period: FeePeriod.SINGLE
											}
										})
									}
									checked={state.fee.period === FeePeriod.SINGLE}
									className="mr-2 w-4 h-4 cursor-pointer"
								/>
								<div className="text-sm">One Time</div>
							</div>
							<div className="flex items-center">
								<input
									name="periodMonthly"
									type="radio"
									onChange={() =>
										setState({
											...state,
											fee: {
												...state.fee,
												period: FeePeriod.MONTHLY
											}
										})
									}
									checked={state.fee.period === FeePeriod.MONTHLY}
									className="mr-2 w-4 h-4 cursor-pointer"
								/>
								<div className="sm:text-sm text-base">Every Month</div>
							</div>
						</div>
						<button
							disabled={isFormDisabled}
							type="submit"
							className={clsx('tw-btn-blue w-full font-semibold', {
								'bg-blue-300 pointer-events-none': isFormDisabled
							})}>
							Add Additional Fee
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
