import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { AppLayout } from 'components/Layout/appLayout'
import { RouteComponentProps } from 'react-router-dom'
import { isValidStudent } from 'utils'

type SingleFamilyProps = RouteComponentProps<{ id: string }>

type State = Partial<MISStudent> & {
	search: ''
}

export const SingleFamily = ({ match }: SingleFamilyProps) => {
	const { students, classes, settings } = useSelector((state: RootReducerState) => state.db)

	const famId = match.params.id

	const siblings = getSiblings(famId, students)

	const [state, setState] = useState<State>({
		Phone: (siblings.find(s => s.Phone !== '') || { Phone: '' }).Phone,
		AlternatePhone: (siblings.find(s => s.AlternatePhone !== '') || { AlternatePhone: '' })
			.AlternatePhone,
		ManName: (siblings.find(s => s.ManName !== '') || { ManName: '' }).ManName,
		ManCNIC: (siblings.find(s => s.ManCNIC !== '') || { ManCNIC: '' }).ManCNIC,
		Address: (siblings.find(s => s.Address !== '') || { Address: '' }).Address,
		search: ''
	})

	const pageTitle = true ? 'Create Family' : 'Update Family'

	return (
		<AppLayout title={pageTitle}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">{pageTitle}</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="text-white text-center text-base my-5">Family Information</div>

					<form id="staff-form" className="text-white space-y-4 px-4 w-full md:w-3/5">
						<div>Family ID</div>
						<input
							name="Name"
							required
							placeholder="Type name"
							className="tw-input is-form-bg-black"
						/>
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
