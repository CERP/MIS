import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { isValidTeacher } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import UserIconSvg from 'assets/svgs/user.svg'
import { SearchInput } from 'components/input/search'
import { AddStickyButton } from 'components/Button/add-sticky'
import Paginate from 'components/Paginate'

type State = {
	isActive: boolean
	searchText: string
	tag: string
}

export const StaffList = () => {
	const { faculty, classes } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		isActive: true,
		searchText: '',
		tag: ''
	})

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes)
	}, [classes])

	const filteredStaff = Object.values(faculty)
		.filter(f => {
			const searchString = `${f.Name} ${f.Phone}`.toLowerCase()
			return (
				isValidTeacher(f) &&
				f.Active === state.isActive &&
				(state.searchText ? searchString.includes(state.searchText.toLowerCase()) : true) &&
				(state.tag ? f?.tags[state.tag] : true)
			)
		})
		.sort((a, b) => a.Name.localeCompare(b.Name))

	const listItem = (f: MISTeacher) => {
		return (
			<Link key={f.id} to={`staff/${f.id}/profile`}>
				<Card teacher={f} sections={sections} />
			</Link>
		)
	}

	const getUniqueTags = (): string[] => {
		const tags = new Set<string>()

		Object.values(faculty ?? {}).forEach(f => {
			if (isValidTeacher(f)) {
				Object.keys(f.tags ?? {}).forEach(tag => tags.add(tag))
			}
		})

		return [...tags]
	}

	return (
		<AppLayout title="Staff" showHeaderTitle>
			<div className="p-5 md:p-10 relative mb-20">
				<Link to="staff/new">
					<AddStickyButton label="Add new Staff" />
				</Link>
				<div className="flex flex-row items-center mt-4 mb-12 md:mb-20 space-x-4 md:space-y-0 md:space-x-60">
					<SearchInput
						placeholder="Search by name or phone"
						className="md:w-2/5"
						onChange={e => setState({ ...state, searchText: e.target.value })}
					/>
					<div className="flex flex-row space-x-2">
						<select
							onChange={e => setState({ ...state, tag: e.target.value })}
							className="rounded  tw-select shadow text-teal-brand">
							<option value={''}>Tags</option>
							{getUniqueTags().map(tag => (
								<option key={tag} value={tag}>
									{tag}
								</option>
							))}
						</select>
						<select
							value={state.isActive.toString()}
							onChange={e =>
								setState({ ...state, isActive: e.target.value === 'true' })
							}
							className="rounded tw-select shadow text-teal-brand">
							<option value={'true'}>Active</option>
							<option value={'false'}>InActive</option>
						</select>
					</div>
				</div>
				<Paginate
					items={filteredStaff}
					itemsPerPage={10}
					numberOfBottomPages={3}
					renderComponent={listItem}
				/>
			</div>
		</AppLayout>
	)
}

type CardProps = {
	teacher: MISTeacher
	sections: AugmentedSection[]
}

const Card = ({ teacher, sections }: CardProps) => {
	const teacherSection = sections.find(s => s.faculty_id === teacher.id)

	return (
		<div className="relative">
			<div className="bg-white rounded-xl text-center border md:h-48 border-gray-100 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-8 truncate w-3/5 mx-auto">
					{toTitleCase(teacher.Name)}
				</div>
				<div className="mt-2 space-y-0 text-sm text-gray-900">
					<div className="flex items-center justify-between flex-row">
						<div className="font-semibold">Father</div>
						<div className="text-gray-500 text-xs">{toTitleCase(teacher.ManName)}</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="font-semibold">Class</div>
						<div className="text-gray-500 text-xs truncate">
							{teacherSection?.namespaced_name}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="font-semibold">CNIC</div>
						<div className="text-gray-500 text-xs">{teacher.CNIC}</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="font-semibold">Phone</div>
						<div className="text-gray-500 text-xs">{teacher.Phone}</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-10 left-0 right-0">
				<img
					src={
						teacher.ProfilePicture?.url ??
						teacher.ProfilePicture?.image_string ??
						UserIconSvg
					}
					className="mx-auto h-20 w-20 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700"
					alt={teacher.Name || 'faculty'}
				/>
			</div>
		</div>
	)
}
