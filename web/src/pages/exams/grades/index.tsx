import { AppLayout } from 'components/Layout/appLayout'
import React from 'react'

export const GradeSettings = () => {
	return (
		<AppLayout title="Grade Settings" showHeaderTitle>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold text-center">
					Set Grades &amp; Remarks with Percentage
				</div>
			</div>
		</AppLayout>
	)
}
