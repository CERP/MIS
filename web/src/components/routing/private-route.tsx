import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import moment from 'moment'
import { createLogout } from 'actions'
import { OnboardingStage } from 'constants/index'
import { Spinner } from 'components/animation/spinner'

interface PrivateRouteProps extends RouteProps {
	Component: React.FC<any>
}

export const PrivateRoute = ({ Component, ...rest }: PrivateRouteProps) => {
	const dispatch = useDispatch()

	// make sure as the location changes, emit an
	// effect to scroll to top
	useEffect(() => {
		window.scroll(0, 0)
	}, [rest.location.pathname])

	const {
		auth,
		db: { faculty, package_info, onboarding, users },
		initialized
	} = useSelector((state: RootReducerState) => state)

	// school logged in and there's no user, start the onboarding process
	// by creating a new user
	if (auth?.token && Object.keys(users || {}).length === 0) {
		return <Redirect to="/school/setup" />
	}

	// TODO: handle handle permission redirection for faculties
	// TODO: handle loading database after login success

	const { paid, trial_period, date } = package_info

	const daysPassedSinceTrial = moment().diff(moment(date), 'days')

	// I'm not sure why would be date === -1 ?
	// Redirect to verify activation code component if trial_period more
	// than one day before
	if (date !== -1 && !paid && daysPassedSinceTrial > trial_period + 1) {
		return <Redirect to="/verify-code" />
	}

	// this check is to make sure to dispatch a logout action
	// if faculty is deleted from another device, which is logged in
	// currently in mischool.
	if (auth.name) {
		if (faculty[auth.faculty_id] === undefined) {
			// unset the faculty_id and the name
			// hack: just call existing logout function

			dispatch(createLogout())

			// redirect to the login page
			return <Redirect to="/staff-login" />
		}
	}

	// if (!connected) {
	// 	return (
	// 		<div className="flex justify-center">
	// 			<span className="inline-block align-middle h-screen" aria-hidden="true">
	// 				&#8203;
	// 			</span>
	// 			<div className="flex flex-col items-center justify-center space-y-4">
	// 				<div className="animate-pulse">Connecting, Please wait...</div>
	// 			</div>
	// 		</div>
	// 	)
	// }

	// TODO: need to do more validation about this, so that
	// for school login, it won't return
	if (!initialized) {
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

	return (
		<Route
			{...rest}
			render={props =>
				auth?.faculty_id &&
					auth?.token &&
					(onboarding?.stage ? onboarding?.stage === OnboardingStage.COMPLETED : true) ? (
					<Component {...props} />
				) : (
					<Redirect to={{ pathname: '/', state: { from: props.location } }} />
				)
			}
		/>
	)
}
