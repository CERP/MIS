import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { Spinner } from 'components/animation/spinner'

interface PrivateRouteProps extends RouteProps {
	Component: React.FC<any>
}

export const PrivateRoute = ({ Component, ...rest }: PrivateRouteProps) => {
	const {
		auth,
		db: { faculty, package_info },
		initialized
	} = useSelector((state: RootReducerState) => state)

	useEffect(() => {
		window.scroll(0, 0)
	}, [location.pathname])

	if (true) {
		return (
			<div className="flex justify-center">
				<span className="inline-block align-middle h-screen" aria-hidden="true">
					&#8203;
				</span>
				<div className="flex flex-col items-center justify-center space-y-4">
					<Spinner className="w-10 h-10" />
					<div className="animate-pulse">Loading Database</div>
				</div>
			</div>
		)
	}

	// const { paid, trial_period, date } = package_info

	// const daysPassedSinceTrial = moment().diff(moment(date), 'days')

	// if (date !== -1 && !paid && daysPassedSinceTrial > trial_period + 1) {
	// 	return <Redirect to="/verify-code" />
	// }

	// // TODO: remove this logic
	// // add more robust way of redirection

	// if (token) {

	// 	if (name && location.pathname === "/reset-password") {
	// 		return <Redirect to="/home" />
	// 	}

	// 	if (location.pathname === "/reset-password") {
	// 		return <Route {...rest} render={(props) => {
	// 			trackRoute(location.pathname)
	// 			return <Component {...props} />
	// 		}} />
	// 	}

	// 	if (name) {
	// 		if (faculty[faculty_id] === undefined) {

	// 			// unset the faculty_id and the name
	// 			// hack: just call existing logout function
	// 			logout()
	// 			// redirect to the login page
	// 			return <Redirect to="/staff-login" />
	// 		}

	// 		return <Route {...rest} render={(props) => {
	// 			trackRoute(window.location.pathname)
	// 			return (<Component {...props} />)
	// 		}} />
	// 	}

	// }

	// return <Route {...rest} render={(props) => {
	// 	trackRoute(window.location.pathname)
	// 	return (<Component {...props} />)
	// }} />

	return (
		<Route
			{...rest}
			render={props =>
				true ? (
					<Component {...props} />
				) : (
					<Redirect to={{ pathname: '/', state: { from: props.location } }} />
				)
			}
		/>
	)
}
