import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

interface PrivateRouteProps extends RouteProps {
	Component: React.FC<any>
}

export const PublicRoute = ({ Component, ...rest }: PrivateRouteProps) => {
	return (
		<Route
			{...rest}
			render={props =>
				true ? (
					<Redirect to={{ pathname: '/home', state: { from: props.location } }} />
				) : (
					<Component {...props} />
				)
			}
		/>
	)
}
