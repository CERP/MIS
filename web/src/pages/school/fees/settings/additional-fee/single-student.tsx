import React, { useState } from 'react'

import { Transition } from '@headlessui/react'
import { SearchInput } from 'components/input/search'
import { isValidStudent } from 'utils'

import UserIconSvg from 'assets/svgs/user.svg'
import clsx from 'clsx'

interface AddFeeToStudentProps {
	students: RootDBState['students']
	setStudentId: (sid: string) => void
	setFeeId?: (feeId: string) => void
	resetStudent: () => void
}

enum FeePeriod {
	MONTHLY = 'MONTHLY',
	SINGLE = 'SINGLE'
}

export const AddFeeToStudent = ({ students, setStudentId, setFeeId }: AddFeeToStudentProps) => {
	const [searchText, setSearchText] = useState('')
	const [student, setStudent] = useState<MISStudent>()

	const clearStudent = () => {
		// clear fee, student id if selected
		setStudentId('')
		setFeeId('')
		setStudent(undefined)
	}

	return (
		<>
			<div>Select Student</div>
			{!student?.id && (
				<SearchInput
					value={searchText}
					onChange={e => setSearchText(e.target.value)}
					className="text-gray-700"
				/>
			)}
			{
				<Transition
					show={searchText.length > 0 && !student?.id}
					enter="transition-opacity duration-75"
					enterFrom="opacity-0"
					enterTo="opacity-100">
					<div className="w-full max-h-40 overflow-y-auto bg-white rounded-3xl text-gray-900 p-4">
						{Object.values(students)
							.filter(
								s =>
									isValidStudent(s) &&
									s.Active &&
									(searchText
										? s.Name.toLowerCase().includes(searchText.toLowerCase())
										: true)
							)
							.map(s => (
								<div
									key={s.id}
									onClick={() => {
										setStudent(s)
										setStudentId(s.id)
									}}
									className="flex p-2 flex-row items-center justify-between cursor-pointer rounded-lg hover:bg-gray-100">
									<div className="flex flex-row items-center">
										<img
											src={
												s.ProfilePicture?.url ||
												s.ProfilePicture?.image_string ||
												UserIconSvg
											}
											className="w-6 h-6 mr-2 bg-gray-500 rounded-full"
											alt={s.Name}
										/>
										<div>{s.Name}</div>
									</div>
								</div>
							))}
					</div>
				</Transition>
			}
			{
				<Transition
					show={!!student?.id}
					enter="transition-opacity duration-150"
					enterFrom="opacity-0"
					enterTo="opacity-100">
					<div className="flex flex-row items-center justify-between py-3 px-2 text-gray-900 rounded-full bg-white">
						<div className="flex flex-row items-center">
							<img
								src={
									student?.ProfilePicture?.url ||
									student?.ProfilePicture?.image_string ||
									UserIconSvg
								}
								className="w-6 h-6 mr-2 bg-gray-500 rounded-full"
								alt={student?.Name}
							/>
							<div>{student?.Name}</div>
						</div>
						<button
							onClick={clearStudent}
							className="cursor-pointer flex items-center justify-center w-6 h-6 text-white bg-red-brand rounded-full p-1">
							x
						</button>
					</div>
					{student && <PreviousFees student={student} setFee={setFeeId} />}
				</Transition>
			}
		</>
	)
}

type PreviousFeeProps = {
	student: MISStudent
	setFee: (feeId: string) => void
}

const PreviousFees = ({ student, setFee }: PreviousFeeProps) => {
	const [selectedFee, setSelectedFee] = useState('')

	const handleSelectedFee = (id: string, fee: MISStudentFee) => {
		setFee(id)
		setSelectedFee(id)
	}

	return (
		<div className="max-h-40 md:max-h-60 mt-4 space-y-2">
			{Object.entries(student.fees || {}).map(([id, fee]) => (
				<div
					key={id}
					onClick={() => handleSelectedFee(id, fee)}
					className={clsx(
						'flex felx-row justify-between items-center p-2 bg-blue-brand text-sm rounded-lg cursor-pointer hover:bg-green-brand',
						{
							'bg-green-brand': id === selectedFee
						}
					)}>
					<div className="flex flex-col">
						<div className="font-semibold">Duration</div>
						<div>{fee.period === FeePeriod.MONTHLY ? 'Every Month' : 'One Time'}</div>
					</div>
					<div className="flex flex-col">
						<div className="font-semibold">Label</div>
						<div>{fee.name}</div>
					</div>
					<div className="flex flex-col">
						<div className="font-semibold">Amount</div>
						<div>Rs.{fee.amount}</div>
					</div>
				</div>
			))}
		</div>
	)
}
