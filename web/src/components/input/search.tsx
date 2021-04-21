import React, { useState, useMemo } from 'react'
import clsx from 'clsx'
import { Transition } from '@headlessui/react'

import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { isValidStudent, isValidTeacher } from 'utils'

import UserIconSvg from 'assets/svgs/user.svg'
import toTitleCase from 'utils/toTitleCase'

export const SearchInput = (
	props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) => {
	return (
		<div className="relative w-full">
			<input
				{...props}
				type="search"
				name="search"
				className={clsx(props.className, 'tw-input pl-8 rounded-3xl shadow-sm w-full')}
				placeholder={props.placeholder || 'Search here...'}
				autoComplete="off"
			/>
			<div className="absolute text-gray-500 left-0 ml-2 mr-4 my-3 top-0">
				<svg
					className="h-4 w-4 mt-px fill-current"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					id="Capa_1"
					x="0px"
					y="0px"
					viewBox="0 0 56.966 56.966"
					width="512px"
					height="512px">
					<path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
				</svg>
			</div>
		</div>
	)
}

interface StudentDropdownSearchProps {
	students: RootDBState['students']
	classes: RootDBState['classes']
	onSelectStudent: (studentId: string) => void
}

export const StudentDropdownSearch: React.FC<StudentDropdownSearchProps> = ({
	students,
	classes,
	onSelectStudent
}) => {
	const [searchText, setSearchText] = useState('')

	const sectionStudents = useMemo(() => {
		const sections = getSectionsFromClasses(classes)
		return Object.values(students)
			.filter(s => isValidStudent(s) && s.Active)
			.map(s => {
				const section = sections.find(section => s.section_id === section.id)
				return {
					...s,
					section
				}
			})
	}, [students, classes])

	const handleSelectStudent = (studentId: string) => {
		setSearchText('')
		onSelectStudent(studentId)
	}

	return (
		<>
			<SearchInput
				value={searchText}
				placeholder="Search student by name"
				onChange={e => setSearchText(e.target.value)}
				className="text-gray-700"
			/>
			{
				<Transition
					show={searchText.length > 0}
					enter="transition-opacity duration-75"
					enterFrom="opacity-0"
					enterTo="opacity-100">
					<div className="w-full max-h-40 overflow-y-auto bg-white rounded-3xl text-gray-900 p-4">
						{sectionStudents
							.filter(s =>
								searchText
									? s.Name.toLowerCase().includes(searchText.toLowerCase())
									: true
							)
							.map(s => (
								<div
									key={s.id}
									onClick={() => handleSelectStudent(s.id)}
									className="flex p-2 flex-row items-center justify-between cursor-pointer rounded-lg hover:bg-gray-100">
									<div className="flex flex-row items-center">
										<img
											src={
												s.ProfilePicture?.url ||
												s.ProfilePicture?.image_string ||
												UserIconSvg
											}
											className="w-6 h-6 mr-2 bg-gray-500 rounded-full"
											alt={s.Name}
										/>
										<div className="text-sm">{toTitleCase(s.Name)}</div>
									</div>
									<div className="text-xs">{s.section?.namespaced_name}</div>
								</div>
							))}
					</div>
				</Transition>
			}
		</>
	)
}

interface StaffDropdownSearchProps {
	staff: RootDBState['faculty']
	onSelectStaff: (studentId: string) => void
}

export const StaffDropdownSearch: React.FC<StaffDropdownSearchProps> = ({
	staff,
	onSelectStaff
}) => {
	const [searchText, setSearchText] = useState('')
	const sectionStudents = useMemo(() => {
		return Object.values(staff || {}).filter(s => isValidTeacher(s) && s.Active)
	}, [staff])

	const handleSelectStudent = (studentId: string) => {
		setSearchText('')
		onSelectStaff(studentId)
	}

	return (
		<>
			<SearchInput
				value={searchText}
				placeholder="Search staff member by name"
				onChange={e => setSearchText(e.target.value)}
				className="text-gray-700"
			/>
			{
				<Transition
					show={searchText.length > 0}
					enter="transition-opacity duration-75"
					enterFrom="opacity-0"
					enterTo="opacity-100">
					<div className="w-full max-h-40 overflow-y-auto bg-white rounded-3xl text-gray-900 p-4">
						{sectionStudents
							.filter(s =>
								searchText
									? s.Name.toLowerCase().includes(searchText.toLowerCase())
									: true
							)
							.map(s => (
								<div
									key={s.id}
									onClick={() => handleSelectStudent(s.id)}
									className="flex p-2 flex-row items-center justify-between cursor-pointer rounded-lg hover:bg-gray-100">
									<div className="flex flex-row items-center">
										<img
											src={
												s.ProfilePicture?.url ||
												s.ProfilePicture?.image_string ||
												UserIconSvg
											}
											className="w-6 h-6 mr-2 bg-gray-500 rounded-full"
											alt={s.Name}
										/>
										<div className="text-sm">{toTitleCase(s.Name)}</div>
									</div>
								</div>
							))}
					</div>
				</Transition>
			}
		</>
	)
}
