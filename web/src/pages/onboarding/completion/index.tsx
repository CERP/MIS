import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import iconMarkDone from 'assets/svgs/mark-done.svg'

export const OnboardingCompletion = () => {
	const { faculty, classes, students } = useSelector((state: RootReducerState) => state.db)

	const lastCreatedSection = useMemo(() => {
		const sections = getSectionsFromClasses(classes)
		return sections?.[0]
	}, [classes])

	const sectionTeacher = useMemo(() => {
		return Object.values(faculty).find(f => f?.id === lastCreatedSection?.faculty_id)
	}, [lastCreatedSection, faculty])

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center rounded-2xl my-4 md:mt-8">
			<div className="w-4/5 md:w-2/5 mb-6 space-y-8">
				<div className="font-semibold text-2xl text-center text-teal-brand">
					Congratulations!
				</div>
				<img
					className="w-40 md:w-60 h-40 md:h-60 mx-auto"
					src={iconMarkDone}
					alt="mark-done"
				/>
				<div className="text-center space-y-4">
					<div className="text-lg font-semibold">
						Class {lastCreatedSection?.namespaced_name || 'Not Created'}
						<span> created</span>
					</div>
					<div className="text-lg font-semibold">
						Class Teacher: {sectionTeacher?.Name || 'Not Available'}
					</div>
					<div className="text-lg font-semibold">
						Total Students: {Object.keys(students).length}
					</div>
				</div>
				<div>
					{/* <button className="w-full tw-btn bg-orange-brand text-white font-semibold mb-4">Add More Classes</button> */}
					<Link to="/home">
						<button className="w-full tw-btn-blue py-3 font-semibold">
							Go to Home
						</button>
					</Link>
				</div>
			</div>
		</div>
	)
}
