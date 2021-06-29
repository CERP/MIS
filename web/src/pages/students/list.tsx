import React, { useMemo, useRef, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PrinterIcon, UsersIcon } from '@heroicons/react/outline'

import { AppLayout } from 'components/Layout/appLayout'
import { toTitleCase } from 'utils/toTitleCase'
import { isValidStudent } from 'utils'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import UserIconSvg from 'assets/svgs/user.svg'
import { SearchInput } from 'components/input/search'
import { AddStickyButton } from 'components/Button/add-sticky'
import Paginate from 'components/Paginate'
import { SwitchButton } from 'components/input/switch'
import { useComponentVisible } from 'hooks/useComponentVisible'
import moment from 'moment'
import QRCode from 'qrcode.react'
import chunkify from 'utils/chunkify'

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
	const students = useSelector((state: RootReducerState) => state.db.students, shallowEqual)
	const classes = useSelector((state: RootReducerState) => state.db.classes, shallowEqual)
	const searchInputRef = useRef(null)
	const settings = useSelector((state: RootReducerState) => state.db.settings)

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
			const searchAdmission = (s.AdmissionNumber ?? '').toLowerCase()
			const searchRollNo = (s.RollNumber ?? '').toLowerCase()
			const advanceFilterActive = state.searchByAdmissionNo || state.searchByRollNo

			return (
				isValidStudent(s) &&
				s.Active === state.active &&
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

	const onPrint = () => {
		window.print()

		setFilter({ ...state, singleStudentPrintID: '', printCards: false })
	}

	const pageTitle = `Students${forwardTo ? ' ' + toTitleCase(forwardTo) : ''}`

	const renderListPage = () => {
		return (
			<>
				<div className="relative p-5 md:p-10 md:pt-5 mb-10 md:mb-0 print:hidden">
					{!forwardTo && (
						<Link to="/students/new/menu">
							<AddStickyButton label="Add new Student" />
						</Link>
					)}

					<div className="flex flex-col items-center justify-between mt-4 mb-12 space-y-4 md:flex-row md:mb-20 md:space-y-0 md:space-x-60">
						<div ref={searchInputRef} className="md:w-9/12 w-full">
							<SearchInput
								showMenuButton
								showMenuCallback={() => setShowSearchMenu(true)}
								placeholder={
									'Search by ' +
									(state.searchByAdmissionNo
										? 'admission no'
										: state.searchByRollNo
										? 'roll number'
										: 'name, fname or phone')
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
								{sections
									.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
									.map(s => (
										<option key={s.id + s.class_id} value={s.id}>
											{toTitleCase(s.namespaced_name, '-')}
										</option>
									))}
							</select>
							{!forwardTo && (
								<>
									<button
										onClick={() => onPrint()}
										className="hidden lg:inline-flex items-center tw-btn-blue rounded-3xl shadow-md">
										<span>Print</span>
										<PrinterIcon className="h-6 w-6 ml-4" />
									</button>
									<div className="flex flex-col w-96 space-y-1">
										<div className="flex flex-row items-center">
											<input
												className="mr-2 tw-input outline-none"
												type="checkbox"
												checked={state.printCards}
												value="DisplayCards"
												name="gender"
												onChange={() =>
													setFilter({
														...state,
														printCards: !state.printCards
													})
												}
											/>
											Print Cards
										</div>
									</div>
								</>
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
					? chunkify(filteredStudents, 27, false).map(
							(students: MISStudent[], ChunkIndex: number) => {
								return (
									<table
										style={{ pageBreakInside: 'auto', breakInside: 'auto' }}
										id="printTable"
										cellSpacing={3}
										className=" my-10 mb-96 hidden border p-2 text-sm print:flex-col print:flex">
										<div className="text-center flex flex-1 text-2xl font-semibold items-center justify-center mb-4">
											{schoolName}
										</div>
										<tbody className="block">
											<tr>
												<th>SR#</th>
												<th>Name</th>
												<th>Father Name</th>
												<th className="px-6">DOB</th>
												<th>ADM Date</th>
												<th>ADM#</th>
												<th>Class</th>
												<th>Roll#</th>
												<th>Phone#</th>
											</tr>
											{students.map((student, index) => {
												return (
													<tr
														style={{
															pageBreakInside: 'avoid',
															breakInside: 'avoid',
															pageBreakAfter: 'auto',
															breakAfter: 'auto'
														}}>
														<td className="text-center border-2">
															{index + ChunkIndex * 27 + 1}
														</td>
														<td className="text-center border-2">
															{student.Name}
														</td>
														<td className="text-center border-2">
															{student.ManName || '-'}
														</td>
														<td className="text-center border-2">
															{student.Birthdate
																? moment(student.Birthdate).format(
																		'DD-MM-YYYY'
																  )
																: '-'}
														</td>
														<td className="text-center border-2">
															{student.StartDate
																? moment(student.StartDate).format(
																		'DD-MM-YYYY'
																  )
																: '-'}
														</td>{' '}
														<td className="text-center border-2">
															{student.AdmissionNumber || '-'}
														</td>
														<td className="text-center border-2">
															{sections.find(
																s => s.id === student.section_id
															).namespaced_name || '-'}
														</td>
														<td className="text-center border-2">
															{student.RollNumber || '-'}
														</td>
														<td className="text-center border-2">
															{student.Phone || '-'}
														</td>
													</tr>
												)
											})}{' '}
										</tbody>
									</table>
								)
							}
					  )
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
							6,
							false
					  ).map((students: MISStudent[], index: number) => {
							return (
								<div className="flex-row flex-wrap w-full items-center justify-evenly p-4 mb-96  hidden print:flex">
									{students.map(student => {
										return (
											<div className="flex flex-col w-5/12 mb-12 rounded-md max-h-64 border-2 p-4">
												<div className="flex flex-row text-center">
													<img
														className="max-w-6 max-h-6"
														src="/favicon.ico"
														alt="mischool"
													/>
													<div className="text-center font-bold ml-2 mt-2 flex flex-1 justify-center ">
														{schoolName}
													</div>
												</div>
												<div className="mt-2 flex flex-row">
													<div className="h-20 w-20 border-2">
														<img
															className="h-20 w-20 "
															src={
																student.ProfilePicture?.url ??
																student.ProfilePicture
																	?.image_string ??
																UserIconSvg
															}
														/>
													</div>
													<div className="flex flex-col ml-2 text-sm">
														<div className="flex flex-row">
															<h1 className="font-bold mr-1">
																Name:{' '}
															</h1>
															<h1>{student.Name}</h1>
														</div>
														<div className="flex flex-row">
															<h1 className="font-bold mr-1">
																Class:{' '}
															</h1>
															{sections.find(
																s => s.id === student.section_id
															).namespaced_name || '-'}{' '}
														</div>
														<div className="flex flex-row">
															<h1 className="font-bold mr-1">
																Roll #:{' '}
															</h1>
															<h1> {student.RollNumber || '-'}</h1>
														</div>
														<div className="flex flex-row">
															<h1 className="font-bold mr-1">
																Valid For:{' '}
															</h1>
															<h1>
																{schoolSession.startYear}-
																{schoolSession.endYear}
															</h1>
														</div>
													</div>
												</div>
												<div className="flex flex-wrap justify-between">
													<div className="mt-6">
														<h1>_________________</h1>
														<h1>Issuing Authority</h1>
													</div>
													<QRCode value={student.id} size={68} />
												</div>
											</div>
										)
									})}
								</div>
							)
					  })}
				)
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

const Card = ({
	student,
	sections,
	schoolName,
	schoolSession,
	printSingleStudentCard
}: CardProps) => {
	const studentSection = sections.find(s => s.id === student.section_id)

	return (
		<>
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
				<div
					onClick={e => {
						e.preventDefault()
						printSingleStudentCard(student.id)
					}}
					className=" z-50 absolute top-2 right-2 px-3 py-1 text-xs rounded-md hidden lg:block transition-all hover:bg-blue-brand bg-gray-700 text-white">
					Print Student Card
				</div>
			</div>

			<div className="hidden">
				<div
					id="studentCardPrint"
					className="flex flex-col w-5/12 mb-12 rounded-md max-h-64 border-2 p-4">
					<div className="flex flex-row text-center">
						<img className="max-w-6 max-h-6" src="/favicon.ico" alt="mischool" />
						<div className="text-center font-bold ml-2 mt-2 flex flex-1 justify-center ">
							{schoolName}
						</div>
					</div>
					<div className="mt-2 flex flex-row">
						<div className="h-20 w-20 border-2">
							<img
								className="h-20 w-20 "
								src={
									student.ProfilePicture?.url ??
									student.ProfilePicture?.image_string ??
									UserIconSvg
								}
							/>
						</div>
						<div className="flex flex-col ml-2 text-sm">
							<div className="flex flex-row">
								<h1 className="font-bold mr-1">Name: </h1>
								<h1>{student.Name}</h1>
							</div>
							<div className="flex flex-row">
								<h1 className="font-bold mr-1">Class: </h1>
								{sections.find(s => s.id === student.section_id).namespaced_name ||
									'-'}
							</div>
							<div className="flex flex-row">
								<h1 className="font-bold mr-1">Roll #: </h1>
								<h1> {student.RollNumber || '-'}</h1>
							</div>
							<div className="flex flex-row">
								<h1 className="font-bold mr-1">Valid For: </h1>
								<h1>
									{moment(schoolSession.start_date ?? 0).format('YYYY')}-
									{moment(schoolSession.start_date ?? 0).format('YYYY')}
								</h1>
							</div>
						</div>
					</div>
					<div className="flex flex-wrap justify-between">
						<div className="mt-6">
							<h1>_________________</h1>
							<h1>Issuing Authority</h1>
						</div>
						<QRCode value={student.id} size={68} />
					</div>
				</div>
			</div>
		</>
	)
}
