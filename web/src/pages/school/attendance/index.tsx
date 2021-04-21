import React, { useState } from 'react'
import { CameraIcon } from '@heroicons/react/outline'
import cond from 'cond-construct'

import { AppLayout } from 'components/Layout/appLayout'
import { TextDivider } from 'components/divider'
import { StudentsAttendance } from 'pages/students/attendance'
import { StaffAttendance } from 'pages/staff/attendance'
import { Tabbar } from 'components/tabs'

import iconManualEntry from '../assets/manual-entry.svg'

enum AttendaceMarkOptions {
	MANUAL,
	SCAN,
	MENU
}

enum Tabs {
	STAFF_ATTENDANCE,
	STUDENT_ATTENDANCE
}

const TabbarContent = [
	{
		tab: Tabs.STUDENT_ATTENDANCE,
		title: 'Students'
	},
	{
		tab: Tabs.STAFF_ATTENDANCE,
		title: 'Teachers'
	}
]

export const SchoolAttendance = () => {
	const [toggleView, setToggleView] = useState<AttendaceMarkOptions>(AttendaceMarkOptions.MENU)
	const [activeTab, setActiveTab] = useState<Tabs>(Tabs.STUDENT_ATTENDANCE)

	const renderComponent = () =>
		cond([
			[activeTab === Tabs.STUDENT_ATTENDANCE, () => <StudentsAttendance />],
			[activeTab === Tabs.STAFF_ATTENDANCE, () => <StaffAttendance />]
		])

	return (
		<AppLayout title={'School Attendance'}>
			{toggleView === AttendaceMarkOptions.MENU && (
				<div className="relative p-5 space-y-8 text-gray-700 md:p-10 md:pb-0 print:hidden">
					<div className="text-2xl font-bold text-center">Attendance</div>
					<div className="w-full mx-auto md:w-3/5">
						<div
							onClick={() => setToggleView(AttendaceMarkOptions.SCAN)}
							className="inline-block w-full mx-auto rounded-lg cursor-pointer bg-orange-brand hover:shadow-md">
							<div className="flex flex-col items-center justify-center p-5">
								<CameraIcon className="w-20 h-20 text-white" />
								<div className="mt-4 text-lg text-white">Scan ID Card</div>
							</div>
						</div>
					</div>
					<TextDivider
						dividerColor={'bg-gray-900'}
						textBgColor={'bg-white'}
						textColor={'text-gray-900'}
					/>
					<div className="w-full mx-auto md:w-3/5">
						<div
							onClick={() => setToggleView(AttendaceMarkOptions.MANUAL)}
							className="inline-block w-full mx-auto rounded-lg cursor-pointer bg-blue-brand hover:shadow-md">
							<div className="flex flex-col items-center justify-center p-5">
								<img className="w-20 h-20" src={iconManualEntry} alt="icon" />
								<div className="mt-4 text-lg text-white">Manual Entry</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{toggleView === AttendaceMarkOptions.MANUAL && (
				<>
					<Tabbar tab={activeTab} setTab={setActiveTab} content={TabbarContent} />
					{renderComponent()}
				</>
			)}
		</AppLayout>
	)
}
