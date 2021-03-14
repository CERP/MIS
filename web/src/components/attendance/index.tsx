import React from 'react'
import clsx from 'clsx'

export interface AttendanceStatsCard {
	attendance: {
		PRESENT: number
		ABSENT: number
		LEAVE: number
		UNMARK: number
	}
}

export const AttendanceStatsCard = ({ attendance }: AttendanceStatsCard) => (
	<div className="sm:w-full p-5 pt-2 md:pt-5 shadow-md rounded-lg border border-gray-50">
		<div></div>
		<div className="flex flex-row justify-between text-sm md:text-base">
			<div className="flex flex-col items-center justify-center text-green-brand">
				<div className="text-lg font-semibold">{attendance.PRESENT}</div>
				<div>Present</div>
			</div>
			<div className="flex flex-col items-center justify-center text-red-brand">
				<div className="text-lg font-semibold">{attendance.ABSENT}</div>
				<div>Absent</div>
			</div>
			<div className="flex flex-col items-center justify-center text-orange-brand">
				<div className="text-lg font-semibold">{attendance.LEAVE}</div>
				<div className="">Leave</div>
			</div>
			<div className="flex flex-col items-center justify-center text-gray-500">
				<div className="text-lg font-semibold">{attendance.UNMARK}</div>
				<div>Unmarked</div>
			</div>
		</div>
	</div>
)

interface SmsModalContent {
	smsIntentURL: string
	setState: (option: SmsSendOptions) => void
	state: number
	smsLogCallback: () => void
	msgCount: number
}

export enum SmsSendOptions {
	TO_ABSENT,
	TO_ALL,
	TO_LEAVE,
	TO_PRESENT
}

export const AttendanceSmsModalContent = ({
	smsIntentURL,
	state,
	smsLogCallback,
	setState,
	msgCount
}: SmsModalContent) => {
	return (
		<>
			<h1 className="text-center">Select options to send SMS</h1>
			<div>Send to:</div>
			<div className="flex items-center">
				<input
					className="form-checkbox mr-2"
					name="toAbsent"
					type="checkbox"
					onChange={() => setState(SmsSendOptions.TO_ABSENT)}
					checked={state === SmsSendOptions.TO_ABSENT}
				/>
				<label className="text-xs text-gray-700">Absent</label>
			</div>
			<div className="flex items-center">
				<input
					className="form-checkbox mr-2"
					name="toPresent"
					type="checkbox"
					onChange={() => setState(SmsSendOptions.TO_PRESENT)}
					checked={state === SmsSendOptions.TO_PRESENT}
				/>
				<label className="text-xs text-gray-700">Present</label>
			</div>
			<div className="flex items-center">
				<input
					className="form-checkbox mr-2"
					name="toLeave"
					type="checkbox"
					onChange={() => setState(SmsSendOptions.TO_LEAVE)}
					checked={state === SmsSendOptions.TO_LEAVE}
				/>
				<label className="text-xs text-gray-700">Leave</label>
			</div>
			<div className="flex items-center">
				<input
					className="form-checkbox mr-2"
					name="toAll"
					type="checkbox"
					onChange={() => setState(SmsSendOptions.TO_ALL)}
					checked={state === SmsSendOptions.TO_ALL}
				/>
				<label className="text-xs text-gray-700">All</label>
			</div>
			<div
				className={clsx('flex flex-row justify-center', {
					'pointer-events-none': msgCount === 0
				})}>
				<a href={smsIntentURL} onClick={smsLogCallback} className="tw-btn-blue mt-2">
					Send using Local SIM
				</a>
			</div>
		</>
	)
}
