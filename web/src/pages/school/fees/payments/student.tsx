import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { toTitleCase } from 'utils/toTitleCase'
import { isValidStudent } from 'utils'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import UserIconSvg from 'assets/svgs/user.svg'
import { SearchInput } from 'components/input/search'

export const StudentPayments = () => {
	const { students, classes } = useSelector((state: RootReducerState) => state.db)

	const [search, setSearch] = useState('')

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes)
	}, [classes])

	return (
		<AppLayout title="Student Payments">
			<div className="p-5 md:p-10 relative mb-20">
				<div className="text-center font-bold text-2xl my-4">Student Payments</div>
				<div className="mt-4 mb-12 md:mb-20 space-y-4 md:space-x-60">
					<SearchInput onChange={e => setSearch(e.target.value)} />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-12 gap-y-12 md:gap-y-20">
					{Object.values(students)
						.filter(
							s =>
								isValidStudent(s) &&
								s.Active &&
								!s.FamilyID && // we have separate page for family students, so don't show them here
								(search ? s.Name.includes(search) : true)
						)
						.sort((a, b) => a.Name.localeCompare(b.Name))
						.map(f => (
							<Link key={f.id} to={`/students/${f.id}/payments`}>
								<Card student={f} sections={sections} />
							</Link>
						))}
				</div>
			</div>
		</AppLayout>
	)
}

type CardProps = {
	student: MISStudent
	sections: AugmentedSection[]
}

const Card = ({ student, sections }: CardProps) => {
	const studentSection = sections.find(s => s.id === student.section_id)

	return (
		<div className="relative">
			<div className="bg-white rounded-xl text-center border border-gray-50 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-8 truncate w-4/5 mx-auto">
					{toTitleCase(student.Name)}
				</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Father</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg truncate">
							{toTitleCase(student.ManName)}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Class</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg truncate">
							{toTitleCase(studentSection?.namespaced_name)}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Roll #</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{student.RollNumber}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Phone</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{student.Phone}
						</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-10 left-0 right-0">
				<img
					src={
						student.ProfilePicture?.url ||
						student.ProfilePicture?.image_string ||
						UserIconSvg
					}
					className="mx-auto h-20 w-20  rounded-full shadow-md bg-gray-500 hover:bg-gray-700"
					alt={student.Name.split(' ')[0] || 'student'}
				/>
			</div>
		</div>
	)
}
