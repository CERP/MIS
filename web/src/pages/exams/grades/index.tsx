import React, { useState } from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { useDispatch, useSelector } from 'react-redux'
import { TrashIcon } from '@heroicons/react/solid'
import { createDeletes } from 'actions/core'
import toast from 'react-hot-toast'

type State = {
	grade: {
		label: string
		remarks: string
		percentage: string
	}
}

export const GradeSettings = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state: RootReducerState) => state.db.settings)

	const [state, setState] = useState<State>({
		grade: {
			label: '',
			remarks: '',
			percentage: ''
		}
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

	return (
		<AppLayout title="Grade Settings" showHeaderTitle>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold text-center">
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
						.sort(([, a], [, b]) => parseInt(a.percent) ?? 0 - parseInt(b.percent) ?? 0)
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
			</div>
		</AppLayout>
	)
}
