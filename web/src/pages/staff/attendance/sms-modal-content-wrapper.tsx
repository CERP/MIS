import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'

import { AttendanceSmsModalContent, SmsSendOptions } from 'components/attendance'

export const SmsModalContentWrapper = () => {
	const dispatch = useDispatch()

	const [sendTo, setSendTo] = useState<SmsSendOptions>(SmsSendOptions.TO_ALL)

	return (
		<AttendanceSmsModalContent
			setState={setSendTo}
			state={sendTo}
			smsIntentURL={''}
			smsLogCallback={() => toast.error('Frontend not wiredup for staff attendance')}
			msgCount={0}
		/>
	)
}
