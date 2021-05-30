import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Route, RouteComponentProps } from 'react-router'

import { AppLayout } from 'components/Layout/appLayout'
import { CreateOrUpdateStaff } from './create'
import { StaffMemberSalary } from 'pages/expense/salary/member'

const StaffPage = ({ location }: RouteComponentProps) => {
	const loc = location.pathname.split('/').slice(-1).pop()
	const pathMap = {
		Profile: 'profile',
		Attendance: 'attendance',
		Salary: 'salaries'
	}

	return (
		<AppLayout>
			{loc !== 'new' && (
				<div className="flex flex-row items-center my-2 w-full justify-center flex-wrap print:hidden">
					{Object.entries(pathMap).map(([title, path]) => (
						<Link
							key={path}
							to={path}
							className={clsx(
								'rounded-full px-4 py-2 m-2 text-md border shadow-md md:text-xl',
								loc === path
									? 'bg-teal-brand text-white'
									: 'bg-white text-teal-brand'
							)}
							replace={true}>
							{title}
						</Link>
					))}
				</div>
			)}
			<Route path="/staff/new" component={CreateOrUpdateStaff} />
			<Route path="/staff/:id/profile" component={CreateOrUpdateStaff} />
			<Route path="/staff/:id/salaries" component={StaffMemberSalary} />
		</AppLayout>
	)
}

export default StaffPage
