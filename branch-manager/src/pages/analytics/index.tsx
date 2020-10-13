import { AppLayout } from 'components/layout'
import React from 'react'

import { StudentAttendanceAnalytics } from './student'
import { TeacherAttendanceAnalytics } from './teacher'

const Analytics = () => {
	return (
		<AppLayout>
			<StudentAttendanceAnalytics />
			<TeacherAttendanceAnalytics />
		</AppLayout>
	)
}

export { Analytics }