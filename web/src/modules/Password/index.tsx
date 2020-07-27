import React, { useState, useMemo } from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

import Layout from 'components/Layout'
import SiteConfig from 'constants/siteConfig.json'
import { getIlmxUser } from 'utils/helpers'

import './style.css'

type PropsType = {
	faculty: RootDBState["faculty"]
	history: History
	ilmxUser: string
} & RootReducerState

const AdminResetPassword: React.FC<PropsType> = ({ history, faculty, ilmxUser, initialized, auth }) => {

	const helpline = ilmxUser ? SiteConfig["helpLineIlmx"] : SiteConfig["helpLine"]

	const adminFaculty = useMemo(
		() => getAdminFaculty(faculty),
		[faculty]
	)

	const [error, setError] = useState("")
	const [adminId, setAdminId] = useState("")
	const [phoneNumber, setPhoneNumber] = useState("")

	const handleClickSendCode = () => {

		if (adminId.length === 0) {
			setError("Please select admin first")
			return
		}

		if (phoneNumber.length === 0) {
			setError("Please enter phone number")
			return
		}

		const selected_faculty = faculty[adminId]

		if (selected_faculty.Phone !== phoneNumber) {
			setError("Provided number doesn't match with admin account")
			return
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		// check 'enter' key pressed
		if (e.keyCode === 13) {
			handleClickSendCode()
		}
	}

	return (<>
		{
			!(initialized && auth.school_id) && <Redirect to="/school-login" />
		}
		<Layout history={history}>
			<div className="reset-password">
				<div className="title">Reset Admin Password</div>
				<div className="section-container section">
					{
						adminFaculty.length === 0 ?
							<p className="error text-center" style={{ fontSize: "1rem" }}>
								There's no Admin exists with the Phone Number,
								<span> <a href={`tel:${helpline.phoneInt}`} title={helpline.phone}>Please contact helpline!</a></span>
							</p>
							:
							<>
								<div className="box-title">Send Reset Code</div>
								<div className="box">
									<div style={{ marginTop: "1rem", marginBottom: "0.25rem" }}>Please select admin and enter phone number to send reset code</div>
									<select onChange={(e) => setAdminId(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }}>
										<option value="">Select Admin</option>
										{
											adminFaculty
												.map(f => <option key={f.id} value={f.id}>{f.Name}</option>)
										}
									</select>
									<div className="">
										<input type="text"
											placeholder="Mobile number"
											onBlur={(e) => setPhoneNumber(e.target.value)}
											onKeyDown={handleKeyDown} />
									</div>
									<div className="row">
										<div className="button blue" onClick={handleClickSendCode} style={{ marginLeft: "auto" }}>Send Code</div>
										<Link
											to="/login"
											className="button grey"
											style={{ marginLeft: "0.175rem" }}>Cancel</Link>
									</div>
									{error && <p className="error">{error}, <span><a href={`tel:${helpline.phoneInt}`} title={helpline.phone}>OR Contact Helpline!</a></span></p>}
								</div>
							</>
					}
				</div>
			</div>
		</Layout>

	</>)
}

export default connect((state: RootReducerState) => ({
	auth: state.auth,
	faculty: state.db.faculty,
	initialized: state.initialized,
	connected: state.connected,
	ilmxUser: getIlmxUser()
}), (dispatch: Function) => ({

}))(AdminResetPassword)

const getAdminFaculty = (faculty: PropsType["faculty"]) => {
	return Object.values(faculty)
		.filter(f => {
			return f && f.Active && f.Admin
				&& (f.HasLogin ? f.HasLogin : true)
				&& f.Phone
		})
}