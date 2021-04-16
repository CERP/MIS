import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import cond from 'cond-construct'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Transition } from '@headlessui/react'

import { AppLayout } from 'components/Layout/appLayout'
import { SearchInput } from 'components/input/search'
import { isValidStudent } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import months from 'constants/months'

import UserIconSvg from 'assets/svgs/user.svg'
import { CustomSelect } from 'components/select'
import { CalendarIcon, ChevronDownIcon, XCircleIcon } from '@heroicons/react/outline'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'

type State = {
	printFor: 'STUDENT' | 'CLASS' | 'FAMILY'
	id: string
	month: string
}

export const PrintVoucher = () => {
	const { classes, students } = useSelector((state: RootReducerState) => state.db)

	const currentYear = moment().format('YYYY')
	const currentMonth = moment().format('MMMM')

	const [state, setState] = useState<State>({
		printFor: 'STUDENT',
		id: '',
		month: currentMonth
	})

	const setId = (sid: string) => {
		setState({ ...state, id: sid })
	}

	const renderAddView = () => {
		return cond([
			[
				state.printFor === 'STUDENT',
				<StudentListSearch
					classes={classes}
					key={state.printFor}
					students={students}
					setStudentId={setId}
				/>
			],
			[
				state.printFor === 'CLASS',
				<PrintForClass key={state.printFor} classes={classes} setClassId={setId} />
			],
			[
				state.printFor === 'FAMILY',
				<FamilyDropdown key={state.printFor} students={students} setFamilyId={setId} />
			]
		])
	}

	const getPreviewRoute = (): string => {
		if (state.id === '') {
			toast.error('Please choose from list to continue')
		}
		return `${window.location.pathname}/print-preview?type=${state.printFor}&id=${state.id}&month=${state.month}&year=${currentYear}`
	}

	return (
		<AppLayout title={'Print Voucher'}>
			<div className="p-5 md:p-10 md:pb-0 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">Print Voucher</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-4 rounded-2xl bg-gray-700 p-4 my-4 md:mt-8 min-h-screen">
					<div className="flex flex-row items-center justify-between w-full md:w-3/5 space-x-4">
						<CustomSelect
							onChange={month => setState({ ...state, month })}
							data={months}
							selectedItem={state.month}>
							<CalendarIcon className="w-5 h-5 text-gray-500" />
						</CustomSelect>
						<CustomSelect
							onChange={year => {
								console.log(year)
							}}
							data={[currentYear]}
							selectedItem={currentYear}>
							<ChevronDownIcon className="w-5 h-5 text-gray-500" />
						</CustomSelect>
					</div>

					<div className="space-y-6 w-full md:w-3/5">
						<div className="text-white">Print Voucher for</div>
						<div className="flex items-center flex-wrap justify-between text-white">
							<div className="flex items-center">
								<input
									type="radio"
									onChange={() => setState({ ...state, printFor: 'STUDENT' })}
									checked={state.printFor === 'STUDENT'}
									className="form-radio text-teal-brand mr-2 w-4 h-4 cursor-pointer"
								/>
								<div className="text-sm">Student</div>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									onChange={() => setState({ ...state, printFor: 'CLASS' })}
									checked={state.printFor === 'CLASS'}
									className="form-radio text-teal-brand mr-2 w-4 h-4 cursor-pointer"
								/>
								<div className="text-sm">Class</div>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									onChange={() => setState({ ...state, printFor: 'FAMILY' })}
									checked={state.printFor === 'FAMILY'}
									className="form-radio text-teal-brand mr-2 w-4 h-4 cursor-pointer"
								/>
								<div className="text-sm">Family</div>
							</div>
						</div>
						{renderAddView()}
					</div>
					{state.id && (
						<Link
							to={getPreviewRoute}
							className="tw-btn-blue font-semibold text-center m-8 w-full md:w-3/5">
							Print
						</Link>
					)}
				</div>
			</div>
		</AppLayout>
	)
}

interface FamilyDropdownProps {
	students: RootDBState['students']
	setFamilyId: (id: string) => void
}

export const FamilyDropdown: React.FC<FamilyDropdownProps> = ({ students, setFamilyId }) => {
	const family = new Set<string>()
	Object.values(students).forEach(s => {
		if (s.Name && s.FamilyID) {
			family.add(s.FamilyID)
		}
	})

	return (
		<>
			<div className="text-white">Select Family</div>
			<select
				onChange={e => setFamilyId(e.target.value)}
				className="tw-is-form-bg-black tw-select py-2 w-full">
				<option value={''}>Choose from here</option>
				{Array.from(family)
					.filter(s => s)
					.map(f => (
						<option key={f} value={f}>
							{toTitleCase(f)}
						</option>
					))}
			</select>
		</>
	)
}

interface PrintForClassProps {
	classes: RootDBState['classes']
	setClassId: (cid: string) => void
}

export const PrintForClass = ({ classes, setClassId }: PrintForClassProps) => {
	return (
		<>
			<div className="text-white">Select Class</div>
			<select
				onChange={e => setClassId(e.target.value)}
				name="classId"
				className="tw-is-form-bg-black tw-select py-2 w-full">
				<option value={''}>Choose from here</option>
				{Object.values(classes)
					.filter(c => c)
					.sort((a, b) => a.classYear ?? 0 - b.classYear ?? 0)
					.map(c => (
						<option key={c.id} value={c.id}>
							{toTitleCase(c.name)}
						</option>
					))}
			</select>
		</>
	)
}

// TODO: move to common place for import and replace withing additional fee
// for student
interface StudentListSearchProps {
	students: RootDBState['students']
	classes: RootDBState['classes']
	setStudentId: (sid: string) => void
}

export const StudentListSearch = ({ students, setStudentId, classes }: StudentListSearchProps) => {
	const [searchText, setSearchText] = useState('')
	const [student, setStudent] = useState<MISStudent & { section: AugmentedSection }>()

	const clearStudent = () => {
		setStudent(undefined)
		setStudentId('')
	}

	useEffect(() => {
		if (student) {
			const section = getSectionsFromClasses(classes).find(s => s.id === student.id)
			setStudent({ ...students?.[student.id], section })
		}
	}, [students])

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

	return (
		<>
			<div className="text-white">Select Student</div>
			{!student?.id && (
				<SearchInput
					value={searchText}
					onChange={e => setSearchText(e.target.value)}
					className="text-gray-700"
				/>
			)}
			{
				<Transition
					show={searchText.length > 0 && !student?.id}
					enter="transition-opacity duration-75"
					enterFrom="opacity-0"
					enterTo="opacity-100">
					<div className="w-full max-h-40 overflow-y-auto bg-white rounded-3xl text-gray-900 p-4">
						{sectionStudents
							.filter(
								s =>
									isValidStudent(s) &&
									s.Active &&
									(searchText
										? s.Name.toLowerCase().includes(searchText.toLowerCase())
										: true)
							)
							.map(s => (
								<div
									key={s.id}
									onClick={() => {
										setStudent(s)
										setStudentId(s.id)
									}}
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
			{
				<Transition
					show={!!student?.id}
					enter="transition-opacity duration-150"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					className="flex flex-row items-center justify-between p-3 text-gray-900 rounded-full bg-white">
					<div className="flex flex-row items-center">
						<img
							src={
								student?.ProfilePicture?.url ||
								student?.ProfilePicture?.image_string ||
								UserIconSvg
							}
							className="w-6 h-6 mr-2 bg-gray-500 rounded-full"
							alt={student?.Name}
						/>
						<div>{student?.Name}</div>
					</div>
					<div className="text-xs">{student?.section?.namespaced_name}</div>
					<XCircleIcon
						onClick={clearStudent}
						className="w-6 cursor-pointer rounded-full text-white bg-red-brand"
					/>
				</Transition>
			}
		</>
	)
}
