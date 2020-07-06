import React from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import Layout from 'components/Layout'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

import './style.css'

type PropsType = {
	faculty: RootDBState["faculty"]
	history: History
} & RootReducerState

const ResetPassword: React.FC<PropsType> = (props) => {

	return (<>
		{
			!(props.initialized && props.auth.school_id) && <Redirect to="/school-login" />
		}
		<Layout history={props.history}>
			<div className="reset-password">
				<div className="title">Reset Password</div>
				<div className="section-container section">
					<div className="box-title">Enter Your Phone</div>
					<div className="box">
						<div style={{ marginTop: "1rem", marginBottom: "0.25rem" }}>Please enter phone number to send reset code for your account</div>
						<div className="">
							<input type="text" placeholder="Mobile number" />
						</div>
						<div className="row">
							<div className="button blue" style={{ marginLeft: "auto" }}>Send Code</div>
							<Link
								to="/login"
								className="button grey"
								style={{ marginLeft: "0.175rem" }}>Cancel</Link>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	</>)
}

export default connect((state: RootReducerState) => ({
	auth: state.auth,
	faculty: state.db.faculty,
	initialized: state.initialized,
	users: state.db.users,
	connected: state.connected,
}), (dispatch: Function) => ({

}))(ResetPassword)