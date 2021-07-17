import React, { useState, useMemo } from 'react'
import clsx from 'clsx'
import { Transition } from '@headlessui/react'
import { AdjustmentsIcon, SearchIcon } from '@heroicons/react/outline'

import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { isValidStudent, isValidTeacher } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import UserIconSvg from 'assets/svgs/user.svg'

interface SearchInputProps
	extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	showMenuButton?: boolean
	showMenuCallback?: Function
}

export const SearchInput = ({ showMenuButton, showMenuCallback, ...rest }: SearchInputProps) => {
	return (
		<div className="relative w-full">
			<input
				type="search"
				{...rest}
				name="search"
				className={clsx(
					rest.className,
					'text-gray-500 tw-input pl-8 rounded-3xl shadow-sm w-full'
				)}
				placeholder={rest.placeholder ?? 'Search here...'}
				autoComplete="off"
			/>
			<div className="absolute text-gray-500 left-0 ml-2 mr-4 my-3 top-0">
				<SearchIcon className="h-5 w-5" />
			</div>
			{showMenuButton && (
				<div className="absolute text-gray-500 right-0 mr-2 ml-4 my-3 -top-0.5">
					<AdjustmentsIcon
						onClick={showMenuCallback ? () => showMenuCallback() : null}
						className="h-6 w-6 cursor-pointer text-teal-brand"
					/>
				</div>
			)}
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
			.filter(s => isValidStudent(s))
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
		return Object.values(staff ?? {}).filter(s => isValidTeacher(s) && s.Active)
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
												s.ProfilePicture?.url ??
												s.ProfilePicture?.image_string ??
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
