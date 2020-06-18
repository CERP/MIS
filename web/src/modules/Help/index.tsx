import React, { useState } from 'react'
import Layout from 'components/Layout'
import { connect } from 'react-redux'
import { smsIntentLink } from 'utils/intent'
import { logSms } from 'actions'
import { sendSMS } from 'actions/core'
import { History } from 'history'

interface P {
	auth: RootReducerState["auth"]
	school_address: string
	faculty_id: string
	smsOption: RootDBState["settings"]["sendSMSOption"]
	history: History
	sendMessage: (text: string, number: string) => void
	logSms: (sms_history: AugmentedSmsHistory) => void
}

const Help: React.FC<P> = ({ auth, school_address, faculty_id, smsOption, logSms, sendMessage, history }) => {

	const [smsText, setSmsText] = useState('')

	const onSendLogSms = () => {
		const sms_history: AugmentedSmsHistory = {
			faculty: faculty_id,
			date: new Date().getTime(),
			type: "HELP",
			count: 1,
			text: smsText
		}

		logSms(sms_history)
	}


	const number = "03481112004"
	const text = `School Name : ${auth.school_id}\nSchool Address: ${school_address}\nTeacher Name: ${auth.name}\nMessage: ${smsText}`

	return (
		<Layout history={history}>
			<div className="help-page">
				<div className="form" style={{ width: "75%" }}>
					<div className="title">Help</div>
					<div className="section">
						<div style={{ width: "inherit" }}>
							<h3>If you need any assistance, please call our customer representative or message us using the box below</h3>
						</div>

						<div style={{ marginTop: "30px" }}>
							<div>Customer Representative - <a href="tel:+923481112004">0348-111-2004</a></div>
						</div>
					</div>
					<div className="divider">Ask Us</div>
					<div className="section">

						<div className="row">
							<label>Message</label>
							<textarea onChange={(e) => setSmsText(e.target.value)} placeholder="Write message here" />
						</div>
						<div>
							{
								smsOption === "SIM" ?
									<a href={smsIntentLink({
										messages: [{ number, text }],
										return_link: window.location.href
									})} onClick={onSendLogSms} className="button blue">Send using Local SIM</a> :

									<div className="button" onClick={() => sendMessage(text, number)}>Can only send using Local SIM</div>
							}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default connect((state: RootReducerState) => ({
	auth: state.auth,
	school_address: state.db.settings.schoolAddress,
	faculty_id: state.auth.faculty_id,
	smsOption: state.db.settings.sendSMSOption
}), (dispatch: Function) => ({
	sendMessage: (text: string, number: string) => dispatch(sendSMS(text, number)),
	logSms: (history: AugmentedSmsHistory) => dispatch(logSms(history))
}))(Help)
