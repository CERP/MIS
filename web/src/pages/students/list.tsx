import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { toTitleCase } from 'utils/toTitleCase'
import { isValidStudent } from 'utils'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import UserIconSvg from 'assets/svgs/user.svg'
import { SearchInput } from 'components/input/search'

type Filter = {
	search: string
	active: boolean
}

export const StudentList = () => {
	const { students, classes } = useSelector((state: RootReducerState) => state.db)

	// TODO: create single state variable
	const [search, setSearch] = useState('')
	const [filter, setFilter] = useState<Filter>({
		active: true,
		search: ''
	})

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes)
	}, [classes])

	// TODO: add search options and filters
	// TODO: add print button
	// TODO: add options to cards
	// TODO: add pagination
	// TODO: add a check here for max_limit: state.db.max_limit
	// to restrict adding students

	return (
		<AppLayout title="Students">
			<div className="p-5 md:p-10 relative mb-20">
				<Link to="/students/add-selection">
					<div className="flex items-center justify-between fixed z-50 bottom-4 right-4 rounded-full bg-teal-500 text-white lg:hidden py-3 px-6 w-11/12 text-lg mr-0.5">
						<div>Add new Student</div>
						<div className="text-xl">+</div>
					</div>
				</Link>

				<div className="text-center font-bold text-2xl my-4">School Students</div>
				<div className="text-gray-700 text-center">
					Total ={' '}
					{
						Object.values(students).filter(
							s => isValidStudent(s) && s.Active === filter.active
						).length
					}
				</div>
				<div className="flex flex-col md:flex-row items-center justify-between mt-4 mb-12 md:mb-20 space-y-4 md:space-y-0 md:space-x-60">
					<SearchInput onChange={e => setSearch(e.target.value)} />
					<div className="flex flex-row items-center space-x-2 w-full">
						<select className="tw-select rounded shadow text-green-brand w-full">
							<option>Tag</option>
						</select>
						<select className="tw-select rounded shadow text-green-brand w-full">
							<option>Choose Class</option>
							{sections
								.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
								.map(s => (
									<option key={s.id + s.class_id} value={s.id}>
										{toTitleCase(s.namespaced_name, '-')}
									</option>
								))}
						</select>
						<select
							className="tw-select rounded shadow text-green-brand w-full"
							onChange={e =>
								setFilter({ ...filter, active: e.target.value === 'true' })
							}>
							<option value={'true'}>Active</option>
							<option value={'false'}>InActive</option>
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-12 gap-y-12 md:gap-y-20">
					{Object.values(students)
						.filter(
							s =>
								isValidStudent(s) &&
								s.Active === filter.active &&
								(search ? s.Name.includes(search) : true)
						)
						.sort((a, b) => a.Name.localeCompare(b.Name))
						.map(f => (
							<Link key={f.id} to={`students/${f.id}/profile`}>
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
