import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { AppState } from 'reducers'


type P = RouteProps & {
	component: React.FC<any>
	auth: Auth
}

const AppRoute: React.FC<P> = ({ auth, component: Component, ...rest }) => {

	return (
		<Route {...rest}
			render={props =>
				auth && auth.token ?
					(
						<Component auth={auth} {...props} />
					) :
					(
						<Redirect to={{ pathname: "/", state: { from: props.location } }} />
					)
			} />
	)
}

export const AuthRoute = connect((state: AppState) => ({
	auth: state.user.auth as Auth
}))(AppRoute)