import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { AppError } from 'components/error'


import {
	Landing,
	Login,
	Home,
	PageNotFound,
	About
} from 'pages'

import {
	StudentAttendance,
	StudentExam,
	StudentPayment,
	TeacherAttendance,
	SchoolExpense,
	SchoolEnrollment
} from 'pages/analytics'

import { ScrollToTop } from 'components/scrollToTop'
import { AuthRoute, PublicRoute } from 'components/authRoute'

interface S {
	error?: {
		err: Error
		errInfo: React.ErrorInfo
	}
}

export class AppRoutes extends React.Component<S> {

	state: S = {
		error: undefined
	}

	componentDidCatch(err: Error, errInfo: React.ErrorInfo) {
		this.setState({
			error: {
				err,
				errInfo
			}
		})
	}

	render() {

		if (this.state.error) {
			return <AppError error={this.state.error.err} errInfo={this.state.error.errInfo} />
		}

		return (
			<Router>
				<ScrollToTop>
					<Switch>
						<Route exact path="/" component={Landing} />
						<PublicRoute exact path="/login" component={Login} />
						<AuthRoute exact path="/home" component={Home} />
						<AuthRoute exact path="/student-attendance-analytics" component={StudentAttendance} />
						<AuthRoute exact path="/teacher-attendance-analytics" component={TeacherAttendance} />
						<AuthRoute exact path="/enrollment-analytics" component={SchoolEnrollment} />
						<AuthRoute exact path="/fee-analytics" component={StudentPayment} />
						<AuthRoute exact path="/expense-analytics" component={SchoolExpense} />
						<AuthRoute exact path="/exam-analytics" component={StudentExam} />
						<Route path="/about" component={About} />
						<Route path="*" component={PageNotFound} />
					</Switch>
				</ScrollToTop>
			</Router>
		)
	}
}