import React, { Component } from 'react'
import { Route, Link, RouteComponentProps } from 'react-router-dom'
import Fees from './Fees'
import Attendance from './Attendance'
import ExpenseAnalytics from './Expenses'
import TeacherAttendanceAnalytics from './Teacher-Attendance'
import ExamsAnalytics from './Exams/index'
import { AppLayout } from 'components/Layout/appLayout'
import { toTitleCase } from 'utils/toTitleCase'

import './style.css'

export const Analytics = ({ location }: RouteComponentProps) => {
	const loc = location.pathname.split('/').slice(-1).pop()
	const pageTitle = loc === 'analytics' ? 'Fee Analytics' : toTitleCase(loc) + ' Analytics'

	return (
		<AppLayout title={pageTitle} showHeaderTitle>
			<div className="analytics">
				<div className="row tabs">
					<Link
						className={`button ${loc === 'fees' || loc === 'analytics' ? 'orange' : ''
							}`}
						to="/analytics/fees"
						replace={true}>
						Fees
					</Link>
					<Link
						className={`button ${loc === 'attendance' ? 'blue' : ''}`}
						to="/analytics/attendance"
						replace={true}>
						Attendance
					</Link>
					<Link
						className={`button ${loc === 'teacher-attendance' ? 'red' : ''}`}
						to="teacher-attendance"
						replace={true}>
						Teacher Attendance
					</Link>
					<Link
						className={`button ${loc === 'expenses' ? 'green' : ''}`}
						to="/analytics/expenses"
						replace={true}>
						Expenses
					</Link>
					<Link
						className={`button ${loc === 'exams' ? 'blue' : ''}`}
						to="/analytics/exams"
						replace={true}>
						Exams
					</Link>
				</div>
				<Route path="/analytics/fees" exact component={Fees} />
				<Route path="/analytics" exact component={Fees} />
				<Route path="/analytics/attendance" component={Attendance} />
				<Route path="/analytics/expenses" component={ExpenseAnalytics} />
				<Route
					path="/analytics/teacher-attendance"
					component={TeacherAttendanceAnalytics}
				/>
				<Route path="/analytics/exams" component={ExamsAnalytics} />
			</div>
		</AppLayout>
	)
}

export default Analytics
