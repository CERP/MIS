import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'

import { SearchInput } from 'components/input/search'
import { getPaymentLabel, isValidStudent } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import { MISFeePeriods } from 'constants/index'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import UserIconSvg from 'assets/svgs/user.svg'

interface AddFeeToStudentProps {
	students: RootDBState['students']
	classes: RootDBState['classes']
	setStudentId: (sid: string) => void
	setFee: (feeId: string) => void
	resetStudent: () => void
}

export const AddFeeToStudent = ({
	students,
	classes,
	setStudentId,
	setFee,
	resetStudent
}: AddFeeToStudentProps) => {
	const [searchText, setSearchText] = useState('')
	const [student, setStudent] = useState<MISStudent & { section: AugmentedSection }>()

	const clearStudent = () => {
		setStudent(undefined), resetStudent()
	}

	useEffect(() => {
		if (student) {
			const section = getSectionsFromClasses(classes).find(s => s.id === student.id)
			setStudent({ ...students?.[student.id], section })
		}
	}, [students])

	const sectionStudents = useMemo(() => {
		const sections = getSectionsFromClasses(classes)
		return Object.values(students)
			.filter(s => isValidStudent(s, { active: true }))
			.map(s => {
				const section = sections.find(section => s.section_id === section.id)
				return {
					...s,
					section
				}
			})
	}, [students, classes])

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
						{sectionStudents
							.filter(s =>
								searchText
									? s.Name.toLowerCase().includes(searchText.toLowerCase())
									: true
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
												s.ProfilePicture?.url ??
												s.ProfilePicture?.image_string ??
												UserIconSvg
											}
											className="w-6 h-6 mr-2 bg-gray-500 rounded-full"
											alt={s.Name}
										/>
										<div className="text-sm">{toTitleCase(s.Name)}</div>
									</div>
									<div className="text-xs">{s.section?.namespaced_name}</div>
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
					<div className="flex flex-row items-center justify-between p-3 text-gray-900 rounded-full bg-white">
						<div className="flex flex-row items-center">
							<img
								src={
									student?.ProfilePicture?.url ??
									student?.ProfilePicture?.image_string ??
									UserIconSvg
								}
								className="w-6 h-6 mr-2 bg-gray-500 rounded-full"
								alt={student?.Name}
							/>
							<div>{student?.Name}</div>
						</div>
						<div className="text-xs">{student?.section?.namespaced_name}</div>
						<XCircleIcon
							onClick={clearStudent}
							className="w-6 cursor-pointer rounded-full text-white bg-red-brand"
						/>
					</div>
					{student && <PreviousFees student={student} setFee={setFee} />}
				</Transition>
			}
		</>
	)
}

type PreviousFeeProps = {
	student: MISStudent & { section: AugmentedSection }
	setFee: (feeId: string) => void
}

const PreviousFees = ({ student, setFee }: PreviousFeeProps) => {
	const [selectedFee, setSelectedFee] = useState('')

	const handleSelectedFee = (id: string) => {
		setFee(id)
		setSelectedFee(id)
	}

	return (
		<div className="max-h-40 md:max-h-60 mt-4 space-y-2  pr-2 overflow-y-auto">
			{Object.entries(student.fees ?? {}).map(([id, fee]) => (
				<div
					key={id}
					onClick={() => handleSelectedFee(selectedFee ? '' : id)}
					className={clsx(
						'flex felx-row justify-between items-center p-2 text-sm rounded-lg cursor-pointer hover:bg-teal-brand',
						{
							'pointer-events-none bg-gray-500': fee.name === 'SPECIAL_SCHOLARSHIP',
							'bg-teal-brand': id === selectedFee,
							'bg-blue-brand':
								fee.name !== 'SPECIAL_SCHOLARSHIP' && id !== selectedFee
						}
					)}>
					<div className="flex flex-col">
						<div className="font-semibold">Duration</div>
						<div>
							{fee.period === MISFeePeriods.MONTHLY ? 'Every Month' : 'One Time'}
						</div>
					</div>
					<div className="flex flex-col">
						<div className="font-semibold">Label</div>
						<div>{getPaymentLabel(fee.name, fee.type)}</div>
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
