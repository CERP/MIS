import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { DBLoader } from 'components/animation/db-loader'
import { useScrollTop } from 'hooks/useScrollTop'

interface PrivateRouteProps extends RouteProps {
	component: React.FC<any>
}

export const SchoolRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
	useScrollTop(rest.location.pathname)

	const { auth, initialized } = useSelector((state: RootReducerState) => state)

	// for school login, it won't return
	if (!initialized) {
		return <DBLoader />
	}

	if (auth.token && auth.faculty_id) {
		return <Redirect to={'/home'} />
	}

	return (
		<Route
			{...rest}
			render={props =>
				auth?.token ? (
					<Component {...props} />
				) : (
					<Redirect to={{ pathname: '/school-login', state: { from: props.location } }} />
				)
			}
		/>
	)
}
