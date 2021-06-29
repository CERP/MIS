import React, { useState } from 'react'
import clsx from 'clsx'
import cond from 'cond-construct'
import { CameraIcon } from '@heroicons/react/outline'
import { useMediaPredicate } from 'react-media-hook'
import { useSelector } from 'react-redux'

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
	const biggerThan880 = useMediaPredicate('(min-width: 880px)')
	const userId = useSelector((state: RootReducerState) => state.auth.faculty_id)
	const isAdmin = useSelector((state: RootReducerState) => state.db.faculty[userId].Admin)

	const renderComponent = () =>
		cond([
			[activeTab === Tabs.STUDENT_ATTENDANCE, () => <StudentsAttendance />],
			[activeTab === Tabs.STAFF_ATTENDANCE, () => <StaffAttendance />]
		])

	const pageTitle = (activeTab === Tabs.STUDENT_ATTENDANCE ? 'Students' : 'Staff') + ' Attendance'

	return (
		<AppLayout title={pageTitle} showHeaderTitle>
			{toggleView === AttendaceMarkOptions.MENU && (
				<div className="relative p-5 space-y-8 text-gray-700 md:p-10 md:pb-0 print:hidden">
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
							className="inline-block w-full mx-auto rounded-lg cursor-pointer bg-teal-brand hover:shadow-md">
							<div className="flex flex-col items-center justify-center p-5">
								<img className="w-20 h-20" src={iconManualEntry} alt="icon" />
								<div className="mt-4 text-lg text-white">Manual Entry</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{toggleView === AttendaceMarkOptions.MANUAL && (
				<div className={clsx(isAdmin ? '' : 'mt-4')}>
					{isAdmin && (
						<>
							{biggerThan880 ? (
								<div className="flex flex-row items-center my-4 w-full justify-center flex-wrap print:hidden space-x-2">
									<button
										onClick={() => setActiveTab(Tabs.STUDENT_ATTENDANCE)}
										className={clsx(
											'rounded-full p-2 md:px-4 w-40 text-md border shadow-md lg:text-lg hover:bg-teal-brand hover:text-white text-center',
											activeTab === Tabs.STUDENT_ATTENDANCE
												? 'bg-teal-brand text-white'
												: 'bg-white text-teal-brand'
										)}>
										Students
									</button>
									<button
										onClick={() => setActiveTab(Tabs.STAFF_ATTENDANCE)}
										className={clsx(
											'rounded-full p-2 md:px-4 w-40 text-md border shadow-md text-sm lg:text-lg hover:bg-teal-brand hover:text-white text-center',
											activeTab === Tabs.STAFF_ATTENDANCE
												? 'bg-teal-brand text-white'
												: 'bg-white text-teal-brand'
										)}>
										Staff
									</button>
								</div>
							) : (
								<Tabbar
									tab={activeTab}
									setTab={setActiveTab}
									content={TabbarContent}
								/>
							)}
						</>
					)}
					{renderComponent()}
				</div>
			)}
		</AppLayout>
	)
}
