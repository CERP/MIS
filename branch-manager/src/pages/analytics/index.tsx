import { AppLayout } from 'components/layout'
import React from 'react'

import { StudentAttendanceAnalytics } from './student'
import { TeacherAttendanceAnalytics } from './teacher'

const Analytics = () => {
	return (
		<AppLayout>
			<div className="md:w-9/12 md:block">
				<TeacherAttendanceAnalytics />
				<StudentAttendanceAnalytics />
			</div>
		</AppLayout>
	)
}

export { Analytics }