import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { logSms } from 'actions'
import { smsIntentLink } from 'utils/intent'
import { AttendanceSmsModalContent, SmsSendOptions } from 'components/attendance'

interface SmsModalContentWrapperProps {
	students: RootDBState['students']
	date: string
	markedStudents: {
		[id: string]: MISStudent
	}
	smsTemplate: string
	teacherId: string
}

export const SmsModalContentWrapper = ({
	students,
	date,
	markedStudents,
	smsTemplate,
	teacherId
}: SmsModalContentWrapperProps) => {
	const dispatch = useDispatch()

	const [sendTo, setSendTo] = useState<SmsSendOptions>(SmsSendOptions.TO_ALL)

	const messages = Object.entries(markedStudents)
		.reduce((agg, [sid, selected]) => {
			if (!selected) {
				return agg
			}

			const student = students[sid]
			const att = (student.attendance || {})[date]

			if (att === undefined) {
				return agg
			}

			return [
				...agg,
				{
					number: student.Phone,
					text: `Date: ${date.replaceAll('-', '/').split('/').reverse().join('/')}\n
				${smsTemplate
							.replace(/\$FNAME/g, student.ManName)
							.replace(/\$NAME/g, student.Name)
							.replace(/\$STATUS/g, att.status)}`
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
			faculty: teacherId,
			date: new Date().getTime(),
			type: 'ATTENDANCE',
			count: messages.length
		}

		dispatch(logSms(smsLog))
	}

	return (
		<AttendanceSmsModalContent
			smsIntentURL={smsURL}
			state={sendTo}
			setState={setSendTo}
			smsLogCallback={() => sendBatchSMS(messages)}
			msgCount={messages.length}
		/>
	)
}
