import React from 'react'
import { AppLayout } from 'components/Layout/appLayout'
import clsx from 'clsx'
import { Route, RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { CreateOrUpdateStaff } from './create'

const StaffPage = ({ location }: RouteComponentProps) => {
	const loc = location.pathname.split('/').slice(-1).pop()
	return (
		<AppLayout>
			{loc !== 'new' && (
				<div className="flex flex-row items-center my-2 w-full justify-center flex-wrap print:hidden">
					<Link
						to="profile"
						className={clsx(
							'rounded-full px-4 py-2 m-2 text-md border shadow-md md:text-xl',
							loc === 'profile'
								? 'bg-teal-brand text-white'
								: 'bg-white text-teal-brand'
						)}
						replace={true}>
						Profile
					</Link>
					<Link
						to="attendance"
						className={clsx(
							'rounded-full px-4 py-2 m-2 text-md border shadow-md md:text-xl',
							loc === 'attendance'
								? 'bg-teal-brand text-white'
								: 'bg-white text-teal-brand'
						)}
						replace={true}>
						Attendance
					</Link>
				</div>
			)}
			<Route path="/staff/new">
				<CreateOrUpdateStaff />
			</Route>
			<Route path="/staff/:id/profile">
				<CreateOrUpdateStaff />
			</Route>
		</AppLayout>
	)
}

export default StaffPage
