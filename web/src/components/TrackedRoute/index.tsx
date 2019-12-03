import React, { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { trackRoute } from '../../actions'

type propsType = {
	component: any,	
	school_id: string
	name: string
	token: string
	initialized: boolean
	location: { pathname: string }
	trackRoute: (path: string) => any
}
 
const TrackedRoute = ({ component, school_id, name, token, initialized, location, trackRoute, ...rest }: propsType) => {

	// react's hook
	useEffect(() => {
		window.scroll(0, 0);
		trackRoute(location.pathname)
	})

	if (!initialized) {
		return <div>Loading Database....</div>
	}

	if(token && name) {
		return <Route component={component} {...rest} />
	}
	else if(token) {
		return <Redirect to="/login" />
	}
	else {
		return <Redirect to="/school-login" />
	}
}

export default connect((state: RootReducerState) => ({
	...state.auth, initialized: state.initialized
}),(dispatch: Function) => ({
	trackRoute: (path: string) => dispatch(trackRoute(path))
}))(TrackedRoute);