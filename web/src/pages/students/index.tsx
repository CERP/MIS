import clsx from 'clsx'
import { AppLayout } from 'components/Layout/appLayout'
import { StudentPayments } from 'pages/students/fee-payments/payments'
import React from 'react'
import { Route, RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { CreateOrUpdateStudent } from './add'

const StudentPage = ({ location }: RouteComponentProps) => {
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
						to="payments"
						className={clsx(
							'rounded-full px-4 py-2 m-2 text-md border shadow-md md:text-xl',
							loc === 'payments'
								? 'bg-teal-brand text-white'
								: 'bg-white text-teal-brand'
						)}
						replace={true}>
						Payments
					</Link>
					<Link
						to="grades"
						className={clsx(
							'rounded-full px-4 py-2 m-2 text-md border shadow-md md:text-xl',
							loc === 'grades'
								? 'bg-teal-brand text-white'
								: 'bg-white text-teal-brand'
						)}
						replace={true}>
						Grades
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
					<Link
						to="certificates"
						className={clsx(
							'rounded-full px-4 py-2 m-2 text-md border shadow-md md:text-xl',
							loc === 'certificates'
								? 'bg-teal-brand text-white'
								: 'bg-white text-teal-brand'
						)}
						replace={true}>
						Certificates
					</Link>
				</div>
			)}
			<Route path="/students/new">
				<CreateOrUpdateStudent />
			</Route>
			<Route path="/students/:id/profile">
				<CreateOrUpdateStudent />
			</Route>
			<Route path="/students/:id/payments">
				<StudentPayments />
			</Route>
		</AppLayout>
	)
}

export default StudentPage
