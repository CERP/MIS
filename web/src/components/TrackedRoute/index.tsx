import React, { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

import { trackRoute, createLogout } from '../../actions'

type propsType = {
	component: any
	school_id: string
	name: string
	token: string
	initialized: boolean
	faculty_id: string

	faculty: RootDBState['faculty']
	location: { pathname: string }
	trackRoute: (path: string) => void
	logout: () => void
	package_info: MISPackage
}

const TrackedRoute = ({
	component,
	name,
	faculty_id,
	token,
	initialized,
	location,
	trackRoute,
	faculty,
	logout,
	package_info,
	...rest
}: propsType) => {


	const Component = component

	useEffect(() => {
		window.scroll(0, 0)
	}, [location.pathname])

	if (!initialized) {
		return <div>Loading Database....</div>
	}

	const { paid, trial_period, date } = package_info

	const daysPassedSinceTrial = moment().diff(moment(date), "days")

	if (date !== -1 && !paid && daysPassedSinceTrial > trial_period + 1) {

		return <Redirect to="/verify-code" />
	}

	// TODO: remove this logic
	// add more robust way of redirection

	if (token) {

		if (name && location.pathname === "/reset-password") {
			return <Redirect to="/home" />
		}

		if (location.pathname === "/reset-password") {
			return <Route {...rest} render={(props) => {
				trackRoute(location.pathname)
				return <Component {...props} />
			}} />
		}

		if (name) {
			if (faculty[faculty_id] === undefined) {

				// unset the faculty_id and the name
				// hack: just call existing logout function
				logout()
				// redirect to the login page
				return <Redirect to="/staff-login" />
			}

			return <Route {...rest} render={(props) => {
				trackRoute(window.location.pathname)
				return (<Component {...props} />)
			}} />
		}

	}

	return <Route {...rest} render={(props) => {
		trackRoute(window.location.pathname)
		return (<Component {...props} />)
	}} />

}

export default connect((state: RootReducerState) => ({
	...state.auth,
	initialized: state.initialized,
	faculty: state.db.faculty,
	package_info: state.db.package_info || { date: -1, trial_period: 15, paid: false }, //If package info is undefined
}), (dispatch: Function) => ({
	trackRoute: (path: string) => dispatch(trackRoute(path)),
	logout: () => dispatch(createLogout())
}))(TrackedRoute);