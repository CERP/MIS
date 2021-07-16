import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'
import toTitleCase from 'utils/toTitleCase'

type StudentAttendancePrintProps = {
	studentName: string
	attendance: MISStudentAttendanceEntry[]
	presents: number
	absents: number
	leaves: number
	schoolName: string
	schoolAddress: string
	schoolPhoneNumber: string
}
export const StudentAttendancePrint = ({
	studentName,
	attendance,
	presents,
	absents,
	leaves,
	schoolName,
	schoolAddress,
	schoolPhoneNumber
}: StudentAttendancePrintProps) => {
	return (
		<div className="hidden print:block py-4 px-14 w-full">
			<div className="flex text-3xl mb-3 font-semibold flex-1 items-center justify-center">
				{schoolName}
			</div>
			<div className="flex text-xl text-center mb-3 font-medium flex-1 items-center justify-center">
				{schoolAddress}
			</div>
			<div className="flex text-xl mb-6 font-normal flex-1 items-center justify-center">
				Contact Number: {schoolPhoneNumber}
			</div>
			<div className="flex text-3xl mb-10 font-normal flex-1 items-center justify-center">
				{studentName}'s Attendance Record
			</div>
			<div className="flex text-lg flex-col w-full mb-5 space-y-2">
				<div className="flex flex-1 justify-between">
					<h1>Days Present</h1>
					<h1>{presents}</h1>
				</div>
				<div className="flex flex-1 justify-between">
					<h1>Days Absent</h1>
					<h1>{absents}</h1>
				</div>
				<div className="flex flex-1 justify-between">
					<h1>Days on Leave</h1>
					<h1>{leaves}</h1>
				</div>
				<div className="flex flex-1 justify-between">
					<h1>Present Percentage</h1>
					<h1> {((presents / (absents + presents + leaves)) * 100).toFixed(2)}%</h1>
				</div>
			</div>
			<div className="block border border-gray-700 p-2 text-lg w-full mb-5 space-y-3">
				{attendance.map(att => {
					return (
						<div style={{ breakInside: 'avoid' }} className="block w-full">
							<div className="flex flex-row justify-between">
								<h1 className=" ">{moment(att.time).format('DD-MM-YYYY')}</h1>
								<h1 className=" ">{toTitleCase(att.status)}</h1>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
