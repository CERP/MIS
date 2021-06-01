import React, { useMemo, useState } from 'react'
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

type State = {
	searchText: string
	active: boolean
	tag: string
	class: string
}

interface StudentListProps {
	forwardTo?: string
	excludeFamilyStudents?: boolean
}

export const StudentList = ({ forwardTo, excludeFamilyStudents }: StudentListProps) => {
	const students = useSelector((state: RootReducerState) => state.db.students, shallowEqual)
	const classes = useSelector((state: RootReducerState) => state.db.classes, shallowEqual)

	const [state, setFilter] = useState<State>({
		active: true,
		searchText: '',
		tag: '',
		class: ''
	})

	const getTags = () => {
		return [
			...new Set(
				Object.values(students ?? {})
					.filter(s => isValidStudent(s) && s.Active === state.active)
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

	const filteredStudents = Object.values(students ?? {})
		.filter(s => {
			const searchString = `${s.Name} ${s.ManName} ${s.FamilyID} ${s.Phone}`.toLowerCase()

			return (
				isValidStudent(s) &&
				s.Active === state.active &&
				(excludeFamilyStudents ? !s.FamilyID : true) &&
				(state.searchText ? searchString.includes(state.searchText.toLowerCase()) : true) &&
				(state.class ? s.section_id === state.class : true) &&
				(state.tag ? Object.keys(s.tags ?? []).includes(state.tag) : true)
			)
		})
		.sort((a, b) => a.Name.localeCompare(b.Name))

	const listItem = (f: MISStudent) => {
		const forwardToLink = forwardTo || 'profile'
		return (
			<Link key={f.id} to={`students/${f.id}/${forwardToLink}`}>
				<Card student={f} sections={sections} />
			</Link>
		)
	}

	return (
		<AppLayout title={toTitleCase(`Students ${forwardTo}`)} showHeaderTitle>
			<div className="relative p-5 md:p-10 md:pt-5 mb-20">
				<Link to="/students/new/menu">
					<AddStickyButton label="Add new Student" />
				</Link>

				{/* <div className="my-4 text-2xl font-bold text-center lg:hidden">School Students</div> */}
				{/* <div className="text-center text-gray-700 lg:hidden">
					Total = {filteredStudents.length}
				</div> */}
				<div className="flex flex-col items-center justify-between mt-4 mb-12 space-y-4 md:flex-row md:mb-20 md:space-y-0 md:space-x-60">
					<SearchInput
						placeholder="Search by name, fname or phone"
						className="md:w-9/12"
						onChange={e => setFilter({ ...state, searchText: e.target.value })}
					/>
					<div className="flex flex-row items-center w-full space-x-2">
						<select
							onChange={e => setFilter({ ...state, tag: e.target.value })}
							className="rounded shadow tw-select text-teal-brand">
							<option value="">Tag</option>
							{getTags().map(tag => (
								<option key={tag} value={tag}>
									{tag}
								</option>
							))}
						</select>
						<select
							className="rounded shadow tw-select text-teal-brand"
							onChange={e =>
								setFilter({ ...state, active: e.target.value === 'true' })
							}>
							<option value={'true'}>Active</option>
							<option value={'false'}>InActive</option>
						</select>
						<select
							onChange={e => setFilter({ ...state, class: e.target.value })}
							className="w-full rounded shadow tw-select text-teal-brand">
							<option value="">Class</option>
							{sections
								.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
								.map(s => (
									<option key={s.id + s.class_id} value={s.id}>
										{toTitleCase(s.namespaced_name, '-')}
									</option>
								))}
						</select>
						<button
							onClick={() => window.print()}
							className="hidden lg:inline-flex items-center tw-btn-blue rounded-3xl shadow-md">
							<span>Print</span>
							<PrinterIcon className="h-6 w-6 ml-4" />
						</button>
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
			<div className="px-3 py-4 text-center bg-white border shadow-md rounded-xl lg:h-48 border-gray-50 md:p-5">
				<div className="w-4/5 pt-8 mx-auto font-bold truncate">
					{toTitleCase(student.Name)}
				</div>
				<div className="mt-2 space-y-0 text-sm text-gray-900">
					<div className="flex flex-row items-center justify-between">
						<div className="font-semibold">Father</div>
						<div className="text-xs text-gray-500 truncate">
							{toTitleCase(student.ManName)}
						</div>
					</div>
					<div className="flex flex-row items-center justify-between">
						<div className="font-semibold">Class</div>
						<div className="text-gray-500 truncate">
							{toTitleCase(studentSection?.namespaced_name)}
						</div>
					</div>
					<div className="flex flex-row items-center justify-between">
						<div className="font-semibold">Roll #</div>
						<div className="text-gray-500">{student.RollNumber}</div>
					</div>
					<div className="flex flex-row items-center justify-between">
						<div className="font-semibold">Phone</div>
						<div className="text-gray-500">{student.Phone}</div>
					</div>
				</div>
			</div>
			<div className="absolute left-0 right-0 -top-10">
				<img
					src={
						student.ProfilePicture?.url ??
						student.ProfilePicture?.image_string ??
						UserIconSvg
					}
					className="w-20 h-20 mx-auto bg-gray-500 rounded-full shadow-md hover:bg-gray-700"
					alt={student.Name.split(' ')[0]}
				/>
			</div>
		</div>
	)
}
