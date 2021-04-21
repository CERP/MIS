import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { toTitleCase } from 'utils/toTitleCase'
import { AppLayout } from 'components/Layout/appLayout'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { SearchInput } from 'components/input/search'

export const ClassList = () => {
	const { classes, students } = useSelector((state: RootReducerState) => state.db)
	const [search, setSearch] = useState('')

	// TODO: add search options and filter
	// TODO: add options to class card

	return (
		<AppLayout title="Classes">
			<div className="p-5 md:p-10 relative mb-20">
				<Link to="classes/new">
					<div className="flex items-center justify-between fixed z-50 bottom-4 right-4 rounded-full bg-teal-brand text-white lg:hidden py-3 px-6 w-11/12 text-lg mr-0.5">
						<div>Add new Class</div>
						<div className="text-xl">+</div>
					</div>
				</Link>

				<div className="text-center font-bold text-2xl my-4">School Classes</div>
				<div className="text-gray-700 text-center">
					Total = {Object.keys(classes).length}
				</div>

				<div className="flex flex-col md:flex-row items-center justify-between mt-4 mb-12 md:mb-20 space-y-2 md:space-y-0 md:space-x-60">
					<SearchInput onChange={e => setSearch(e.target.value)} />
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

	const totalStudents = Object.values(students || {}).filter(
		s => s && s.id && s.Name && s.Active && sectionIds.includes(s.section_id)
	).length

	const totalTeachers = sections.reduce((agg, curr) => [...agg, curr.faculty_id], []).length

	return (
		<div className="relative">
			<div className="bg-white rounded-xl text-center border border-gray-200 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-8 truncate w-4/5 mx-auto">
					{toTitleCase(misClass.name)}
				</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Teachers</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{totalTeachers}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Students</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{totalStudents}
						</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-8 md:-top-12 left-0 right-0">
				<div className="bg-white border flex font-semibold h-16 items-center justify-center md:h-24 md:w-24 mx-auto rounded-full shadow-md w-16">
					{misClass.classYear}
				</div>
			</div>
		</div>
	)
}
