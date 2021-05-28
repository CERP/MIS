import React, { useEffect, useMemo, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { toTitleCase } from 'utils/toTitleCase'
import { isValidStudent } from 'utils'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import UserIconSvg from 'assets/svgs/user.svg'
import { SearchInput } from 'components/input/search'
import { AddStickyButton } from 'components/Button/add-sticky'
import { PrinterIcon } from '@heroicons/react/outline'
import Paginate from 'components/Paginate'

type Filter = {
	search: string
	active: boolean
	tag: string
	class: string
}

export const StudentList = () => {
	const students = useSelector((state: RootReducerState) => state.db.students, shallowEqual)
	const classes = useSelector((state: RootReducerState) => state.db.classes, shallowEqual)

	// TODO: create single state variable
	const [search, setSearch] = useState('')
	const [filter, setFilter] = useState<Filter>({
		active: true,
		search: '',
		tag: '',
		class: ''
	})

	const getTags = () => {
		return [
			...new Set(
				Object.values(students ?? {})
					.filter(s => isValidStudent(s) && s.Active === filter.active)
					.reduce((tags, student) => {
						return [
							...tags,
							Object.keys(student.tags ?? {}).reduce((tag, curr) => {
								return [...tag, curr]
							}, [])
						]
					}, [])
					.flat(1)
			)
		]
	}

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes)
	}, [classes])

	// TODO: add options to cards
	// TODO: add a check here for max_limit: state.db.max_limit
	// to restrict adding students

	const filteredStudents = Object.values(students)
		.filter(
			s =>
				isValidStudent(s) &&
				s.Active === filter.active &&
				(search ? s.Name.includes(search) : true) &&
				(filter.class ? s.section_id === filter.class : true) &&
				(filter.tag ? Object.keys(s.tags ?? []).includes(filter.tag) : true)
		)
		.sort((a, b) => a.Name.localeCompare(b.Name))

	const listItem = (f: MISStudent) => {
		return (
			<Link key={f.id} to={`students/${f.id}/profile`}>
				<Card student={f} sections={sections} />
			</Link>
		)
	}

	return (
		<AppLayout title="Students" showHeaderTitle>
			<div className="relative p-5 mb-20 md:p-10">
				<Link to="/students/new/menu">
					<AddStickyButton label="Add new Student" />
				</Link>

				{/* <div className="my-4 text-2xl font-bold text-center lg:hidden">School Students</div> */}
				<div className="text-center text-gray-700 lg:hidden">
					Total = {filteredStudents.length}
				</div>
				<div className="flex flex-col items-center justify-between mt-4 mb-12 space-y-4 md:flex-row md:mb-20 md:space-y-0 md:space-x-60">
					<SearchInput onChange={e => setSearch(e.target.value)} />
					<div className="flex flex-row items-center w-full space-x-2">
						<select
							onChange={e => setFilter({ ...filter, tag: e.target.value })}
							className="rounded shadow tw-select text-teal-brand">
							<option value="">Tag</option>
							{getTags().map(tag => (
								<option key={tag} value={tag}>
									{tag}
								</option>
							))}
						</select>
						<select
							onChange={e => setFilter({ ...filter, class: e.target.value })}
							className="w-full rounded shadow tw-select text-teal-brand">
							<option value="">Choose Class</option>
							{sections
								.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
								.map(s => (
									<option key={s.id + s.class_id} value={s.id}>
										{toTitleCase(s.namespaced_name, '-')}
									</option>
								))}
						</select>
						<select
							className="rounded shadow tw-select text-teal-brand"
							onChange={e =>
								setFilter({ ...filter, active: e.target.value === 'true' })
							}>
							<option value={'true'}>Active</option>
							<option value={'false'}>InActive</option>
						</select>
						<div className="hidden lg:flex flex-col space-between  text-white">
							<div
								onClick={() => window.print()}
								className="py-2 px-3 rounded-full flex cursor-pointer bg-blue-brand flex-row justify-between border shadow-md items-center ">
								<div className="flex flex-row items-center">
									<div className="flex flex-row">
										<div className="font-semibold text-lg">
											<h1>Print</h1>
										</div>
									</div>
									<PrinterIcon className="h-8 w-8 ml-10" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<Paginate
					items={filteredStudents}
					itemsPerPage={10}
					numberOfBottomPages={3}
					renderComponent={listItem}
				/>
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
			<div className="px-3 py-4 text-center bg-white border shadow-md rounded-xl lg:h-56 border-gray-50 md:p-5">
				<div className="w-4/5 pt-8 mx-auto font-bold truncate">
					{toTitleCase(student.Name)}
				</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<div className="flex flex-row items-center justify-between">
						<div className="font-semibold text-gray-900">Father</div>
						<div className="text-xs text-gray-500 truncate md:text-base lg:text-lg">
							{toTitleCase(student.ManName)}
						</div>
					</div>
					<div className="flex flex-row items-center justify-between">
						<div className="font-semibold text-gray-900">Class</div>
						<div className="text-xs text-gray-500 truncate md:text-base lg:text-lg">
							{toTitleCase(studentSection?.namespaced_name)}
						</div>
					</div>
					<div className="flex flex-row items-center justify-between">
						<div className="font-semibold text-gray-900">Roll #</div>
						<div className="text-xs text-gray-500 md:text-base lg:text-lg">
							{student.RollNumber}
						</div>
					</div>
					<div className="flex flex-row items-center justify-between">
						<div className="font-semibold text-gray-900">Phone</div>
						<div className="text-xs text-gray-500 md:text-base lg:text-lg">
							{student.Phone}
						</div>
					</div>
				</div>
			</div>
			<div className="absolute left-0 right-0 -top-10">
				<img
					src={
						student.ProfilePicture?.url ||
						student.ProfilePicture?.image_string ||
						UserIconSvg
					}
					className="w-20 h-20 mx-auto bg-gray-500 rounded-full shadow-md hover:bg-gray-700"
					alt={student.Name.split(' ')[0] || 'student'}
				/>
			</div>
		</div>
	)
}
