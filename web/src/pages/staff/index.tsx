import React from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Route, RouteComponentProps } from 'react-router'
import { AppLayout } from 'components/Layout/appLayout'
import { CreateOrUpdateStaff } from './create'
import { StaffMemberSalary } from 'pages/expense/salary/member'
import { toTitleCase } from 'utils/toTitleCase'
import Attendance from 'modules/Teacher/Single/Attendance'
import Certificates from 'modules/Teacher/Single/Certificates'

const nestedRoutes = ['profile', 'attendance', 'salaries', 'certificates']

const StaffPage = ({ location }: RouteComponentProps) => {
	const loc = location.pathname.split('/').slice(-1).pop() as any
	const pageTitle = loc === 'new' ? 'Create new Staff' : 'Staff ' + toTitleCase(loc)

	const { faculty } = useSelector((state: RootReducerState) => state.db)
	const { faculty_id } = useSelector((state: RootReducerState) => state.auth)
	const { Admin } = faculty[faculty_id]

	const permissionError = (title: string) => {
		if (title === 'Salary' && !Admin) {
			toast.error('You do not have permission to access Salary')
		}
	}

	return (
		<AppLayout title={pageTitle} showHeaderTitle>
			{loc !== 'new' && (
				<div className="flex flex-row items-center my-2 w-full justify-center flex-wrap print:hidden">
					{nestedRoutes.map(path => (
						<Link
							key={path}
							onClick={() => permissionError(path)}
							to={path === 'Salary' ? (Admin ? path : '#') : path}
							className={clsx(
								'rounded-full px-4 py-2 m-2 text-md border shadow-md md:text-xl',
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
