import React, { useCallback, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Papa from 'papaparse'
import { v4 } from 'node-uuid'
import moment from 'moment'
import clsx from 'clsx'
import toast from 'react-hot-toast'

import downloadCSV from 'utils/downloadCSV'
import { formatCNIC, formatPhone } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'

import { TextDivider } from 'components/divider'
import { AddStudentForm } from './add'
import { createStudentMerges, deleteStudentById } from 'actions'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import UserIconSvg from 'assets/svgs/user.svg'

interface AddStudentProps {
	onBack?: (close: boolean) => void
	skipStage: (stage?: MISOnboarding['stage']) => void
}

type State = {
	importedStudents: MISStudent[]
	isUploadingCSV: boolean
	uploadedFileName: string
}

const initialState: State = {
	importedStudents: [] as MISStudent[],
	isUploadingCSV: false,
	uploadedFileName: ''
}

// TODO: move to single source of defaults
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

const MAX_STUDENTS = 40

export const AddStudent: React.FC<AddStudentProps> = ({ skipStage }) => {
	const dispatch = useDispatch()

	const { classes, students, faculty } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState(initialState)

	const defaultSection = useMemo(() => {
		const sections = getSectionsFromClasses(classes)
		return sections?.[0]
	}, [classes])

	const sectionTeacher = useMemo((): MISTeacher => {
		if (!defaultSection) return

		return Object.values(faculty).find(f => f.id === defaultSection.faculty_id)
	}, [defaultSection, faculty])

	const downloadCSVTemplate = useCallback(() => {
		downloadCSV([studentCSVHeaders], 'student-import-template')
	}, [])

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

							section_id: defaultSection.id,
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

			setState({ ...state, uploadedFileName: file.name })

			const reader = new FileReader()

			reader.onloadend = () => {
				const text = reader.result as string
				const importedStudents = convertCSVToStudents(text)

				setState({ ...state, isUploadingCSV: false, importedStudents })
			}

			reader.onloadstart = () => {
				setState({ ...state, isUploadingCSV: true })
			}

			reader.readAsText(file)
		},
		[state]
	)

	const deleteStudent = (id: string) => {
		dispatch(deleteStudentById(id))
	}

	const saveImportedStudents = () => {
		dispatch(createStudentMerges(state.importedStudents))
		toast.success('Students have been saved.')
		setState({ ...state, importedStudents: [] })
	}

	const isMoreThanMaxStudents = Object.keys(students).length > MAX_STUDENTS

	// TODO: add modal to show the details of imported student

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center rounded-2xl bg-gray-700 my-4 py-4 md:mt-8">
			<div className="w-4/5 md:w-2/5 space-y-4">
				<div className="text-white text-center text-base ">
					Adding Students to {defaultSection?.namespaced_name}
				</div>

				<div className="flex items-center flex-row">
					<img
						className="w-20 h-20 rounded-full"
						src={
							sectionTeacher?.ProfilePicture?.url ||
							sectionTeacher?.ProfilePicture?.image_string ||
							UserIconSvg
						}
						alt="user-logo"
					/>
					<div className="flex flex-col space-y-1 text-sm text-white ml-10">
						<div className="text-semibold">
							{toTitleCase(sectionTeacher?.Name || 'teacher not assigned')}
						</div>
						<div>{defaultSection?.className}</div>
						<div>{defaultSection.name} Section</div>
					</div>
				</div>

				{Object.keys(students).length === 0 ? (
					<>
						<div className="space-y-4 pb-2">
							<button
								type="button"
								className="inline-flex w-full tw-btn bg-orange-brand text-white"
								onClick={downloadCSVTemplate}>
								{/* TODO: move these svg to separate component in separate file */}
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
							<button
								type="button"
								className="inline-flex w-full tw-btn text-white bg-teal-500">
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
								<label className="w-full mx-auto">
									<input
										type="file"
										className="hidden"
										onChange={handleUploadCSV}
										accept=".csv"
									/>
									<span>Upload Excel File</span>
								</label>
							</button>
						</div>

						{state.importedStudents.length > 0 ? (
							<div className="my-4">
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
														<div className="table-cell px-2">
															{s.Name}
														</div>
														<div className="table-cell px-2">
															{s.ManName}
														</div>
														<div className="table-cell px-2">
															{s.Phone}
														</div>
														<div className="table-cell p-2">
															{/* TODO: add logic to render TModal here and display the students */}
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
							</div>
						) : (
							<TextDivider textColor="text-white" />
						)}
					</>
				) : (
					<div
						className={clsx(
							'w-full h-20 overflow-y-scroll text-xs md:text-base rounded-md',
							{ 'h-72': isMoreThanMaxStudents }
						)}>
						<div className="table w-full">
							<div className="table-row-group bg-white">
								{Object.values(students)
									.filter(s => s.Name)
									.sort((a, b) => a.Name.localeCompare(b.Name))
									.map(s => (
										<div key={s.id + s.section_id} className="table-row">
											<div className="table-cell px-2">{s.Name}</div>
											<div className="table-cell px-2">{s.ManName}</div>
											<div className="table-cell px-2">{s.Phone}</div>
											<div
												className="table-cell p-2"
												onClick={() => deleteStudent(s.id)}>
												<svg
													className="w-4 text-red-brand mx-auto"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="currentColor">
													<path
														fillRule="evenodd"
														d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
				)}

				{!isMoreThanMaxStudents &&
					(state.importedStudents.length === 0 ? (
						<AddStudentForm section={defaultSection} />
					) : (
						<button
							onClick={saveImportedStudents}
							className="w-full tw-btn-blue py-3 font-semibold">
							Save Students
						</button>
					))}

				<div className="w-full flex flex-row items-center space-x-2 mt-4">
					<button
						type="button"
						onClick={() => skipStage()}
						className="w-full tw-btn bg-orange-brand text-white">
						Skip
					</button>
					<button
						type="button"
						onClick={() => skipStage()}
						className="w-full tw-btn bg-teal-500 text-white">
						Finish
					</button>
				</div>
			</div>
		</div>
	)
}
