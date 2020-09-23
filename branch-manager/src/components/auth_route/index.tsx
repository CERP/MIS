import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({ component, auth: { id, token }, ...rest }: any) => {

    if (token && id) {

        return <Route component={component} {...rest} />
    }

    return <Redirect to="/login" />
}

const AuthRoute = connect((state: any) => ({
    auth: state.authentication.auth
}))(PrivateRoute)

export { AuthRoute }