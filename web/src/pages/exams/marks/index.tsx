import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { Link } from 'react-router-dom'
import { TrashIcon } from '@heroicons/react/outline'

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
			<div className="p-5 md:p-10 md:pt-5 md:pb-0 text-gray-700 relative">
				<div className="flex flex-row items-center w-full space-x-8 md:space-x-16 justify-center">
					<div className="flex flex-row items-center space-x-2">
						<label htmlFor="sectionId">Class-Section</label>
						<select id="sectionId" className="tw-select" name="sectionId">
							<option>Select</option>
						</select>
					</div>
					<div className="flex flex-row items-center space-x-2">
						<label htmlFor="examYear">Exam Year</label>
						<select id="examYear" className="tw-select" name="examYear">
							<option>Select</option>
						</select>
					</div>
				</div>
				<div className="my-4">
					<p className="text-center">
						Displaying all exams for{' '}
						<span className="text-teal-brand font-semibold">Class 5A</span>
					</p>
				</div>
				<div className="space-y-2">
					<ExamTermCard />
					<ExamTermCard />
					<ExamTermCard />
				</div>
			</div>
		</AppLayout>
	)
}

type ExamTermCardProps = {
	title: string
	year: string
	section: AugmentedSection
}

const ExamTermCard = () => (
	<div className="w-full md:w-4/5 mx-auto bg-white border border-gray-100 shadow-md rounded-md px-4 py-2 md:p-4">
		<div className="flex flex-row justify-between">
			<div className="flex flex-col space-y-1">
				<p className="font-semibold">1st Term</p>
				<p className="text-sm text-gray-400">09-11-2021 to 17-11-2021</p>
			</div>
			<div className="flex flex-row items-center space-x-2">
				<Link to="/exam">
					<button className="tw-btn bg-teal-brand text-white">View Marks</button>
				</Link>
				<button className="text-white bg-red-brand rounded-full w-10 h-10 text-center">
					<TrashIcon className="w-5 h-5 mx-auto" />
				</button>
			</div>
		</div>
	</div>
)
