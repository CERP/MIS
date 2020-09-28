import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { ErrorPage } from 'components/error'
import { AuthRoute } from 'components/auth_route'

import {
	Landing,
	Login,
	Home,
	PageNotFound,
	About
} from 'pages'

interface S {
	error?: {
		err: Error
		errInfo: React.ErrorInfo
	}
}

class AppRoutes extends React.Component<S> {

	state = {
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
			//@ts-ignore
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

export { AppRoutes } 