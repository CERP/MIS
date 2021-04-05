import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline'

import { useSectionInfo } from 'hooks/useStudentClassInfo'
import { AppLayout } from 'components/Layout/appLayout'
import toTitleCase from 'utils/toTitleCase'

type State = {
	viewPayments: boolean
}
type StudentPaymentsProps = RouteComponentProps<{ id: string }>

export const StudentPayments = ({ match }: StudentPaymentsProps) => {
	const { students, classes, settings } = useSelector((state: RootReducerState) => state.db)
	const { id: studentId } = match.params
	const student = students?.[studentId]

	const { section } = useSectionInfo(student.section_id)

	const classDefaultFee = settings?.classes?.defaultFee?.[section.class_id]
	const classAdditionalFees = settings?.classes?.additionalFees?.[section.class_id]

	const [state, setState] = useState<State>({
		viewPayments: false
	})

	// todo: add filters
	// todo: show previous payment button
	// todo: show current month fees -> class default and additionals + student fees
	// todo: amount submit form
	// todo: handle payment
	// todo: previous pending ammount
	// todo: special schoolarship entry

	// if(!student) {
	// 	return (
	//		add component to show invalid state and link to go -> history.goBack()
	// 	)
	// }

	return (
		<AppLayout title="Single Student Payment">
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative print:hidden">
				<div className="text-2xl font-bold mb-8 text-center">Student Payments</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-4 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="text-white text-center mt-4 text-base md:hidden">
						<div>{toTitleCase(student.Name)}</div>
						<div className="text-sm">Class {section?.namespaced_name}</div>
					</div>
					<button
						onClick={() => setState({ ...state, viewPayments: !state.viewPayments })}
						className="inline-flex items-center tw-btn-blue rounded-3xl md:hidden">
						<span className="mr-2">View Past Payments</span>
						{state.viewPayments ? (
							<ChevronUpIcon className="w-4 h-4" />
						) : (
							<ChevronDownIcon className="w-4 h-4" />
						)}
					</button>
					<div className="w-full px-5 text-sm md:text-base">
						<div className="flex flex-row justify-between text-white w-full">
							<div className="">Class Fee</div>
							<div className="">Rs. {classDefaultFee?.amount ?? 0}</div>
						</div>
						{Object.entries(classAdditionalFees || {}).map(([id, fee]) => (
							<div
								key={id}
								className="flex flex-row justify-between text-white w-full">
								<div className="">{fee.name}</div>
								<div className="">Rs. {fee?.amount ?? 0}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
