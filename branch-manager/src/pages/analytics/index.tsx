import { AppLayout } from 'components/layout'
import React from 'react'

import { StudentAttendanceAnalytics } from './student'

const Analytics = () => {
	return (
		<AppLayout>
			<StudentAttendanceAnalytics />
		</AppLayout>
	)
}

export { Analytics }