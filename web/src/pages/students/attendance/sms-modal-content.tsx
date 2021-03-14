import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'

import { logSms } from 'actions'
import { smsIntentLink } from 'utils/intent'

interface SmsModalContentProps {
	students: RootDBState['students']
	date: string
	markedStudents: {
		[id: string]: boolean
	}
	smsTemplate: string
	teacherId: string
}

enum SendingOptions {
	TO_ABSENT,
	TO_ALL,
	TO_LEAVE,
	TO_PRESENT
}

export const SmsModalContent = ({
	students,
	date,
	markedStudents,
	smsTemplate,
	teacherId
}: SmsModalContentProps) => {
	const dispatch = useDispatch()

	const [sendTo, setSendTo] = useState<SendingOptions>(SendingOptions.TO_ALL)

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
			if (sendTo === SendingOptions.TO_ALL) {
				return true
			}

			if (sendTo === SendingOptions.TO_PRESENT) {
				return msg.text.toLowerCase().includes('present')
			}

			if (sendTo === SendingOptions.TO_ABSENT) {
				return msg.text.toLowerCase().includes('absent')
			}

			if (sendTo === SendingOptions.TO_LEAVE) {
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
		<>
			<h1 className="text-center">Select options to send SMS</h1>
			<div>Send to:</div>
			<div className="flex items-center">
				<input
					className="form-checkbox mr-2"
					name="toAbsent"
					type="checkbox"
					onChange={() => setSendTo(SendingOptions.TO_ABSENT)}
					checked={sendTo === SendingOptions.TO_ABSENT}
				/>
				<label className="text-xs text-gray-700">Absent Students</label>
			</div>
			<div className="flex items-center">
				<input
					className="form-checkbox mr-2"
					name="toPresent"
					type="checkbox"
					onChange={() => setSendTo(SendingOptions.TO_PRESENT)}
					checked={sendTo === SendingOptions.TO_PRESENT}
				/>
				<label className="text-xs text-gray-700">Present Students</label>
			</div>
			<div className="flex items-center">
				<input
					className="form-checkbox mr-2"
					name="toLeave"
					type="checkbox"
					onChange={() => setSendTo(SendingOptions.TO_LEAVE)}
					checked={sendTo === SendingOptions.TO_LEAVE}
				/>
				<label className="text-xs text-gray-700">Leave Students</label>
			</div>
			<div className="flex items-center">
				<input
					className="form-checkbox mr-2"
					name="toAll"
					type="checkbox"
					onChange={() => setSendTo(SendingOptions.TO_ALL)}
					checked={sendTo === SendingOptions.TO_ALL}
				/>
				<label className="text-xs text-gray-700">All Students</label>
			</div>
			<div
				className={clsx('flex flex-row justify-center', {
					'pointer-events-none': messages.length === 0
				})}>
				<a
					href={smsURL}
					onClick={() => sendBatchSMS(messages)}
					className="tw-btn-blue mt-2">
					Send using Local SIM
				</a>
			</div>
		</>
	)
}
