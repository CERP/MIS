import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { AppError } from 'components/error'


import {
	Landing,
	Login,
	Home,
	PageNotFound,
	About,
	Analytics
} from 'pages'
import { ScrollToTop } from 'components/scrollToTop'

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
						<Route exact path="/login" component={Login} />
						<Route exact path="/home" component={Home} />
						<Route exact path="/student-analytics" component={Analytics} />
						<Route exact path="/teacher-analytics" component={Analytics} />
						<Route exact path="/fee-analytics" component={Analytics} />
						<Route path="/about" component={About} />
						<Route path="*" component={PageNotFound} />
					</Switch>
				</ScrollToTop>
			</Router>
		)
	}
}