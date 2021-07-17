import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

import { classYearSorter, isValidStudent } from 'utils'
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

const confirmResetForLabels = ['', 'All students', 'Single Class', 'Single Student']

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
		return getSectionsFromClasses(classes).sort(classYearSorter)
	}, [classes])

	const handleResetFee = (): void => {
		const filteredStudents = Object.values(students).filter(student => {
			if (state.resetFor === ResetFeeOptions.ALL_STUDENTS) {
				return isValidStudent(student, { active: true })
			}

			if (
				state.resetFor === ResetFeeOptions.SINGLE_CLASS &&
				isValidStudent(student, { active: true }) &&
				student.section_id === state.sectionId
			) {
				return true
			}

			if (
				state.resetFor === ResetFeeOptions.SINGLE_STUDENT &&
				student.id === state.studentId
			) {
				return true
			}
			return false
		})

		dispatch(resetFees(filteredStudents))
		toast.success('Fees have been reset!')
		setShowConfirmResetModal(false)
	}

	return (
		<AppLayout title={'Reset Fee'} showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 md:pb-0 relative">
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 py-5">
					<div className="text-white space-y-4 px-4 w-full md:w-3/5">
						<h1 className="font-semibold">Reset Fee For:</h1>
						<select
							onChange={e =>
								setState({ ...state, resetFor: parseInt(e.target.value) })
							}
							className="tw-input w-full tw-is-form-bg-black text-gray-400">
							<option value={ResetFeeOptions.EMPTY_OPTION}>Select Option</option>
							<option value={ResetFeeOptions.ALL_STUDENTS}>All Students</option>
							<option value={ResetFeeOptions.SINGLE_CLASS}>Single Class</option>
							<option value={ResetFeeOptions.SINGLE_STUDENT}>Single Student</option>
						</select>
						{showConfirmResetModal && (
							<TModal>
								<div
									className="bg-white md:p-10 p-8 space-y-2 text-center"
									ref={confirmResetModalRef}>
									<h1>You are resetting the Fee for</h1>
									<div className="font-semibold text-lg md:text-xl">
										{confirmResetForLabels[state.resetFor]}
									</div>
									<div>This cannot be undo, Are you sure you want to reset?</div>
									<div className="flex flex-row justify-between">
										<button
											onClick={() => setShowConfirmResetModal(false)}
											className="py-1 md:py-2 tw-btn bg-gray-400 text-white">
											Cancel
										</button>
										<button
											onClick={handleResetFee}
											className="py-1 md:py-2 tw-btn-red">
											Confirm
										</button>
									</div>
								</div>
							</TModal>
						)}
						{(state.resetFor === ResetFeeOptions.SINGLE_CLASS ||
							state.resetFor === ResetFeeOptions.SINGLE_STUDENT) && (
								<>
									<div>Class</div>
									<select
										onChange={e =>
											setState({ ...state, sectionId: e.target.value })
										}
										className="tw-input w-full tw-is-form-bg-black text-gray-400">
										<option>Select Class</option>
										{sections
											.filter(s => s.id && s.className)
											.map(s => (
												<option key={s.id} value={s.id}>
													{s.namespaced_name}
												</option>
											))}
									</select>
								</>
							)}
						{state.resetFor === ResetFeeOptions.SINGLE_STUDENT && state.sectionId && (
							<>
								<div>Student</div>
								<select
									onChange={e =>
										setState({ ...state, studentId: e.target.value })
									}
									className="tw-input w-full tw-is-form-bg-black text-gray-400">
									<option value="">Select Student</option>
									{Object.values(students)
										.filter(
											s =>
												isValidStudent(s) &&
												s.section_id === state.sectionId
										)
										.sort((a, b) => a.Name.localeCompare(b.Name))
										.map(s => (
											<option key={s.id} value={s.id}>
												{toTitleCase(s.Name)}
											</option>
										))}
								</select>
							</>
						)}

						<button
							onClick={() => setShowConfirmResetModal(!showConfirmResetModal)}
							disabled={ResetFeeOptions.EMPTY_OPTION === state.resetFor}
							className={clsx('tw-btn-red w-full', {
								'pointer-events-none bg-gray-500':
									ResetFeeOptions.EMPTY_OPTION === state.resetFor ||
									(ResetFeeOptions.SINGLE_CLASS === state.resetFor &&
										!state.sectionId) ||
									(ResetFeeOptions.SINGLE_STUDENT === state.resetFor &&
										!state.studentId)
							})}>
							Reset Fee
						</button>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
