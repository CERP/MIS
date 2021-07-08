import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Route, RouteComponentProps } from 'react-router'
import { useSelector } from 'react-redux'

import { AppLayout } from 'components/Layout/appLayout'
import { StudentPayments } from 'pages/students/fee-payments/payments'
import { CreateOrUpdateStudent } from './add'
import { toTitleCase } from 'utils/toTitleCase'
import StudentMarks from 'modules/Student/Single/Marks'
import StudentAttendance from 'modules/Student/Single/Attendance'
import StudentCertificates from 'modules/Student/Single/Certificates'
import { checkPermission } from 'utils'

const nestedRoutes = ['profile', 'marks', 'attendance', 'payments', 'certificates']

const StudentPage = ({ location }: RouteComponentProps) => {
	const loc = location.pathname.split('/').slice(-1).pop()
	const pageTitle = loc === 'new' ? 'Create new Student' : 'Student ' + toTitleCase(loc)
	const userId = useSelector((state: RootReducerState) => state.auth.faculty_id)
	const userInfo = useSelector((state: RootReducerState) => state.db.faculty[userId])
	const tipAccess = useSelector((state: RootReducerState) => state.db.targeted_instruction_access)

	return (
		<AppLayout title={pageTitle} showHeaderTitle>
			{loc !== 'new' && (
				<div className="flex flex-row items-center my-4 space-x-2 w-full justify-center flex-wrap print:hidden space-y-1">
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
			<Route path="/students/new" component={CreateOrUpdateStudent} />
			<Route path="/students/:id/profile" component={CreateOrUpdateStudent} />
			<Route path="/students/:id/attendance" component={StudentAttendance} />
			<Route path="/students/:id/payments" component={StudentPayments} />
			<Route path="/students/:id/marks" component={StudentMarks} />
			<Route path="/students/:id/certificates" component={StudentCertificates} />
		</AppLayout>
	)
}

export default StudentPage
