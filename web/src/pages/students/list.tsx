import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'
import {
	CreditCardIcon,
	PrinterIcon,
	ShieldExclamationIcon,
	ViewListIcon
} from '@heroicons/react/outline'
import { Popover, Transition } from '@headlessui/react'

import { AppLayout } from 'components/Layout/appLayout'
import { toTitleCase } from 'utils/toTitleCase'
import { classYearSorter, isValidStudent } from 'utils'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { SearchInput } from 'components/input/search'
import { AddStickyButton } from 'components/Button/add-sticky'
import Paginate from 'components/Paginate'
import { SwitchButton } from 'components/input/switch'
import { useComponentVisible } from 'hooks/useComponentVisible'
import chunkify from 'utils/chunkify'
import { StudentPrintableList } from 'components/Printable/Student/list'
import { StudenPrintableIDCardList } from 'components/Printable/Student/cardlist'
import { checkStudentDuesReturning } from 'utils/checkStudentDues'
import { addMultiplePayments } from 'actions'

import UserIconSvg from 'assets/svgs/user.svg'

type State = {
	searchText: string
	active: boolean
	tag: string
	class: string
	gender: string
	searchByAdmissionNo: boolean
	searchByRollNo: boolean
	printCards: boolean
	singleStudentPrintID: string
}

interface StudentListProps {
	forwardTo?: string
	excludeFamilyStudents?: boolean
	excludeNavHeader?: boolean
}

export const StudentList = ({
	forwardTo,
	excludeFamilyStudents,
	excludeNavHeader
}: StudentListProps) => {
	const dispatch = useDispatch()
	const students = useSelector((state: RootReducerState) => state.db.students, shallowEqual)
	const classes = useSelector((state: RootReducerState) => state.db.classes, shallowEqual)
	const settings = useSelector((state: RootReducerState) => state.db.settings, shallowEqual)
	const assets = useSelector((state: RootReducerState) => state.db.assets, shallowEqual)
	const maxStudentsLimit = useSelector((state: RootReducerState) => state.db.max_limit || -1)

	const searchInputRef = useRef(null)

	const schoolName = settings.schoolName

	const schoolSession = {
		startYear:
			settings && settings.schoolSession
				? moment(settings.schoolSession.start_date).format('YYYY')
				: '',
		endYear:
			settings && settings.schoolSession
				? moment(settings.schoolSession.end_date).format('YYYY')
				: ''
	}

	const {
		ref: searchMenuRef,
		isComponentVisible: showSearchMenu,
		setIsComponentVisible: setShowSearchMenu
	} = useComponentVisible(false)

	const [state, setFilter] = useState<State>({
		active: true,
		searchText: '',
		tag: '',
		class: '',
		gender: '',
		searchByAdmissionNo: false,
		searchByRollNo: false,
		printCards: false,
		singleStudentPrintID: ''
	})

	const getTags = () => {
		return [
			...new Set(
				Object.values(students ?? {})
					.filter(s => isValidStudent(s, { active: true }) && s.Active === state.active)
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

	useEffect(() => {
		const sectionStudents = Object.values(students).reduce<AugmentedStudent[]>(
			(agg, student) => {
				if (isValidStudent(student, { active: true })) {
					return [
						...agg,
						{
							...student,
							section: sections?.find(section => section.id === student.section_id)
						}
					]
				}
				return agg
			},
			[]
		)

		const generatePayments = (students: AugmentedStudent[]) => {
			if (students.length > 0) {
				const payments = students.reduce((agg, curr) => {
					const curr_student_payments = checkStudentDuesReturning(curr, settings)
					if (curr_student_payments.length > 0) {
						return [...agg, ...curr_student_payments]
					}
					return agg
				}, [])

				if (payments.length > 0) {
					dispatch(addMultiplePayments(payments))
				}
			}
		}

		generatePayments(sectionStudents)
	}, [students, settings])

	// TODO: add options to cards

	const filteredStudents: AugmentedStudent[] = Object.values(students ?? {})
		.filter(s => {
			const searchString = `${s.Name} ${s.ManName} ${s.FamilyID} ${s.Phone}`.toLowerCase()
			const searchAdmission = (s.AdmissionNumber ?? '').toLowerCase()
			const searchRollNo = (s.RollNumber ?? '').toLowerCase()
			const advanceFilterActive = state.searchByAdmissionNo || state.searchByRollNo

			return (
				isValidStudent(s, {
					active: state.active,
					includeFinishSchool: !state.active,
					includeSectionId: !state.active
				}) &&
				(excludeFamilyStudents ? !s.FamilyID : true) &&
				(state.searchByAdmissionNo || state.searchByRollNo
					? true
					: state.searchText
						? searchString.includes(state.searchText.toLowerCase())
						: true) &&
				(state.class ? s.section_id === state.class : true) &&
				(state.tag ? Object.keys(s.tags ?? []).includes(state.tag) : true) &&
				(state.gender ? state.gender.toLowerCase() === s.Gender.toLowerCase() : true) &&
				(advanceFilterActive
					? state.searchByAdmissionNo
						? searchAdmission.includes(state.searchText.toLowerCase())
						: searchRollNo.includes(state.searchText.toLowerCase())
					: true)
			)
		})
		.sort((a, b) => a.Name.localeCompare(b.Name))
		.map(student => {
			const relevant_section = sections.find(section => section.id === student.section_id)

			return {
				...student,
				section: relevant_section
			}
		})

	const listItem = (f: MISStudent) => {
		const forwardToLink = forwardTo ?? 'profile'
		return (
			<Link key={f.id} to={`/students/${f.id}/${forwardToLink}`}>
				<Card
					schoolName={schoolName}
					schoolSession={settings.schoolSession}
					student={f}
					sections={sections}
					printSingleStudentCard={id => {
						setFilter({ ...state, singleStudentPrintID: id, printCards: true })

						setTimeout(() => {
							onPrint()
						}, 200)
					}}
				/>
			</Link>
		)
	}

	const currentActiveStudents = useMemo(() => {
		return Object.values(students ?? {}).filter(student =>
			isValidStudent(student, { active: true })
		)
	}, [students])

	const onPrint = () => {
		window.print()

		setFilter({ ...state, singleStudentPrintID: '', printCards: false })
	}

	const pageTitle = `Students${forwardTo ? ' ' + toTitleCase(forwardTo) : ''}`

	const hasReachedMaxStudents =
		maxStudentsLimit > 0 && currentActiveStudents.length >= maxStudentsLimit

	const renderListPage = () => {
		return (
			<>
				<div className="relative p-5 md:p-10 md:pt-5 mb-10 md:mb-0 print:hidden">
					{!forwardTo &&
						(hasReachedMaxStudents ? (
							<div className="inline-flex items-center fixed z-50 bottom-4 right-4 md:right-8 rounded-full bg-red-brand md:w-1/4 text-white py-1 md:py-3 px-2 md:px-6 w-11/12 text-lg mr-0.5 shadow-md md:font-semibold">
								<ShieldExclamationIcon className="w-6 mr-1 md:mr-4" />
								<span>Upgrade package to add students</span>
							</div>
						) : (
							<Link to="/students/new/menu">
								<AddStickyButton label={'Add new Student'} />
							</Link>
						))}

					<div className="flex flex-col items-center justify-between mt-4 mb-12 space-y-4 md:flex-row md:mb-20 md:space-y-0 md:space-x-60">
						<div ref={searchInputRef} className="md:w-9/12 w-full">
							<SearchInput
								showMenuButton
								showMenuCallback={() => setShowSearchMenu(true)}
								placeholder={
									'Search by ' +
									(state.searchByAdmissionNo
										? 'Admission no'
										: state.searchByRollNo
											? 'Roll number'
											: 'Name, FName or Phone')
								}
								className="md:w-full"
								type="text"
								onChange={e => {
									setFilter({ ...state, searchText: e.target.value })
								}}
							/>
							{showSearchMenu && (
								<div
									ref={searchMenuRef}
									className="absolute top-2 z-20 space-y-3 bg-gray-600 p-5 rounded-2xl text-white"
									style={{
										top: searchInputRef.current
											? searchInputRef.current.offsetTop +
											searchInputRef.current.offsetHeight +
											2
											: 0,
										left: searchInputRef.current
											? searchInputRef.current.offsetLeft
											: 0,
										width: searchInputRef.current
											? searchInputRef.current.offsetWidth
											: 0
									}}>
									<div className="flex flex-1  justify-center items-center">
										<h1 className="flex-1 text-sm">
											Search By Admission Number
										</h1>
										<SwitchButton
											state={state.searchByAdmissionNo}
											callback={() =>
												setFilter({
													...state,
													searchByAdmissionNo: !state.searchByAdmissionNo,
													searchByRollNo: false
												})
											}
										/>
									</div>
									<div className="flex flex-1 justify-center items-center">
										<h1 className="flex-1 text-sm">Search By Roll Number</h1>
										<SwitchButton
											state={state.searchByRollNo}
											callback={() =>
												setFilter({
													...state,
													searchByRollNo: !state.searchByRollNo,
													searchByAdmissionNo: false
												})
											}
										/>
									</div>
								</div>
							)}
						</div>
						<div className="flex flex-row items-center w-full space-x-2">
							<select
								onChange={e => setFilter({ ...state, tag: e.target.value })}
								className="w-1/3 rounded shadow tw-select text-teal-brand">
								<option value="">Tags</option>
								{getTags().map(tag => (
									<option key={tag} value={tag}>
										{tag}
									</option>
								))}
							</select>
							<select
								className="w-1/3 rounded shadow tw-select text-teal-brand"
								onChange={e => setFilter({ ...state, gender: e.target.value })}>
								<option value="">Gender</option>
								<option value={'Male'}>M</option>
								<option value={'Female'}>F</option>
								<option value={'Other'}>Other</option>
							</select>
							<select
								className="w-1/3 rounded shadow tw-select text-teal-brand"
								onChange={e =>
									setFilter({ ...state, active: e.target.value === 'true' })
								}>
								<option value={'true'}>Active</option>
								<option value={'false'}>InActive</option>
							</select>
							<select
								onChange={e => setFilter({ ...state, class: e.target.value })}
								className="w-1/3 rounded shadow tw-select text-teal-brand">
								<option value="">Class</option>
								{sections.sort(classYearSorter).map(s => (
									<option key={s.id + s.class_id} value={s.id}>
										{s.namespaced_name}
									</option>
								))}
							</select>
							{!forwardTo && (
								<Popover className="inline">
									{({ open }) => (
										<>
											<Popover.Button
												as={'div'}
												className="hidden lg:inline-flex items-center tw-btn-blue rounded-3xl shadow-md">
												<span>Print</span>
												<PrinterIcon className="h-6 w-6 ml-4" />
											</Popover.Button>
											<Transition
												show={open}
												as={Fragment}
												enter="transition ease-out duration-200"
												enterFrom="opacity-0 translate-y-1"
												enterTo="opacity-100 translate-y-0"
												leave="transition ease-in duration-150"
												leaveFrom="opacity-100 translate-y-0"
												leaveTo="opacity-0 translate-y-1">
												<Popover.Panel
													static
													className="absolute z-10 max-w-sm px-4 mt-2 right-4 sm:px-0 w-60">
													<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-y-2">
														<button
															className="bg-white inline-flex items-center p-4 hover:bg-blue-brand w-full rounded-md hover:text-white"
															onClick={e => {
																onPrint()
															}}>
															<ViewListIcon className="w-6 mr-2" />
															<span>Students List</span>
														</button>
														<button
															className="bg-white inline-flex items-center p-4 hover:bg-blue-brand w-full hover:text-white rounded-md"
															onClick={e => {
																setFilter({
																	...state,
																	singleStudentPrintID: '',
																	printCards: true
																})

																setTimeout(() => {
																	onPrint()
																}, 2500)
															}}>
															<CreditCardIcon className="w-6 mr-2" />
															<span>Students Card</span>
														</button>
													</div>
												</Popover.Panel>
											</Transition>
										</>
									)}
								</Popover>
							)}
						</div>
					</div>

					<Paginate
						items={filteredStudents}
						itemsPerPage={10}
						numberOfBottomPages={3}
						renderComponent={listItem}
					/>
				</div>
				{!state.printCards
					? chunkify(
						filteredStudents,
						29,
						false
					).map((students: AugmentedStudent[], ChunkIndex: number) => (
						<StudentPrintableList
							schoolName={schoolName}
							chunkSize={ChunkIndex === 0 ? 0 : 29 * ChunkIndex}
							students={students}
							studentClass=""
							key={ChunkIndex + 1 * 29}
						/>
					))
					: chunkify(
						[
							...(state.singleStudentPrintID === ''
								? filteredStudents
								: [
									filteredStudents.find(
										s => s.id === state.singleStudentPrintID
									)
								])
						],
						8,
						false
					).map((students: AugmentedStudent[], index: number) => (
						<div
							key={8 * index}
							className="flex flex-1 h-screen font-serif  leading-tight">
							<StudenPrintableIDCardList
								students={students}
								key={index}
								schoolName={settings.schoolName}
								schoolLogo={assets?.schoolLogo || '/favicon.ico'}
								studentClass={''}
								schoolSession={schoolSession}
							/>
						</div>
					))}
			</>
		)
	}

	if (excludeNavHeader) {
		return renderListPage()
	}

	return (
		<AppLayout total={filteredStudents.length} title={pageTitle} showHeaderTitle>
			{renderListPage()}
		</AppLayout>
	)
}

type CardProps = {
	student: MISStudent
	sections: AugmentedSection[]
	schoolName: string
	schoolSession: MISSettings['schoolSession']
	printSingleStudentCard: (id: string) => void
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
