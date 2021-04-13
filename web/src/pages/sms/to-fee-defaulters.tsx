import React from 'react'
import clsx from 'clsx'

export enum NotPaidMonthDuration {
	ONE = 1,
	THREE = 3,
	SIX = 6
}

interface ToFeeDefaultersProps {
	toggleOptions: () => void
	showOptions: boolean
	setPendingAmount: (amt: number) => void
	setNotPaidDuration: (duration: NotPaidMonthDuration) => void
}

export const ToFeeDefaulters = ({
	toggleOptions,
	showOptions,
	setPendingAmount,
	setNotPaidDuration
}: ToFeeDefaultersProps) => {
	return (
		<div className="space-y-2 text-white">
			<div className="flex flex-row items-center">
				<div
					onClick={toggleOptions}
					className={clsx(
						'mr-4 w-8 h-8 flex items-center justify-center rounded-full shadow-md text-lg',
						showOptions ? 'bg-red-brand' : 'bg-blue-brand'
					)}>
					{showOptions ? '-' : '+'}
				</div>
				<div>{showOptions ? 'Hide more options' : 'See more options'}</div>
			</div>
			{showOptions && (
				<>
					<div className="">Pending dues more than</div>
					<input
						onChange={e => setPendingAmount(e.target.valueAsNumber)}
						className="tw-input tw-is-form-bg-black focus-within:bg-transparent w-full"
						placeholder="Enter pending amount"
						type="number"
					/>
					<div className="">Not Paid since</div>
					<div className="flex flex-row justify-between">
						<div className="flex flex-row items-center">
							<input
								onChange={() => setNotPaidDuration(NotPaidMonthDuration.ONE)}
								className="form-radio text-teal-brand mr-2"
								type="radio"
								name="duration"
							/>
							<span>1 Month</span>
						</div>
						<div className="flex flex-row items-center">
							<input
								onChange={() => setNotPaidDuration(NotPaidMonthDuration.THREE)}
								className="form-radio text-teal-brand mr-2"
								type="radio"
								name="duration"
							/>
							<span>3 months</span>
						</div>
						<div className="flex flex-row items-center">
							<input
								onChange={() => setNotPaidDuration(NotPaidMonthDuration.SIX)}
								className="form-radio text-teal-brand mr-2"
								type="radio"
								name="duration"
							/>
							<span>6 months</span>
						</div>
					</div>
				</>
			)}{' '}
		</div>
	)
}
