import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { ErrorPage } from 'components/error'
import { AuthRoute } from 'components/auth_route'
import { submitError } from 'actions/core'

import {
	Landing,
	Login,
	Home,
	PageNotFound,
	About
} from 'pages'

interface P {
	sendError: (err: Error, errInfo: React.ErrorInfo) => void
}

interface S {
	error?: {
		err: Error
		errInfo: React.ErrorInfo
	}
}

class AppRoute extends React.Component<P, S> {

	constructor(props: P) {
		super(props)

		this.state = {
			error: undefined
		}
	}

	componentDidCatch(err: Error, errInfo: React.ErrorInfo) {

		this.props.sendError(err, errInfo)

		this.setState({
			error: {
				err,
				errInfo
			}
		})
	}

	render() {

		if (this.state.error) {
			return <ErrorPage error={this.state.error.err} errInfo={this.state.error.errInfo} />
		}

		return (<Router>
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route exact path="/login" component={Login} />
				<AuthRoute exact path="/home" component={Home} />
				<AuthRoute exact path="/analytics" component={Home} />
				<Route path="/about" component={About} />
				<Route path="*" component={PageNotFound} />
			</Switch>
		</Router>
		)
	}
}

const AppRoutes = connect(
	(state: RootReducerState) => ({}),
	(dispatch: Function) => ({
		sendError: (err: Error, errInfo: React.ErrorInfo) => dispatch(submitError(err, errInfo))
	})
)(AppRoute)

export { AppRoutes }
