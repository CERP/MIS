import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import moment from 'moment'
import { createLogout } from 'actions'
import { OnboardingStage } from 'constants/index'
import { DBLoader } from 'components/animation/db-loader'
import { useScrollTop } from 'hooks/useScrollTop'

interface PrivateRouteProps extends RouteProps {
	component: React.FC<any>
}

export const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
	useScrollTop(rest.location.pathname)

	const dispatch = useDispatch()

	const auth = useSelector((state: RootReducerState) => state.auth)
	const faculty = useSelector((state: RootReducerState) => state.db.faculty)
	const onboarding = useSelector((state: RootReducerState) => state.db.onboarding)
	const users = useSelector((state: RootReducerState) => state.db.users)
	const package_info = useSelector((state: RootReducerState) => state.db.package_info)

	const initialized = useSelector((state: RootReducerState) => state.initialized)

	// school logged in and there's no user, start the onboarding process
	// by creating a new user
	if (auth?.token && Object.keys(users ?? {}).length === 0) {
		return <Redirect to="/school/setup" />
	}

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
	if (auth.name && initialized) {
		if (faculty?.[auth.faculty_id] === undefined) {
			// unset the faculty_id and the name
			// hack: just call existing logout function

			dispatch(createLogout())

			return <Redirect to="/staff-login" />
		}
	}

	// Be careful about it
	// todo: make sure every edge-case handled
	if (
		auth?.faculty_id &&
		auth?.token &&
		onboarding?.stage &&
		onboarding?.stage !== OnboardingStage.COMPLETED
	) {
		return <Redirect to="/onboarding" />
	}

	if (!initialized) {
		return <DBLoader />
	}

	return (
		<Route
			{...rest}
			render={props =>
				auth?.faculty_id && auth?.token ? (
					<Component {...props} />
				) : (
					<Redirect to={{ pathname: '/staff-login', state: { from: props.location } }} />
				)
			}
		/>
	)
}
