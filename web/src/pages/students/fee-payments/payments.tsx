import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'

type State = {}
type StudentPaymentsProps = RouteComponentProps<{ id: string }>

export const StudentPayments = ({ match }: StudentPaymentsProps) => {
	const { students, classes, settings } = useSelector((state: RootReducerState) => state.db)

	const { id: studentId } = match.params

	const paymentStudent = students?.[studentId]

	// todo: list student info
	// todo: add filters
	// todo: show previous payment button
	// todo: show current month fees -> class default and additionals + student fees
	// todo: amount submit form
	// todo: handle payment

	return (
		<AppLayout title="Single Student Payment">
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative print:hidden">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">Student Payments</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="text-white text-center text-base my-5">Abdullah</div>
				</div>
			</div>
		</AppLayout>
	)
}
