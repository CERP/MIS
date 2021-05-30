import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import clsx from 'clsx'
import cond from 'cond-construct'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Transition } from '@headlessui/react'
import { CalendarIcon, ChevronDownIcon, XCircleIcon } from '@heroicons/react/outline'

import months from 'constants/months'
import { isValidStudent } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import { CustomSelect } from 'components/select'
import { SearchInput } from 'components/input/search'
import { AppLayout } from 'components/Layout/appLayout'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'

import UserIconSvg from 'assets/svgs/user.svg'

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
		if (state.printFor === 'CLASS') {
			return `/classes/${state.id}/print-voucher/preview?month=${state.month}&year=${currentYear}`
		}

		return `/fees/print-voucher/preview?type=${state.printFor}&id=${state.id}&month=${state.month}&year=${currentYear}`
	}

	return (
		<AppLayout title={'Print Voucher'} showHeaderTitle>
			<div className="p-5 md:p-10 md:pb-0 relative">
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center rounded-2xl bg-gray-700 p-5 md:p-10">
					<div className="flex flex-row items-center justify-between w-full md:w-3/5 space-x-4">
						<CustomSelect
							onChange={month => setState({ ...state, month })}
							data={months}
							selectedItem={state.month}>
							<CalendarIcon className="w-5 h-5 text-teal-brand" />
						</CustomSelect>
						<CustomSelect
							onChange={year => {
								console.log(year)
							}}
							data={[currentYear]}
							selectedItem={currentYear}>
							<ChevronDownIcon className="w-5 h-5 text-teal-brand" />
						</CustomSelect>
					</div>

					<div className="space-y-4 w-full md:w-3/5 mt-4 mb-6">
						<div className="text-white font-semibold">Print Voucher for</div>
						<div className="flex items-center flex-wrap justify-between text-white">
							<div className="flex items-center">
								<input
									type="radio"
									onChange={() => setState({ ...state, printFor: 'STUDENT' })}
									checked={state.printFor === 'STUDENT'}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Student</div>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									onChange={() => setState({ ...state, printFor: 'CLASS' })}
									checked={state.printFor === 'CLASS'}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Class</div>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									onChange={() => setState({ ...state, printFor: 'FAMILY' })}
									checked={state.printFor === 'FAMILY'}
									className="mr-2 form-radio tw-radio"
								/>
								<div className="text-sm">Family</div>
							</div>
						</div>
						{renderAddView()}
					</div>
					<Link
						to={getPreviewRoute}
						className={clsx('tw-btn-blue font-semibold text-center w-full md:w-3/5', {
							'bg-gray-400 pointer-events-none text-gray-150': !state.id
						})}>
						{state.id
							? 'Print Preview'
							: `Please ${toTitleCase(state.printFor)} to preview voucher.`}
					</Link>
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
		if (isValidStudent(s) && s.Active && s.FamilyID) {
			family.add(s.FamilyID)
		}
	})

	return (
		<>
			<div className="text-white font-semibold">Select Family</div>
			<select
				onChange={e => setFamilyId(e.target.value)}
				className="tw-is-form-bg-black tw-select py-2 w-full">
				<option value={''}>Choose from here</option>
				{[...family]
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
			<div className="text-white font-semibold">Select Class</div>
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
			<div className="text-white font-semibold">Select Student</div>
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
