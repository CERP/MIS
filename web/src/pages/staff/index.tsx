import React from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Route, RouteComponentProps } from 'react-router'
import { AppLayout } from 'components/Layout/appLayout'
import { CreateOrUpdateStaff } from './create'
import { StaffMemberSalary } from 'pages/expense/salary/member'
import { toTitleCase } from 'utils/toTitleCase'
import Attendance from 'modules/Teacher/Single/Attendance'
import Certificates from 'modules/Teacher/Single/Certificates'
import { checkPermission } from 'utils'

const nestedRoutes = ['profile', 'attendance', 'salaries', 'certificates']

const StaffPage = ({ location }: RouteComponentProps) => {
	const loc = location.pathname.split('/').slice(-1).pop() as any
	const pageTitle = loc === 'new' ? 'Create new Staff' : 'Staff ' + toTitleCase(loc)

	const userId = useSelector((state: RootReducerState) => state.auth.faculty_id)
	const userInfo = useSelector((state: RootReducerState) => state.db.faculty[userId])
	const tipAccess = useSelector((state: RootReducerState) => state.db.targeted_instruction_access)

	return (
		<AppLayout title={pageTitle} showHeaderTitle>
			{loc !== 'new' && (
				<div className="flex flex-row items-center my-4 w-full justify-center flex-wrap print:hidden space-x-2 space-y-1">
					{nestedRoutes
						.filter(route =>
							checkPermission(
								userInfo.permissions,
								route,
								userInfo.SubAdmin,
								userInfo.Admin,
								tipAccess
							)
						)
						.map(path => (
							<Link
								key={path}
								to={path}
								className={clsx(
									'rounded-full px-2 py-1 md:px-4 md:py-2 text-md border shadow-md text-sm lg:text-lg hover:bg-teal-brand hover:text-white',
									loc === path
										? 'bg-teal-brand text-white'
										: 'bg-white text-teal-brand'
								)}
								replace={true}>
								{toTitleCase(path)}
							</Link>
						))}
				</div>
			)}
			<Route path="/staff/new" component={CreateOrUpdateStaff} />
			<Route path="/staff/:id/profile" exact component={CreateOrUpdateStaff} />
			<Route path="/staff/:id/salaries" exact component={StaffMemberSalary} />
			<Route path="/staff/:id/attendance" exact component={Attendance} />
			<Route path="/staff/:id/certificates" exact component={Certificates} />
		</AppLayout>
	)
}

export default StaffPage
