import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { DBLoader } from 'components/animation/db-loader'
import { WSConnect } from 'components/animation/ws-connect'
import { useScrollTop } from 'hooks/useScrollTop'

interface PrivateRouteProps extends RouteProps {
	component: React.FC<any>
}

export const PublicRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
	useScrollTop(rest.location.pathname)

	const auth = useSelector((state: RootReducerState) => state.auth)
	const users = useSelector((state: RootReducerState) => state.db.users)
	const connected = useSelector((state: RootReducerState) => state.connected)
	const initialized = useSelector((state: RootReducerState) => state.initialized)

	// school logged in and there's no user, start the onboarding process
	// by creating a new user
	if (auth?.token && Object.keys(users || {}).length === 0) {
		return <Redirect to="/setup" />
	}

	if (auth?.token) {
		return <Redirect to="/staff-login" />
	}

	if (!connected && rest.location.pathname !== '/') {
		return <WSConnect />
	}

	if (!initialized && rest.location.pathname !== '/') {
		return <DBLoader />
	}
	initialized
	return (
		<Route
			{...rest}
			render={props =>
				auth?.faculty_id && auth?.token ? (
					<Redirect to={{ pathname: '/home', state: { from: props.location } }} />
				) : (
					<Component {...props} />
				)
			}
		/>
	)
}
