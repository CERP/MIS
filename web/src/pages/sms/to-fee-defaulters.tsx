import clsx from 'clsx'
import React from 'react'

interface ToFeeDefaultersProps {
	toggleOptions: () => void
	showOptions: boolean
}

export const ToFeeDefaulters = ({ toggleOptions, showOptions }: ToFeeDefaultersProps) => {
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
					<div className="">Pending Fee more than</div>
					<input
						// onChange={e =>
						//     setState({
						//         ...state,
						//         pendingAmount: isNaN(e.target.valueAsNumber)
						//             ? 0
						//             : e.target.valueAsNumber
						//     })
						// }
						className="tw-input tw-is-form-bg-black focus-within:bg-transparent w-full"
						placeholder="Enter pending amount"
						type="number"
					/>
					<div className="">Not Paid since</div>
					<div className="flex flex-row justify-between">
						<div className="flex flex-row items-center">
							<input
								// onChange={() =>
								//     setState({
								//         ...state,
								//         pendingDuration: NotPaidMonthDuration.ONE
								//     })
								// }
								className="form-radio text-teal-brand mr-2"
								type="radio"
								name="duration"
							/>
							<span>1 Month</span>
						</div>
						<div className="flex flex-row items-center">
							<input
								// onChange={() =>
								//     setState({
								//         ...state,
								//         pendingDuration: NotPaidMonthDuration.THREE
								//     })
								// }
								className="form-radio text-teal-brand mr-2"
								type="radio"
								name="duration"
							/>
							<span>3 months</span>
						</div>
						<div className="flex flex-row items-center">
							<input
								// onChange={() =>
								//     setState({
								//         ...state,
								//         pendingDuration: NotPaidMonthDuration.SIX
								//     })
								// }
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
