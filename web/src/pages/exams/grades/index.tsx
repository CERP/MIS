import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { TrashIcon } from '@heroicons/react/solid'
import { useDispatch, useSelector } from 'react-redux'

import { AppLayout } from 'components/Layout/appLayout'
import { createDeletes, createMerges } from 'actions/core'
import { TModal } from 'components/Modal'
import { PlusButton } from 'components/Button/plus'

type State = {
	grade?: {
		label: string
		remarks: string
		percentage: string
	}

	addGrade: boolean
}

export const GradeSettings = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state: RootReducerState) => state.db.settings)

	const [state, setState] = useState<State>({
		addGrade: false
	})

	const handleRemoveGrade = (gradeLabel: string) => {
		dispatch(
			createDeletes([
				{
					path: ['db', 'settings', 'exams', 'grades', gradeLabel]
				}
			])
		)

		toast.success('Grade has been remove!')
	}

	const handleFormSubmission = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.target as HTMLFormElement)
		const gradeInfo = Object.fromEntries(formData) as State['grade']

		if (gradeInfo.label?.trim()?.length === 0) {
			return toast.error('Please fill all required fields')
		}

		dispatch(
			createMerges([
				{
					path: ['db', 'settings', 'exams', 'grades', gradeInfo.label],
					value: {
						percent: gradeInfo.percentage,
						remarks: gradeInfo.remarks
					}
				}
			])
		)

		setState({ ...state, addGrade: false })
		toast.success('New grade has been added')
	}

	return (
		<AppLayout title="Grade Settings" showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 text-gray-700 relative">
				<div className="text-xl font-bold text-center">
					Set Grades &amp; Remarks with Percentage
				</div>

				<div className="mt-4 flex flex-row justify-between items-center bg-gray-900 text-white rounded p-4 font-semibold">
					<div>Grade</div>
					<div>Remarks</div>
					<div>Percentage</div>
					<div></div>
				</div>
				<div className="space-y-1">
					{Object.entries(settings?.exams?.grades || {})
						.sort(
							([, a], [, b]) =>
								(parseInt(a.percent) ?? 0) - (parseInt(b.percent) ?? 0)
						)
						.map(([grade, info], index) => (
							<div
								key={grade + index}
								className="flex flex-row justify-between bg-gray-300 rounded px-4 py-2 text-sm md:text-base">
								<div className="text-left w-1/4">{grade}</div>
								<div className="text-left w-2/5">{info.remarks}</div>
								<div className="text-left w-1/4">{info.percent}</div>
								<div>
									<TrashIcon
										onClick={() => handleRemoveGrade(grade)}
										className="w-6 p-px text-red-brand cursor-pointer hover:bg-white rounded-full"
									/>
								</div>
							</div>
						))}
				</div>

				{state.addGrade && (
					<TModal>
						<div className="bg-white md:p-10 p-8 text-gray-800">
							<h1 className="font-semibold text-center mb-2 text-lg">
								Add New Grade
							</h1>
							<form onSubmit={handleFormSubmission} className="space-y-2">
								<div className="flex flex-row space-x-2">
									<div>
										<label>Grade</label>
										<input
											className="tw-input w-full"
											placeholder="e.g. A+"
											type="text"
											required
											name="label"
										/>
									</div>
									<div>
										<label>Percentage</label>
										<input
											className="tw-input w-full"
											type="number"
											placeholder="e.g. 90"
											name="percentage"
											required
										/>
									</div>
								</div>
								<div>
									<label>Remarks</label>
									<textarea
										className="tw-input w-full"
										placeholder="Remarks for grade"
										name="remarks"
										required
									/>
								</div>
								<div className="flex flex-row justify-between w-full space-x-2">
									<button
										onClick={() =>
											setState({ ...state, addGrade: !state.addGrade })
										}
										type="button"
										className="py-1 md:py-2 tw-btn bg-gray-400 text-white w-1/2">
										Back
									</button>
									<button
										type="submit"
										className="py-1 md:py-2 tw-btn-blue w-1/2">
										Save
									</button>
								</div>
							</form>
						</div>
					</TModal>
				)}

				<div className="flex flex-row items-center space-x-2 mt-4">
					<PlusButton
						handleClick={() => setState({ ...state, addGrade: !state.addGrade })}
						className="mr-4 text-white hover:text-teal-brand border border-transparent hover:border-teal-brand"
					/>
					<div>Add Grades and Remarks</div>
				</div>
			</div>
		</AppLayout>
	)
}
