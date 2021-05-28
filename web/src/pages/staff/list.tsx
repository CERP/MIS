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

export const StaffList = () => {
	const { faculty, classes } = useSelector((state: RootReducerState) => state.db)

	const [isActive, setIsAtive] = useState(true)
	const [search, setSearch] = useState('')

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes)
	}, [classes])

	const filteredStaff = Object.values(faculty)
		.filter(
			f =>
				isValidTeacher(f) &&
				f.Active === isActive &&
				(search ? f.Name.toLowerCase().includes(search.toLowerCase()) : true)
		)
		.sort((a, b) => a.Name.localeCompare(b.Name))

	const listItem = (f: MISTeacher) => {
		return (
			<Link key={f.id} to={`staff/${f.id}/profile`}>
				<Card teacher={f} sections={sections} />
			</Link>
		)
	}
	return (
		<AppLayout title="Staff">
			<div className="p-5 md:p-10 relative mb-20 ">
				<Link to="staff/new">
					<AddStickyButton label="Add new Staff" />
				</Link>
				<div className="text-center font-bold text-2xl my-4 lg:hidden">School Staff</div>
				<div className="text-gray-700 text-center lg:hidden">
					Total = {filteredStaff.length}
				</div>
				<div className="flex flex-row items-center justify-between mt-4 mb-12 md:mb-20 space-x-4 md:space-y-0 md:space-x-60">
					<SearchInput onChange={e => setSearch(e.target.value)} />
					<select
						value={isActive.toString()}
						onChange={e => setIsAtive(e.target.value === 'true')}
						className="mt-0 tw-select rounded shadow text-teal-brand w-2/5">
						<option value={'true'}>Active</option>
						<option value={'false'}>InActive</option>
					</select>
				</div>
				<Paginate
					items={filteredStaff}
					itemsPerPage={10}
					numberOfBottomPages={3}
					renderComponent={listItem}
				/>
				)
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
			<div className="bg-white rounded-xl text-center border md:h-60 border-gray-100 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-8 truncate w-3/5 mx-auto">
					{toTitleCase(teacher.Name)}
				</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Father</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{toTitleCase(teacher.ManName)}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Class</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg truncate">
							{teacherSection?.namespaced_name}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">CNIC</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{teacher.CNIC}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Phone</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{teacher.Phone}
						</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-10 left-0 right-0">
				<img
					src={
						teacher.ProfilePicture?.url ||
						teacher.ProfilePicture?.image_string ||
						UserIconSvg
					}
					className="mx-auto h-20 w-20 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700"
					alt={teacher.Name || 'faculty'}
				/>
			</div>
		</div>
	)
}
