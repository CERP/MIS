import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'

import { isValidStudent } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import { AppLayout } from 'components/Layout/appLayout'
import { resetFees } from 'actions'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'

import getSectionsFromClasses from 'utils/getSectionsFromClasses'

enum ResetFeeOptions {
	EMPTY_OPTION,
	ALL_STUDENTS,
	SINGLE_CLASS,
	SINGLE_STUDENT
}

type State = {
	resetFor: ResetFeeOptions
	sectionId: string
	studentId: string
}

const confirmResetForLabels = ["All students", "Single Class", "Single Student"]

export const ResetFee = () => {

	const dispatch = useDispatch()
	const { students, classes } = useSelector((state: RootReducerState) => state.db)

	const {
		ref: confirmResetModalRef,
		isComponentVisible: showConfirmResetModal,
		setIsComponentVisible: setShowConfirmResetModal
	} = useComponentVisible(false)

	const [state, setState] = useState<State>({
		resetFor: ResetFeeOptions.EMPTY_OPTION,
		sectionId: '',
		studentId: ''
	})

	const sections = useMemo(() => {
		// TODO: sort the sections by default
		return getSectionsFromClasses(classes)
			.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
	}, [classes])

	const handleResetFee = (): void => {

		const filteredStudents = Object.values(students).filter(student => {

			if (state.resetFor === ResetFeeOptions.ALL_STUDENTS) {
				return isValidStudent(student)
			}

			if (state.resetFor === ResetFeeOptions.SINGLE_CLASS
				&& isValidStudent(student)
				&& student.section_id === state.sectionId) {
				return true
			}

			if (state.resetFor === ResetFeeOptions.SINGLE_STUDENT
				&& student.id === state.studentId) {
				return true
			}

			// in case of empty selection
			return false

		})

		// TODO: use RHT

		dispatch(resetFees(filteredStudents))

		// close the modal
		setShowConfirmResetModal(false)
	}

	return (
		<AppLayout title={"Reset Fee"}>
			<div className="p-5 md:p-10 md:pb-0 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">Reset Fee</div>
				<div className="min-h-screen md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="text-white text-center text-base my-5">Please be careful while reseting Fee</div>
					<div className="text-white space-y-4 px-4 w-full md:w-3/5">
						<div>Reset Fee For:</div>
						<select
							onChange={(e) => setState({ ...state, resetFor: parseInt(e.target.value) })}
							className="tw-input w-full bg-transparent border-blue-brand ring-1 text-gray-400">
							<option value={0}>Select from here</option>
							<option value={1}>All Students</option>
							<option value={2}>Single Class</option>
							<option value={3}>Single Student</option>
						</select>
						{showConfirmResetModal &&
							<TModal>
								<div className="bg-white md:p-10 p-8 space-y-2 text-center" ref={confirmResetModalRef}>
									<h1>You are resetting the Fee for</h1>
									<div className="font-semibold text-lg md:text-xl">{confirmResetForLabels[state.resetFor]}</div>
									<div>Are you sure you want to reset?</div>
									<div className="flex flex-row justify-between">
										<button onClick={() => setShowConfirmResetModal(false)} className="py-1 md:py-2 tw-btn bg-gray-400 text-white">Cancel</button>
										<button onClick={handleResetFee} className="py-1 md:py-2 tw-btn-red">Confirm</button>
									</div>
								</div>
							</TModal>
						}
						{(state.resetFor === ResetFeeOptions.SINGLE_CLASS || state.resetFor === ResetFeeOptions.SINGLE_STUDENT)
							&& (<>
								<div>Class</div>
								<select
									onChange={(e) => setState({ ...state, sectionId: e.target.value })}
									className="tw-input w-full bg-transparent border-blue-brand ring-1 text-gray-400">
									<option>Select Class</option>
									{
										sections
											.filter(s => s.id && s.className)
											.map(s => <option key={s.id} value={s.id}>{toTitleCase(s.namespaced_name, '-')}</option>)
									}
								</select>
							</>)
						}
						{(state.resetFor === ResetFeeOptions.SINGLE_STUDENT && state.sectionId)
							&& (<>
								<div>Student</div>
								<select
									onChange={(e) => setState({ ...state, studentId: e.target.value })}
									className="tw-input w-full bg-transparent border-blue-brand ring-1 text-gray-400">
									<option value="">Select Student</option>
									{
										Object.values(students)
											.filter(s => isValidStudent(s) && s.section_id === state.sectionId)
											.sort((a, b) => a.Name.localeCompare(b.Name))
											.map(s => <option key={s.id} value={s.id}>{toTitleCase(s.Name)}</option>)
									}
								</select>
							</>)
						}

						<button
							onClick={() => setShowConfirmResetModal(!showConfirmResetModal)}
							disabled={ResetFeeOptions.EMPTY_OPTION === state.resetFor}
							className={clsx("tw-btn-red w-full", {
								"opacity-75 pointer-events-none": (ResetFeeOptions.EMPTY_OPTION === state.resetFor
									|| (ResetFeeOptions.SINGLE_CLASS === state.resetFor && !state.sectionId)
									|| (ResetFeeOptions.SINGLE_STUDENT === state.resetFor && !state.studentId)
								)
							})}>Reset Fee</button>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}