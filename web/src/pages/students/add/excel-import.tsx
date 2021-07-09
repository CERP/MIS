import React, { Fragment, useCallback, useState } from 'react'
import Papa from 'papaparse'
import moment from 'moment'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { Popover, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'node-uuid'
import { Redirect } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { toTitleCase } from 'utils/toTitleCase'
import { classYearSorter, formatCNIC, formatPhone } from 'utils'
import { createStudentMerges } from 'actions'
import downloadCSV from 'utils/downloadCSV'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { DotsVerticalIcon, DownloadIcon, TrashIcon, UploadIcon } from '@heroicons/react/outline'

type State = {
	classId: string
	sectionId: string
	importedStudents: MISStudent[]
	isUploadingCSV: boolean
	uploadedFileName: string
	redirectTo: string
}

const initialState: State = {
	classId: '',
	sectionId: '',
	importedStudents: [] as MISStudent[],
	isUploadingCSV: false,
	uploadedFileName: '',
	redirectTo: ''
}

// TODO: move to single source of import
const studentCSVHeaders = [
	'Name',
	'RollNumber',
	'BForm',
	'Gender (M/F)',
	'Phone',
	'Active (Yes/No)',
	'FatherCNIC',
	'FatherName',
	'Birthdate (dd/mm/yyyy)',
	'Address',
	'Notes',
	'StartDate (dd/mm/yyyy)',
	'AdmissionNumber'
]

export const ImportStudentsCSV = () => {
	const dispatch = useDispatch()
	const { classes } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState(initialState)

	const handleUploadCSV = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const convertCSVToStudents = (studentImportCSV: string) => {
				const { data } = Papa.parse(studentImportCSV)

				const items: string[] = data
					.filter((x: any) => x.length === studentCSVHeaders.length)
					.slice(1) as string[] // ignore headers

				// note that this is linked to the headers in the template above. see
				const students = items.map(
					([
						Name,
						RollNumber,
						BForm,
						Gender,
						Phone,
						Active,
						ManCNIC,
						ManName,
						Birthdate,
						Address,
						Notes,
						StartDate,
						AdmissionNumber
					]) => {
						const student: MISStudent = {
							id: v4(),
							Name: toTitleCase(Name),
							RollNumber,
							BForm: formatCNIC(BForm),
							Gender:
								Gender.toLowerCase() === 'm'
									? 'male'
									: Gender.toLowerCase() === 'f'
										? 'female'
										: '',
							Phone: formatPhone(Phone),
							Active:
								Active.toLowerCase() === 'y' ||
								Active.toLowerCase() === 'yes' ||
								Active.toLowerCase() === 'true' ||
								Active.toLowerCase() === '',
							ManCNIC: formatCNIC(ManCNIC),
							ManName: toTitleCase(ManName),
							Birthdate,
							Address,
							Notes,
							StartDate: StartDate
								? moment(StartDate, 'DD/MM/YYYY').unix() * 1000
								: new Date().getTime(), // shady...
							AdmissionNumber,
							Fee: 0,

							section_id: state.sectionId,
							BloodType: '',
							prospective_section_id: '',

							fees: {},
							payments: {},
							attendance: {},
							exams: {},
							tags: {},
							certificates: {}
						}

						return student
					}
				)

				return students
			}

			const file = event.target.files[0]

			if (file === undefined) {
				return
			}

			const reader = new FileReader()

			reader.onloadend = () => {
				const text = reader.result as string
				const importedStudents = convertCSVToStudents(text)

				setState({
					...state,
					isUploadingCSV: false,
					importedStudents: importedStudents,
					uploadedFileName: file.name
				})
			}

			reader.onloadstart = () => {
				setState({ ...state, isUploadingCSV: true })
			}

			reader.readAsText(file)
		},
		[state]
	)

	const saveImportedStudents = () => {
		dispatch(createStudentMerges(state.importedStudents))

		toast.success('Students has been saved.')

		setTimeout(() => {
			setState({ ...state, redirectTo: '/students' })
		}, 1000)
	}

	if (state.redirectTo) {
		return <Redirect to={state.redirectTo} />
	}

	const removeStudent = (studentId: string) => {
		const remainingStudents = state.importedStudents.filter(student => student.id !== studentId)

		setState({
			...state,
			importedStudents: remainingStudents
		})
	}

	return (
		<AppLayout title="Add Students - Excel Import" showHeaderTitle>
			<div className="relative p-5 space-y-8 md:p-10 md:pt-5 print:hidden">
				<div className="pb-2 space-y-4">
					<div className="flex md:justify-end">
						<button
							type="button"
							className="inline-flex w-full md:w-60 text-white tw-btn bg-orange-brand"
							onClick={() =>
								downloadCSV([studentCSVHeaders], 'student-import-template')
							}>
							<DownloadIcon className="w-5 h-5" />
							<span className="mx-auto">Download Template</span>
						</button>
					</div>

					<div className="bg-gray-700 rounded-lg">
						<div className="flex flex-row items-center p-5 space-x-4">
							<div className="flex flex-col w-full space-y-2">
								<div className="text-white">Class</div>
								<select
									name="classId"
									value={state.classId}
									onChange={e =>
										setState({
											...state,
											sectionId: '',
											classId: e.target.value
										})
									}
									className="tw-select">
									<option value={''}>Select Class</option>
									{Object.values(classes)
										.filter(c => c)
										.sort(classYearSorter)
										.map(c => (
											<option key={c.id} value={c.id}>
												{toTitleCase(c.name)}
											</option>
										))}
								</select>
							</div>
							<div className="flex flex-col w-full space-y-2">
								<div className="text-white">Section</div>
								<select
									name="sectionId"
									value={state.sectionId}
									onChange={e =>
										setState({ ...state, sectionId: e.target.value })
									}
									className="tw-select">
									<option value={''}>Select Section</option>
									{getSectionsFromClasses(
										state.classId
											? { [state.classId]: classes[state.classId] }
											: {}
									)
										.sort(classYearSorter)
										.filter(s => s && s.id && s.name)
										.map(s => (
											<option key={s.id} value={s.id}>
												{s.namespaced_name}
											</option>
										))}
								</select>
							</div>
						</div>
					</div>
					<button
						disabled={!state.sectionId}
						type="button"
						className={clsx('inline-flex w-full tw-btn text-white bg-blue-300', {
							'bg-blue-brand': state.sectionId
						})}>
						<UploadIcon className="w-5 h-5" />
						<label className="w-full mx-auto cursor-pointer">
							<input
								disabled={!state.sectionId}
								onChange={handleUploadCSV}
								type="file"
								className="hidden"
								accept=".csv"
							/>
							<span>{state.uploadedFileName || 'Upload Excel File'}</span>
						</label>
					</button>
					{state.importedStudents.length > 0 && (
						<div className="mt-4">
							<div className="w-full h-48 md:h-screen overflow-y-scroll text-xs md:text-base rounded-md">
								<div className="table w-full">
									<div className="table-row-group bg-white">
										{state.importedStudents
											.filter(s => s.Name)
											.sort((a, b) => a.Name.localeCompare(b.Name))
											.map(s => (
												<div
													key={s.id + s.section_id}
													className="table-row">
													<div className="table-cell px-2">{s.Name}</div>
													<div className="table-cell px-2">
														{s.ManName}
													</div>
													<div className="table-cell px-2">{s.Phone}</div>
													<Popover className="relative table-cell p-2 pt-0">
														{({ open }) => (
															<>
																<Popover.Button
																	as={'div'}
																	className={clsx(
																		'px-3 py-2 rounded-md inline-flex items-center text-gray-400 cursor-pointer',
																		{
																			'text-teal-brand': open
																		}
																	)}>
																	<DotsVerticalIcon
																		className={clsx('w-5')}
																	/>
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
																		<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
																			<div className="relative bg-white p-4 w-full">
																				<button
																					className="inline-flex items-center p-2 hover:bg-gray-300 group w-full rounded-md"
																					onClick={() =>
																						removeStudent(
																							s.id
																						)
																					}>
																					<TrashIcon className="w-6 md:w-8 text-red-brand mr-2 md:mr-4" />
																					<span className="group-hover:text-white text-sm md:text-base">
																						Delete
																					</span>
																				</button>
																			</div>
																		</div>
																	</Popover.Panel>
																</Transition>
															</>
														)}
													</Popover>
													<Popover className="relative">
														<Popover.Button></Popover.Button>

														<Popover.Panel className="absolute z-10">
															<div className="grid grid-cols-2">
																<a href="/analytics">Analytics</a>
																<a href="/engagement">Engagement</a>
																<a href="/security">Security</a>
																<a href="/integrations">
																	Integrations
																</a>
															</div>
														</Popover.Panel>
													</Popover>
												</div>
											))}
									</div>
								</div>
							</div>
							<button
								type="button"
								onClick={saveImportedStudents}
								className="w-full mt-4 text-white tw-btn bg-teal-brand">
								Save
							</button>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	)
}
