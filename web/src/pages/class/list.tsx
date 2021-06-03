import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { toTitleCase } from 'utils/toTitleCase'
import { AppLayout } from 'components/Layout/appLayout'
import { SearchInput } from 'components/input/search'
import { AddStickyButton } from 'components/Button/add-sticky'
import { isValidStudent } from 'utils'

export const ClassList = () => {
	const { classes, students } = useSelector((state: RootReducerState) => state.db)
	const [search, setSearch] = useState('')

	return (
		<AppLayout title="Classes" showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 relative">
				<Link to="classes/new">
					<AddStickyButton label="Create new Class" />
				</Link>

				{/* <div className="text-center font-bold text-2xl my-4">School Classes</div> */}

				<div className="flex flex-col md:flex-row items-center mt-4 mb-12 md:mb-20 space-y-2 md:space-y-0 md:space-x-60">
					<SearchInput
						placeholder="Search by class name"
						className="md:w-4/12"
						onChange={e => setSearch(e.target.value)}
					/>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 gap-y-12 md:gap-y-20">
					{Object.values(classes)
						.filter(
							c =>
								c &&
								c.id &&
								c.name &&
								(search
									? c.name.toLowerCase().includes(search.toLowerCase())
									: true)
						)
						.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
						.map(c => (
							<Link key={c.id} to={`classes/${c.id}/view`}>
								<Card misClass={c} students={students} />
							</Link>
						))}
				</div>
			</div>
		</AppLayout>
	)
}

type CardProps = {
	misClass: MISClass
	students: RootDBState['students']
}

const Card = ({ misClass, students }: CardProps) => {
	const sections = getSectionsFromClasses({ [misClass.id]: misClass })
	const sectionIds = sections.reduce((agg, curr) => [...agg, curr.id], [])

	const totalStudents = Object.values(students ?? {}).filter(
		s => isValidStudent(s) && s.Active && sectionIds.includes(s.section_id)
	).length

	const teachers = sections.reduce((agg, curr) => [...agg, curr.faculty_id], [])
	const totalTeachers = new Set(teachers).size

	return (
		<div className="relative">
			<div className="bg-white rounded-xl text-center border border-gray-200 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-8 truncate w-4/5 mx-auto">
					{toTitleCase(misClass.name)}
				</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900">Sections</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{sections.length}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900">Teachers</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{totalTeachers}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900">Students</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{totalStudents}
						</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-8 md:-top-10 left-0 right-0">
				<div className="bg-white border flex font-semibold w-16 h-16 items-center justify-center md:h-20 md:w-20 mx-auto rounded-full shadow-md">
					{misClass.classYear}
				</div>
			</div>
		</div>
	)
}
