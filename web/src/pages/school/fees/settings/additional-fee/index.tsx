import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { AddFeeToStudent } from './single-student'
import { AddFeeToClass } from './single-class'
import cond from 'cond-construct'

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
	fee: {
		amount: number
		label: string
		period: FeePeriod | ''
	}
}

export const AdditionalFee = () => {
	const { settings, classes, students } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		addFeeTo: AddFeeOptions.STUDENT,
		classId: '',
		studentId: '',
		fee: {
			amount: 0,
			label: '',
			period: ''
		}
	})

	const setStudent = (sid: string) => {
		setState({ ...state, studentId: sid })
	}

	const setClass = (sid: string) => {
		setState({ ...state, studentId: sid })
	}

	const renderAddView = () =>
		cond([
			[
				state.addFeeTo === AddFeeOptions.STUDENT,
				<AddFeeToStudent
					key={state.addFeeTo}
					students={students}
					setStudentId={setStudent}
				/>
			],
			[
				state.addFeeTo === AddFeeOptions.CLASS,
				<AddFeeToClass key={state.addFeeTo} classes={classes} setClassId={setClass} />
			]
		])

	// in case of AddFeeOptions.CLASS, store addtional fee template info inside settings object
	// and generate payment against the students

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

					<div className="flex flex-row items-center space-x-4">
						<div className="flex flex-col space-y-4 w-full">
							<div>Label</div>
							<input
								name="label"
								type="text"
								placeholder="Enter label"
								className="tw-is-form-bg-black tw-input w-full"
							/>
						</div>
						<div className="flex flex-col space-y-4 w-3/5">
							<div>Amount</div>
							<input
								name="amount"
								type="number"
								placeholder="Enter amount"
								className="tw-is-form-bg-black tw-input w-full"
							/>
						</div>
					</div>
					<button className="tw-btn-blue w-full font-semibold">Add Additional Fee</button>
				</div>
			</div>
		</div>
	)
}
