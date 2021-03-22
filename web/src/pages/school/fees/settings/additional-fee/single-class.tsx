import React, { useState } from 'react'
import { Transition } from '@headlessui/react'
import clsx from 'clsx'

import { toTitleCase } from 'utils/toTitleCase'
import { MISFeePeriods } from 'constants/index'

interface AddFeeToClassProps {
	classes: RootDBState['classes']
	settings: MISSettings
	setClass: (classId: string) => void
	setFee: (feeId: string) => void
}

export const AddFeeToClass = ({ classes, settings, setClass, setFee }: AddFeeToClassProps) => {
	const [classId, setClassId] = useState('')

	const hanleChangeClass = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target
		setClass(value)
		setClassId(value)
	}

	const fees = settings?.classes?.additionalFees?.[classId]

	return (
		<>
			<div>Select Class</div>
			<select
				onChange={hanleChangeClass}
				name="classId"
				className="tw-is-form-bg-black tw-select py-2 w-full">
				<option value={''}>Choose from here</option>
				{Object.values(classes || {})
					.filter(c => c)
					.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
					.map(c => (
						<option key={c.id} value={c.id}>
							{toTitleCase(c.name)}
						</option>
					))}
			</select>
			<Transition
				show={!!classId}
				enter="transition-opacity duration-150"
				enterFrom="opacity-0"
				enterTo="opacity-100">
				<PreviousFees setFee={setFee} fees={fees} />
			</Transition>
		</>
	)
}

type PreviousFeeProps = {
	fees: {
		[id: string]: MISClassFee
	}
	setFee: (feeId: string) => void
}

const PreviousFees = ({ fees, setFee }: PreviousFeeProps) => {
	const [selectedFee, setSelectedFee] = useState('')

	const handleSelectedFee = (id: string) => {
		setFee(id)
		setSelectedFee(id)
	}

	return (
		<div className="max-h-40 md:max-h-60 mt-4 space-y-2 pr-2 overflow-y-auto">
			{Object.entries(fees || {}).map(([id, fee]) => (
				<div
					key={id}
					onClick={() => handleSelectedFee(id)}
					className={clsx(
						'flex felx-row justify-between items-center p-2 text-sm rounded-lg cursor-pointer hover:bg-teal-brand',
						id === selectedFee ? 'bg-teal-brand' : 'bg-blue-brand'
					)}>
					<div className="flex flex-col">
						<div className="font-semibold">Duration</div>
						<div>
							{fee.period === MISFeePeriods.MONTHLY ? 'Every Month' : 'One Time'}
						</div>
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
