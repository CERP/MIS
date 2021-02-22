import React from 'react'
import { Link } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { TextDivider } from 'components/divider'

import iconManualEntry from '../assets/manual-entry.svg'

export const SchoolAttendance = () => {
	return (
		<AppLayout title={"School Attendance"}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative print:hidden space-y-8">
				<div className="text-center font-bold text-2xl">Attendance</div>
				<div className="w-full md:w-3/5 mx-auto">
					<Link to="/students/attendance-scan">
						<div className="bg-orange-brand inline-block mx-auto rounded-lg w-full">
							<div className="p-5 flex flex-col items-center justify-center">
								<svg className="w-20 h-20 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								<div className="text-white mt-4 text-lg">Scan ID Card</div>
							</div>
						</div>
					</Link>
				</div>
				<TextDivider dividerColor={"bg-gray-900"} textBgColor={"bg-white"} textColor={"text-gray-900"} />
				<div className="w-full md:w-3/5 mx-auto">
					<Link to="/students/attendance">
						<div className="inline-block bg-blue-brand mx-auto rounded-lg w-full">
							<div className="p-5 flex flex-col items-center justify-center">
								<img className="w-20 h-20" src={iconManualEntry} alt="icon" />
								<div className="text-white mt-4 text-lg">Manual Entry</div>
							</div>
						</div>
					</Link>
				</div>
			</div>
		</AppLayout>
	)
}