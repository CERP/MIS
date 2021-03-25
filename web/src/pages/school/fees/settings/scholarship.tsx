import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { Transition } from '@headlessui/react'
import { v4 } from 'node-uuid'

import { isValidStudent } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { SearchInput } from 'components/input/search'

type State = {
	classId: string
	sectionId: string
	search: string
	students?: {
		[id: string]: {
			edited: boolean
			fee: MISStudentFee & {
				id: string
			}
		}
	}
}

const SPECIAL_SCHOLARSHIP = 'SPECIAL_SCHOLARSHIP'

const blankFee = (): MISStudentFee => ({
	name: SPECIAL_SCHOLARSHIP,
	amount: '',
	type: 'SCHOLARSHIP',
	period: 'MONTHLY'
})

export const Scholarship = () => {
	const { students, classes, settings } = useSelector((state: RootReducerState) => state.db)

	const feeStudents = Object.values(students || {})
		.filter(s => isValidStudent(s) && s.Active)
		.reduce<State['students']>((agg, curr) => {
			const [id, scholarshipFee] = Object.entries(curr.fees || {}).find(
				([feeId, fee]) => fee.name === SPECIAL_SCHOLARSHIP
			) ?? [v4(), blankFee()]

			return {
				...agg,
				[curr.id]: {
					edited: false,
					fee: {
						id,
						...scholarshipFee
					}
				}
			}
		}, {})

	const [state, setState] = useState<State>({
		sectionId: '',
		search: '',
		students: feeStudents,
		classId: Object.values(classes).sort((a, b) => {
			return (a.classYear ?? 0) - (b.classYear ?? 0)
		})?.[0].id
	})

	const classDefaultFee = settings?.classes?.defaultFee?.[state.classId]
	const classAdditionalFees = settings?.classes?.additionalFees?.[state.classId]

	const sections = useMemo(
		() =>
			getSectionsFromClasses(classes).sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0)),
		[classes]
	)

	const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement & HTMLInputElement>) => {
		const { name, value } = e.target
		setState({ ...state, [name]: value })
	}

	return (
		<div className="my-4 p-5 space-y-4 w-full md:w-9/12 mx-auto">
			<div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-40">
				<div className="flex flex-row items-center space-x-4 w-full">
					<select
						value={state.classId}
						name="classId"
						onChange={handleInputChange}
						className="rounded-md tw-select shadow-sm w-full">
						<option disabled>Select Class</option>
						{Object.values(classes)
							.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
							.map(c => (
								<option key={c.id} value={c.id}>
									{toTitleCase(c.name)}
								</option>
							))}
					</select>
					<select
						value={state.sectionId}
						name="sectionId"
						onChange={handleInputChange}
						className="rounded-lg tw-select shadow-sm w-full">
						<option>Select Section</option>
						{sections
							.filter(s => s.class_id === state.classId)
							.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
							.map(s => (
								<option key={s.id + s.class_id} value={s.id}>
									{toTitleCase(s.namespaced_name, '-')}
								</option>
							))}
					</select>
				</div>
				<div className="md:hidden bg-gray-200 rounded-lg p-2  w-full text-sm md:text-base">
					<div className="flex flex-row justify-between w-full">
						<div className="font-semobold">Default Fee</div>
						<div>Rs. {classDefaultFee?.amount || 'Not Set'}</div>
					</div>
					{Object.entries(classAdditionalFees || {}).map(([id, classFee]) => (
						<div key={id} className="flex flex-row justify-between w-full">
							<div className="font-semobold">{classFee.name}</div>
							<div>Rs. {classFee.amount || 'Not Set'}</div>
						</div>
					))}
				</div>
				<SearchInput name="search" onChange={handleInputChange} />
			</div>
			<div className="hidden md:block bg-gray-200 rounded-lg p-4  w-full">
				<div className="flex flex-row justify-between w-full">
					<div className="font-semobold">Default Fee</div>
					<div>Rs. {classDefaultFee?.amount || 'Not Set'}</div>
				</div>
				{Object.entries(classAdditionalFees || {}).map(([id, classFee]) => (
					<div key={id} className="flex flex-row justify-between w-full">
						<div className="font-semobold">{classFee.name}</div>
						<div>Rs. {classFee.amount || 'Not Set'}</div>
					</div>
				))}
			</div>
			<div className={'w-full max-h-screen overflow-y-auto text-sm md:text-base space-y-2'}>
				<div className="flex flex-row justify-between bg-gray-700 rounded-lg text-white p-2 font-semibold">
					<div>Name</div>
					<div>Scholarship</div>
				</div>
				{Object.values(students)
					.filter(
						student =>
							isValidStudent(student) &&
							(state.sectionId
								? student.section_id === state.sectionId
								: sections
									.filter(section => section.class_id === state.classId)
									.map(section => section.id)
									.find(secId => secId === student.section_id)) &&
							(state.search
								? student.Name.toLowerCase().includes(state.search.toLowerCase())
								: true)
					)
					.sort((a, b) => (parseInt(a.RollNumber) ?? 0) - (parseInt(b.RollNumber) ?? 0))
					.map((s, index) => (
						<Card
							classFee={classDefaultFee}
							additionalFees={classAdditionalFees}
							key={s.id}
							student={s}
						/>
					))}
			</div>
			<div className="flex justify-end">
				<button className="tw-btn-blue w-full md:w-1/4">Save Scholarship</button>
			</div>
		</div>
	)
}

type CardProps = {
	student: MISStudent
	onChangeScholarship?: (studentId: string, amount: number) => void
	classFee: MISClassFee
	additionalFees: {
		[id: string]: MISClassFee
	}
}

const Card = ({ student, onChangeScholarship, classFee, additionalFees }: CardProps) => {
	const [isExpanded, setIsExpanded] = useState(false)

	// displayable fees
	const fees = [
		{
			...classFee,
			name: 'Default Fee'
		},
		...Object.values(additionalFees || {}),
		...Object.values(student.fees || {})
	]

	const totalFeeAmount = fees.reduce(
		(agg, curr) =>
			curr.type === 'SCHOLARSHIP'
				? agg - parseFloat(curr.amount.toString())
				: agg + parseFloat(curr.amount.toString()),
		0
	)

	return (
		<div className="border border-gray-100 shadow-md rounded-lg p-2 bg-white w-full">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col">
					<div>{toTitleCase(student.Name)}</div>
					<div className="flex flex-row items-center space-x-2">
						<div className="text-teal-brand">Final = Rs. {totalFeeAmount}</div>
						<div
							className={clsx(
								'rounded-full cursor-pointer shadow-md p-px',
								isExpanded ? 'bg-red-brand' : 'bg-gray-400'
							)}
							onClick={() => setIsExpanded(!isExpanded)}>
							<svg
								className="w-4 h-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								{isExpanded ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 15l7-7 7 7"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								)}
							</svg>
						</div>
					</div>
				</div>
				<input className="tw-input w-1/3" type="number" placeholder="Enter amount" />
			</div>
			{
				<Transition
					show={isExpanded}
					enter="transition-opacity duration-150"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					as="div"
					className="my-2 space-y-2 border-t-2 border-dashed">
					{fees.map((fee, index) => (
						<div
							key={index}
							className="flex flex-row justify-between mt-2 text-xs md:text-sm">
							<div>{fee.name}</div>
							<div>Rs.{fee.amount}</div>
						</div>
					))}
				</Transition>
			}
		</div>
	)
}
