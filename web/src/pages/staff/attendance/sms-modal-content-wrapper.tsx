import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { logSms } from 'actions'
import { smsIntentLink } from 'utils/intent'
import { toTitleCase } from 'utils/toTitleCase'
import { AttendanceSmsModalContent, SmsSendOptions } from 'components/attendance'

interface SmsModalContentWrapperProps {
	faculty: RootDBState['faculty']
	date: string
	smsTemplate: string
	loggedUserId: string
}

export const SmsModalContentWrapper = ({
	faculty,
	date,
	smsTemplate,
	loggedUserId
}: SmsModalContentWrapperProps) => {
	const dispatch = useDispatch()
	const [sendTo, setSendTo] = useState<SmsSendOptions>(SmsSendOptions.TO_ALL)

	const messages = Object.entries(faculty)
		.reduce((agg, [sid, member]) => {
			if (!member && !member.Phone && !member.Active) {
				return agg
			}

			const staffMember = faculty[sid]
			const attendance = (staffMember.attendance ?? {})[date]

			if (attendance === undefined) {
				return agg
			}

			// We're sure that if object has more than 1 entries, it will be either 'check_in' or 'checkout'
			// so status of the attendance will be 'PRESENT' as 'check_in' exist
			// Other take zero index only status and format it

			const statuses = Object.keys(attendance)
			const currDateStatus = statuses.length > 1 ? 'PRESENT' : toTitleCase(statuses[0], '_')

			return [
				...agg,
				{
					number: staffMember.Phone,
					text: `Date: ${date.replaceAll('-', '/').split('/').reverse().join('/')}\n
			${smsTemplate.replace(/\$NAME/g, staffMember.Name).replace(/\$STATUS/g, currDateStatus)}`
				}
			]
		}, [] as Array<{ number: string; text: string }>)
		.filter(msg => {
			if (sendTo === SmsSendOptions.TO_ALL) {
				return true
			}

			if (sendTo === SmsSendOptions.TO_PRESENT) {
				return msg.text.toLowerCase().includes('present')
			}

			if (sendTo === SmsSendOptions.TO_ABSENT) {
				return msg.text.toLowerCase().includes('absent')
			}

			if (sendTo === SmsSendOptions.TO_LEAVE) {
				return msg.text.toLowerCase().includes('leave')
			}

			return false
		})

	const smsURL = smsIntentLink({
		messages,
		return_link: window.location.href
	})

	const sendBatchSMS = (messages: MISSms[]) => {
		if (messages.length === 0) {
			return
		}

		const smsLog: MISSMSHistory & { faculty: string } = {
			faculty: loggedUserId,
			date: new Date().getTime(),
			type: 'STAFF-ATTENDANCE',
			count: messages.length
		}

		dispatch(logSms(smsLog))
	}

	return (
		<AttendanceSmsModalContent
			setState={setSendTo}
			state={sendTo}
			smsIntentURL={smsURL}
			smsLogCallback={() => sendBatchSMS(messages)}
			msgCount={messages.length}
		/>
	)
}
