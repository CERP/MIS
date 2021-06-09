import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Route, RouteComponentProps } from 'react-router'
import { AppLayout } from 'components/Layout/appLayout'
import { CreateOrUpdateStaff } from './create'
import { StaffMemberSalary } from 'pages/expense/salary/member'
import toTitleCase from 'utils/toTitleCase'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const pathMap = {
	Profile: 'profile',
	Attendance: 'attendance',
	Salary: 'salaries'
}

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
					{Object.entries(pathMap).map(([title, path]) => (
						<Link
							key={path}
							onClick={() => permissionError(title)}
							to={title === 'Salary' ? (Admin ? path : '#') : path}
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
			<Route path="/staff/:id/profile" exact component={CreateOrUpdateStaff} />
			<Route path="/staff/:id/salaries" exact component={StaffMemberSalary} />
			<Route path="/staff/:id/attendance" exact component={Attendance} />
		</AppLayout>
	)
}

export default StaffPage
