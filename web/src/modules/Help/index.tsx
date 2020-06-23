import React, { useState, useEffect } from 'react'
import Layout from 'components/Layout'
import { connect } from 'react-redux'
import { smsIntentLink } from 'utils/intent'
import { logSms } from 'actions'
import { sendSMS } from 'actions/core'
import { History } from 'history'
import siteConfig from 'constants/siteConfig.json'
import HelpTutorial from './tutorial'

import { isMobile } from 'utils/helpers'
import { PhoneIcon } from 'assets/icons'

import './style.css'
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
	const [ilmxUser, setIlmxUser] = useState('')

	useEffect(() => {
		const user = localStorage.getItem('user')
		setIlmxUser(user)
	}, [])

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

	const text = `School Name : ${auth.school_id}\nSchool Address: ${school_address}\nTeacher Name: ${auth.name}\nMessage: ${smsText}`
	const helpLine = ilmxUser ? siteConfig["helpLineIlmx"] : siteConfig["helpLine"]

	return (
		<Layout history={history}>
			<div className="help-page">
				<div className="form" style={{ width: "75%" }}>
					<div className="title">MISchool Help</div>
					<div className="section">
						<div className="">
							<h3>Phone Support</h3>
							<p>For any assistance, Call to speak to a customer service rep</p>
						</div>
						<div className="helpline text-center">
							<a href={`tel:${helpLine.phoneInt}`}>
								<img src={PhoneIcon} alt="phone" />
								{helpLine.phoneAlt}
							</a>
						</div>
						<div className="">
							<h3 style={{ marginTop: 0 }}>Message Support</h3>
							<textarea
								style={{ borderRadius: 4 }}
								onChange={(e) => setSmsText(e.target.value)}
								placeholder="Write your message here..." />
							{
								smsOption === "SIM" && isMobile() ?
									<a href={smsIntentLink({
										messages: [{ number: helpLine.phone, text }],
										return_link: window.location.href
									})} onClick={onSendLogSms} className="button blue">Send using Local SIM</a> :

									<div className="button grey" onClick={() => sendMessage(text, helpLine.phone)}>Can only send using Local SIM</div>
							}
						</div>
					</div>
					{<HelpTutorial type={ilmxUser ? "ILMX" : "MIS"} />}
				</div>
			</div>
		</Layout >
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
