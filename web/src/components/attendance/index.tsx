import React from 'react'

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
				<div>Unmark</div>
			</div>
		</div>
	</div>
)
