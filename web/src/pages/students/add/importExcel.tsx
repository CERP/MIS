import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'node-uuid'
import { Redirect } from 'react-router-dom'
import Papa from 'papaparse'
import moment from 'moment'
import clsx from 'clsx'
import toast from 'react-hot-toast'

import { AppLayout } from 'components/Layout/appLayout'
import { toTitleCase } from 'utils/toTitleCase'
import { formatCNIC, formatPhone } from 'utils'
import { createStudentMerges } from 'actions'
import downloadCSV from 'utils/downloadCSV'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

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

	// TODO: SVGs to common source of import
	// TODO: add modal to preview student

	return (
		<AppLayout title="Excel Import">
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative print:hidden space-y-8">
				<div className="text-center font-bold text-2xl">Add Students</div>
				<div className="space-y-4 pb-2">
					<button
						type="button"
						className="inline-flex w-full tw-btn bg-orange-brand text-white"
						onClick={() => downloadCSV([studentCSVHeaders], 'student-import-template')}>
						<svg
							className="w-5 h-5"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						<span className="mx-auto">Download Template</span>
					</button>

					<div className="bg-gray-700 rounded-lg">
						<div className="flex flex-row items-center space-x-4 text-white p-5">
							<div className="flex flex-col space-y-4 w-full">
								<div>Class</div>
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
									className="tw-select bg-transparent border-blue-brand ring-1">
									<option value={''}>Select Class</option>
									{Object.values(classes)
										.filter(c => c)
										.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
										.map(c => (
											<option key={c.id} value={c.id}>
												{toTitleCase(c.name)}
											</option>
										))}
								</select>
							</div>
							<div className="flex flex-col space-y-4 w-full">
								<div>Section</div>
								<select
									name="sectionId"
									value={state.sectionId}
									onChange={e =>
										setState({ ...state, sectionId: e.target.value })
									}
									className="tw-select bg-transparent border-blue-brand ring-1">
									<option value={''}>Select Section</option>
									{getSectionsFromClasses(
										state.classId
											? { [state.classId]: classes[state.classId] }
											: {}
									)
										.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
										.filter(s => s && s.id && s.name)
										.map(s => (
											<option key={s.id} value={s.id}>
												{toTitleCase(s.namespaced_name, '-')}
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
						<svg
							className="w-5 h-5"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
							/>
						</svg>
						<label className="w-full mx-auto cursor-pointer">
							<input
								disabled={!state.sectionId}
								onChange={handleUploadCSV}
								type="file"
								className="hidden"
								accept=".csv"
							/>
							<span>Upload Excel File</span>
						</label>
					</button>
					{state.importedStudents.length > 0 && (
						<div className="mt-4">
							<div className="text-center">{state.uploadedFileName}</div>
							<div
								className={
									'w-full h-48 overflow-y-scroll text-xs md:text-base rounded-md'
								}>
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
													<div className="table-cell p-2">
														<svg
															className="w-4 text-gray-400 mx-auto"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
															fill="currentColor">
															<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
														</svg>
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
							<button
								type="button"
								onClick={saveImportedStudents}
								className="w-full tw-btn bg-teal-500 text-white mt-4">
								Save
							</button>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	)
}
