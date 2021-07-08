import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { v4 } from 'node-uuid'
import { useDispatch, useSelector } from 'react-redux'
import { Transition } from '@headlessui/react'

import {
	classYearSorter,
	getPaymentLabel,
	isMonthlyFee,
	isValidStudent,
	rollNumberSorter
} from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { SearchInput } from 'components/input/search'
import { addMultipleFees } from 'actions'
import { MISFeeLabels } from 'constants/index'
import { Link } from 'react-router-dom'

type State = {
	classId: string
	sectionId: string
	search: string
	students?: {
		[id: string]: {
			edited: boolean
			fee: AugmentedFee
		}
	}
}
type FeeAddItem = MISStudentFee & {
	student: MISStudent
	fee_id: string
}

type AugmentedFee = MISStudentFee & {
	id: string
}

const blankFee = (): MISStudentFee => ({
	name: MISFeeLabels.SPECIAL_SCHOLARSHIP,
	amount: '',
	type: 'SCHOLARSHIP',
	period: 'MONTHLY'
})

const getFeeStudents = (students: MISStudent[]) => {
	return students
		.filter(s => isValidStudent(s, { active: true }))
		.reduce<State['students']>((agg, curr) => {
			const [id, scholarshipFee] = Object.entries(curr.fees || {})
				.filter(([feeId, fee]) => !isMonthlyFee(fee))
				.find(([feeId, fee]) => fee.name === MISFeeLabels.SPECIAL_SCHOLARSHIP) ?? [
					v4(),
					blankFee()
				]

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
}

export const Scholarship = () => {
	const dispatch = useDispatch()
	const students = useSelector((state: RootReducerState) => state.db.students)
	const classes = useSelector((state: RootReducerState) => state.db.classes)
	const settings = useSelector((state: RootReducerState) => state.db.settings)

	const [state, setState] = useState<State>({
		sectionId: '',
		search: '',
		students: {},
		classId: Object.values(classes).sort(classYearSorter)?.[0].id
	})

	useEffect(() => {
		setState(prevState => {
			return {
				...prevState,
				students: getFeeStudents(Object.values(students || {}))
			}
		})
	}, [students])

	const classDefaultFee = settings?.classes?.defaultFee?.[state.classId]
	const classAdditionalFees = settings?.classes?.additionalFees?.[state.classId]

	const sections = useMemo(() => getSectionsFromClasses(classes).sort(classYearSorter), [classes])

	const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement & HTMLInputElement>) => {
		const { name, value } = e.target
		setState({ ...state, [name]: value })
	}

	const handleChangeScholarship = (studentId: string, amount: number) => {
		const scholarship = state['students'][studentId]

		setState({
			...state,
			students: {
				...state.students,
				[studentId]: {
					edited: true,
					fee: {
						...scholarship['fee'],
						amount: amount as any
					}
				}
			}
		})
	}

	const saveScholarship = () => {
		const updatedScholarships = Object.entries(state.students ?? {}).reduce<FeeAddItem[]>(
			(agg, [studentId, feeItem]) => {
				const { edited, fee } = feeItem

				if (edited) {
					const { id, ...rest } = fee
					return [
						...agg,
						{
							student: students[studentId],
							fee_id: id,
							...rest
						}
					]
				}

				return agg
			},
			[]
		)

		if (updatedScholarships.length > 0) {
			dispatch(addMultipleFees(updatedScholarships))

			const scholarshipFor = updatedScholarships.length === 0 ? 'student' : 'students'
			const msg = `Scholarship has been updated for ${updatedScholarships.length} ${scholarshipFor}`
			toast.success(msg)
		}
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
							.sort(classYearSorter)
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
							.sort(classYearSorter)
							.map(s => (
								<option key={s.id + s.class_id} value={s.id}>
									{s.namespaced_name}
								</option>
							))}
					</select>
				</div>
				<div className="md:hidden bg-gray-200 rounded-lg p-2  w-full text-sm md:text-base">
					<div className="flex flex-row justify-between w-full">
						<div className="font-semobold">Class Fee</div>
						<div>Rs. {classDefaultFee?.amount || 'Not Set'}</div>
					</div>
					{Object.entries(classAdditionalFees ?? {}).map(([id, classFee]) => (
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
					<div className="font-semobold">Class Fee</div>
					<div>Rs. {classDefaultFee?.amount || 'Not Set'}</div>
				</div>
				{Object.entries(classAdditionalFees ?? {}).map(([id, classFee]) => (
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
							isValidStudent(student, { active: true }) &&
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
					.sort(rollNumberSorter)
					.map((s, index) => (
						<Card
							classFee={classDefaultFee}
							additionalFees={classAdditionalFees}
							key={s.id}
							onChangeScholarship={handleChangeScholarship}
							student={s}
							scholarshipFee={state.students?.[s.id]?.fee}
						/>
					))}
			</div>
			<div className="flex justify-end">
				<button onClick={saveScholarship} className="tw-btn-blue w-full md:w-1/4">
					Save Scholarship
				</button>
			</div>
		</div>
	)
}

type CardProps = {
	student: MISStudent
	onChangeScholarship: (studentId: string, amount: number) => void
	classFee: MISClassFee
	additionalFees: {
		[id: string]: MISClassFee
	}
	scholarshipFee: AugmentedFee
}

const Card = ({
	student,
	onChangeScholarship,
	classFee,
	additionalFees,
	scholarshipFee
}: CardProps) => {
	const [isExpanded, setIsExpanded] = useState(false)

	// displayable fees
	const fees = [
		{
			...classFee,
			name: 'Class Fee'
		},
		...Object.values(additionalFees ?? {}),
		...Object.values(student.fees ?? {}).filter(fee => !isMonthlyFee(fee))
	]

	const totalFeeAmount = fees
		.filter(f => f.amount)
		.reduce(
			(agg, curr) =>
				curr.type === 'SCHOLARSHIP'
					? agg - parseFloat(curr.amount.toString())
					: agg + parseFloat(curr.amount.toString()),
			0
		)

	return (
		<div className="border border-gray-100 shadow-md rounded-lg p-2 bg-white w-full">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col w-full">
					<Link
						to={`/students/${student.id}/payments`}
						className="hover:underline hover:text-blue-brand">
						{toTitleCase(student.Name)}
					</Link>
					<div className="flex flex-row items-center space-x-2">
						<div className="text-teal-brand w-2/5 md:w-1/3">
							Final = Rs. {totalFeeAmount}
						</div>
						<div
							className={clsx(
								'rounded-full cursor-pointer shadow-md p-px',
								isExpanded ? 'bg-red-brand' : 'bg-gray-400'
							)}
							onClick={() => setIsExpanded(!isExpanded)}>
							<svg
								className="w-4 h-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor">
								{isExpanded ? (
									<path
										fillRule="evenodd"
										d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
										clipRule="evenodd"
									/>
								) : (
									<path
										fillRule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								)}
							</svg>
						</div>
					</div>
				</div>
				<input
					onChange={e =>
						onChangeScholarship(
							student.id,
							isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber
						)
					}
					defaultValue={scholarshipFee?.amount}
					className="tw-input w-1/3"
					type="number"
					placeholder="Enter amount"
				/>
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
							<div>{getPaymentLabel(fee.name, fee.type)}</div>
							<div>Rs.{fee.amount}</div>
						</div>
					))}
				</Transition>
			}
		</div>
	)
}
