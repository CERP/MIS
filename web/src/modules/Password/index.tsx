import React, { useState, useMemo, useEffect } from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { sendTempPassword } from 'actions/index'

import Layout from 'components/Layout'
import SiteConfig from 'constants/siteConfig.json'
import { getIlmxUser } from 'utils/helpers'
import { hash } from 'utils'

import './style.css'

type PropsType = {
	faculty: RootDBState["faculty"]
	history: History
	ilmxUser: string
	sendTempPassword: (faculty: MISTeacher, temp_pass: string) => void

} & RootReducerState

const AdminResetPassword: React.FC<PropsType> = ({ history, faculty, ilmxUser, initialized, connected, auth, sendTempPassword }) => {

	const helpline = ilmxUser ? SiteConfig["helpLineIlmx"] : SiteConfig["helpLine"]

	const adminFaculty = useMemo(
		() => getAdminFaculty(faculty),
		[faculty]
	)

	const [error, setError] = useState("")
	const [admin, setAdmin] = useState<MISTeacher>(undefined)
	const [adminId, setAdminId] = useState("")
	const [phoneNumber, setPhoneNumber] = useState("")
	const [verifyPasswordSent, setVerifyPasswordSent] = useState(false)

	useEffect(() => {

		if (adminId) {
			const verify = JSON.stringify(admin) === JSON.stringify(faculty[adminId])
			setVerifyPasswordSent(!verify)
		}

	}, [faculty, adminId, admin])

	const handleSelectionChange = (id: string) => {
		setAdminId(id)
		setAdmin(faculty[id])
	}

	const handleClickSendPassword = () => {

		if (!connected) {
			setError("Please check your internet connect, or try again!")
			return
		}

		if (adminId.length === 0) {
			setError("Please select admin first")
			return
		}

		if (phoneNumber.length === 0) {
			setError("Please enter phone number")
			return
		}

		const selected_teacher = faculty[adminId]

		if (selected_teacher.Phone !== phoneNumber) {
			setError("Provided number doesn't match with admin account")
			return
		}

		const rand_password = Math.floor(100000 + Math.random() * 900000).toString()

		hash(rand_password).then(hashed_pass => {
			const teacher = {
				...selected_teacher,
				Password: hashed_pass
			}

			sendTempPassword(teacher, rand_password)
		})

	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		// check 'enter' key pressed
		if (e.keyCode === 13) {
			handleClickSendPassword()
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
								{
									verifyPasswordSent ? <ShowPasswordSent />
										:
										<>
											<div className="box-title">Send Temporary Password</div>
											<div className="box">
												<div style={{ marginTop: "1rem", marginBottom: "0.25rem" }}>Please select admin and enter phone number to send password</div>
												<select onChange={(e) => handleSelectionChange(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }}>
													<option value="">Select Admin</option>
													{
														adminFaculty
															.sort((a, b) => a.Name.localeCompare(b.Name))
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
													<div className="button blue" onClick={handleClickSendPassword} style={{ marginLeft: "auto" }}>Send</div>
													<Link
														to="/login"
														className="button grey"
														style={{ marginLeft: "0.175rem" }}>Cancel</Link>
												</div>
												{error && <p className="error">{error}, <span><a href={`tel:${helpline.phoneInt}`} title={helpline.phone}>OR Contact Helpline!</a></span></p>}
											</div>
										</>
								}
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
	sendTempPassword: (faculty: MISTeacher, temp_pass: string) => dispatch(sendTempPassword(faculty, temp_pass))
}))(AdminResetPassword)

const getAdminFaculty = (faculty: PropsType["faculty"]) => {
	return Object.values(faculty)
		.filter(f => {
			return f && f.Active && f.Admin
				&& (f.HasLogin ? f.HasLogin : true)
				&& f.Phone
		})
}

const ShowPasswordSent = () => {
	return (
		<div className="text-center">
			<p>A temporary password has been sent to your mobile</p>
			<Link
				to="/login"
				className="button blue"
				style={{ marginLeft: "0.175rem" }}>Back to Login</Link>
		</div>
	)
}