import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

const AuthRoute = ({ component, ...rest }: any) => {

	const auth = useSelector((state: AppState) => state.auth)

	if (auth.token && auth.id) {

		return <Route component={component} {...rest} />
	}

	return <Redirect to="/login" />
}

export { AuthRoute }