import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { Spinner } from 'components/animation/spinner'
import { OnboardingStage } from 'constants/index'

interface PrivateRouteProps extends RouteProps {
	Component: React.FC<any>
}

export const PublicRoute = ({ Component, ...rest }: PrivateRouteProps) => {
	const dispatch = useDispatch()

	// make sure as the location changes, emit an
	// effect to scroll to top
	useEffect(() => {
		window.scroll(0, 0)
	}, [rest.location.pathname])

	const {
		auth,
		db: { onboarding, users },
		initialized
	} = useSelector((state: RootReducerState) => state)

	// here handling two cases:
	// - user logged in and onboarding state is completed (new schools), redirect to home page
	// - user logged in and there's no onboarding state (old schools), redirect to home page
	if (
		auth?.faculty_id &&
		auth?.token &&
		(onboarding?.stage ? onboarding?.stage === OnboardingStage.COMPLETED : true)
	) {
		return <Redirect to="/home" />
	}

	// user logged in and there's onboarding state
	// onboarding component will handle further
	// desired state component renders
	if (auth?.faculty_id && auth?.token && onboarding?.stage) {
		return <Redirect to="/school/onboarding" />
	}

	// school logged in and there's no user, start the onboarding process
	// by creating a new user
	if (auth?.token && Object.keys(users || {}).length === 0) {
		return <Redirect to="/school/setup" />
	}

	if (auth?.token) {
		return <Redirect to="/staff-login" />
	}

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
					<Redirect to={{ pathname: '/home', state: { from: props.location } }} />
				) : (
					<Component {...props} />
				)
			}
		/>
	)
}
