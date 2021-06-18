import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'

export const ExamsMarks = () => {
	// TODO: show filters (class-section, exams year)
	// TODO: show all term exams card
	// TODO: show monthly tests in separate section
	// TODO: delete term exam (this will delete from all exams from students and exams object)

	// Steps:
	// Filter all those exams create in a year
	// Filter all those terms exams that happen
	// Filter all those test types exams and display them separately

	return (
		<AppLayout title="Marks" showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 md:pb-0 text-gray-700 relative"></div>
		</AppLayout>
	)
}
