import React, { useState } from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import moment from 'moment'

import { Transition } from '@headlessui/react'
import { SearchInput } from 'components/input/search'
import { isValidStudent } from 'utils'

import UserIconSvg from 'assets/svgs/user.svg'
import toTitleCase from 'utils/toTitleCase'
import cond from 'cond-construct'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { type } from 'os'
import toast from 'react-hot-toast'
import months from 'constants/months'
type State = {
	printFor: 'STUDENT' | 'CLASS' | 'FAMILY'
	id: string
	month: string
	year: string
}

export const PrintVoucher = () => {
	const { settings, classes, students } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		printFor: 'STUDENT',
		id: '',
		month: '',
		year: ''
	})

	const [month, setMonth] = useState(moment().format('YYYY-MM'))
	const [year, setYear] = useState('')

	const setId = (sid: string) => {
		setState({ ...state, id: sid })
	}

	const renderAddView = () => {
		return cond([
			[
				state.printFor === 'STUDENT',
				<AddFeeToStudent key={state.printFor} students={students} setStudentId={setId} />
			],
			[
				state.printFor === 'CLASS',
				<AddFeeToClass key={state.printFor} classes={classes} setClassId={setId} />
			],
			[
				state.printFor === 'FAMILY',
				<FamilyDropdown key={state.printFor} students={students} setFamilyId={setId} />
			]
		])
	}

	const getPreviewRoute = (): string => {
		if (state.id === '') {
			toast.error('Nothing Selected')
		}
		return `${window.location.pathname}/print-preview?type=${state.printFor}&id=${state.id}&month=${month}&year=${year}`
	}

	return (
		<AppLayout title={'Print Voucher'}>
			<div className="p-5 md:p-10 md:pb-0 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">Print Voucher</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-4 rounded-2xl bg-gray-700 p-4 my-4 md:mt-8 text-white min-h-screen">
					<div className="flex flex-row items-center justify-between w-full md:w-3/5 ">
						<select
							className="tw-select bg-transparent bg-gray-700 mr-1 border-blue-brand w-full text-white"
							onChange={e => setMonth(e.target.value)}
							value={month}>
							<option value=""> Month</option>
							{months.map(month => {
								return (
									<option key={month} value={month}>
										{month}
									</option>
								)
							})}
						</select>
						<select
							className="tw-select bg-transparent bg-gray-700 border-green-brand w-full text-white"
							onChange={e => setYear(e.target.value)}
							value={year}>
							<option value="">Year</option>
							{[...Array(30)].map((e, i) => (
								<option key={i} value={`${2000 + (i + 1)}`}>
									{2000 + (i + 1)}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-6 w-full md:w-3/5">
						<div className="">Print Voucher for</div>
						<div className="flex items-center flex-wrap justify-between">
							<div className="flex items-center">
								<input
									type="radio"
									onChange={() => setState({ ...state, printFor: 'STUDENT' })}
									checked={state.printFor === 'STUDENT'}
									className="mr-2 w-4 h-4 cursor-pointer"
								/>
								<div className="text-sm">Student</div>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									onChange={() => setState({ ...state, printFor: 'CLASS' })}
									checked={state.printFor === 'CLASS'}
									className="mr-2 w-4 h-4 cursor-pointer"
								/>
								<div className="text-sm">Class</div>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									onChange={() => setState({ ...state, printFor: 'FAMILY' })}
									checked={state.printFor === 'FAMILY'}
									className="mr-2 w-4 h-4 cursor-pointer"
								/>
								<div className="text-sm">Family</div>
							</div>
						</div>
						{renderAddView()}
					</div>
					{state.id && (
						<Link
							to={getPreviewRoute}
							className="tw-btn-blue w-full font-semibold text-center m-8">
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
			<div>Select Family</div>
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

interface AddFeeToClassProps {
	classes: RootDBState['classes']
	setClassId: (cid: string) => void
}

export const AddFeeToClass = ({ classes, setClassId }: AddFeeToClassProps) => {
	return (
		<>
			<div>Select Class</div>
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

interface AddFeeToStudentProps {
	students: RootDBState['students']
	setStudentId: (sid: string) => void
}

export const AddFeeToStudent = ({ students, setStudentId }: AddFeeToStudentProps) => {
	const [searchText, setSearchText] = useState('')
	const [student, setStudent] = useState<MISStudent>()

	return (
		<>
			<div>Select Student</div>
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
						{Object.values(students)
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
										<div>{s.Name}</div>
									</div>
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
					className="flex flex-row items-center justify-between py-3 px-2 text-gray-900 rounded-full bg-white">
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
					<button
						onClick={() => {
							setStudent(undefined)
							setStudentId('')
						}}
						className="cursor-pointer flex items-center justify-center w-6 h-6 text-white bg-red-brand rounded-full p-1">
						x
					</button>
				</Transition>
			}
		</>
	)
}
