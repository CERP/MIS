import React, { useState } from 'react'
import { connect } from 'react-redux'
import { smsIntentLink } from 'utils/intent'
import { logSms } from 'actions'
import { sendSMS } from 'actions/core'
import { History } from 'history'
import siteConfig from 'constants/siteConfig.json'
import HelpTutorial from './tutorial'
import { isMobile, getIlmxUser } from 'utils/helpers'
import { AppLayout } from 'components/Layout/appLayout'

import './style.css'
interface P {
	auth: RootReducerState['auth']
	school_address: string
	faculty_id: string
	smsOption: RootDBState['settings']['sendSMSOption']
	history: History
	ilmxUser: string

	sendMessage: (text: string, number: string) => void
	logSms: (sms_history: AugmentedSmsHistory) => void
}

const Help: React.FC<P> = ({
	auth,
	ilmxUser,
	school_address,
	faculty_id,
	smsOption,
	logSms,
	sendMessage,
	history
}) => {
	const [smsText, setSmsText] = useState('')

	const onSendLogSms = () => {
		const sms_history: AugmentedSmsHistory = {
			faculty: faculty_id,
			date: new Date().getTime(),
			type: 'HELP',
			count: 1,
			text: smsText
		}

		logSms(sms_history)
	}

	const text = `School Name : ${auth.school_id}\nSchool Address: ${school_address}\nTeacher Name: ${auth.name}\nMessage: ${smsText}`
	const helpLine = siteConfig['helpLineIlmx']

	return (
		<AppLayout title="Help Centre" showHeaderTitle>
			<div className="help-page p-5 md:p-10 md:pt-5">
				<div className="form">
					<div className="title"></div>
					<div className="section">
						<div className="">
							<h3>Phone Support</h3>
							<p>For any assistance, Call to speak to a customer service rep</p>
						</div>
						<div className="helpline text-center">
							<a href={`tel:${helpLine.phoneInt}`} className="text-gray-900">
								{helpLine.phoneAlt}
							</a>
						</div>
						<div className="">
							<h3 style={{ marginTop: 0 }}>Message Support</h3>
							<textarea
								style={{ borderRadius: 4 }}
								onChange={e => setSmsText(e.target.value)}
								placeholder="Write your message here..."
							/>
							{smsOption === 'SIM' && isMobile() ? (
								<a
									href={smsIntentLink({
										messages: [{ number: helpLine.phone, text }],
										return_link: window.location.href
									})}
									onClick={onSendLogSms}
									className="button blue">
									Send using Local SIM
								</a>
							) : (
								<div
									className="button grey"
									onClick={() => sendMessage(text, helpLine.phone)}>
									Can only send using Local SIM
								</div>
							)}
						</div>
					</div>
					{<HelpTutorial type={ilmxUser ? 'ILMX' : 'MIS'} />}
				</div>
			</div>
		</AppLayout>
	)
}

export default connect(
	(state: RootReducerState) => ({
		auth: state.auth,
		school_address: state.db.settings.schoolAddress,
		faculty_id: state.auth.faculty_id,
		smsOption: state.db.settings.sendSMSOption,
		ilmxUser: getIlmxUser()
	}),
	(dispatch: Function) => ({
		sendMessage: (text: string, number: string) => dispatch(sendSMS(text, number)),
		logSms: (history: AugmentedSmsHistory) => dispatch(logSms(history))
	})
)(Help)
