import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Route, RouteComponentProps } from 'react-router'

import { AppLayout } from 'components/Layout/appLayout'
import { StudentPayments } from 'pages/students/fee-payments/payments'
import { CreateOrUpdateStudent } from './add'

const Paths = {
	Profile: 'profile',
	Payments: 'payments',
	Grades: 'grades',
	Attendance: 'attendance',
	Certificates: 'certificates'
}

const StudentPage = ({ location }: RouteComponentProps) => {
	// To Add new a new path, update the 'Paths' Object & create a route

	const loc = location.pathname.split('/').slice(-1).pop()

	return (
		<AppLayout>
			{loc !== 'new' && (
				<div className="flex flex-row items-center my-2 w-full justify-center flex-wrap print:hidden">
					{Object.entries(Paths).map(([title, path]) => (
						<Link
							key={path}
							to={path}
							className={clsx(
								'rounded-full px-4 py-2 m-2 text-md border shadow-md md:text-xl cursor-pointer hover:bg-teal-brand hover:text-white',
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
			<Route path="/students/new" component={CreateOrUpdateStudent} />
			<Route path="/students/:id/profile" component={CreateOrUpdateStudent} />
			<Route path="/students/:id/payments" component={StudentPayments} />
		</AppLayout>
	)
}

export default StudentPage
