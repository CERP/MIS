import React, { useCallback, useMemo, useState } from 'react'
import Papa from 'papaparse'
import { v4 } from 'node-uuid'
import { useSelector } from 'react-redux'
import moment from 'moment'

import downloadCSV from 'utils/downloadCSV'
import toTitleCase from 'utils/toTitleCase'
import { formatCNIC, formatPhone } from 'utils'

import UserIconSvg from 'assets/svgs/user.svg'
import { TextDivider } from 'components/divider'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { AddStudentForm } from './add'

interface AddStudentProps {
	onBack?: (close: boolean) => void
	skipStage?: () => void
}

type TState = {
	importedStudents: MISStudent[]
	isUploadingCSV: boolean
	uploadedFileName: string
}

const initialState: TState = {
	importedStudents: [] as MISStudent[],
	isUploadingCSV: false,
	uploadedFileName: ''
}

const studentCSVHeaders = [
	"Name",
	"RollNumber",
	"BForm",
	"Gender (M/F)",
	"Phone",
	"Active (Yes/No)",
	"FatherCNIC",
	"FatherName",
	"Birthdate (dd/mm/yyyy)",
	"Address",
	"Notes",
	"StartDate (dd/mm/yyyy)",
	"AdmissionNumber"
]

export const AddStudent: React.FC<AddStudentProps> = ({ }) => {

	const { classes, students, faculty } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState(initialState)

	const defaultSection = useMemo(() => {
		const sections = getSectionsFromClasses(classes)
		return sections?.[0]
	}, [classes])

	const sectionTeacherName = useMemo(() => {

		if (!defaultSection)
			return 'Teacher not Assigned'

		const teacher = Object.values(faculty)
			.find((f => f.id === defaultSection.faculty_id))

		return teacher ? teacher.Name : 'Teacher not Assigned'

	}, [defaultSection, faculty])

	const downloadCSVTemplate = useCallback(() => {
		downloadCSV([studentCSVHeaders], "student-import-template")
	}, [])

	const handleUploadCSV = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {

		const convertCSVToStudents = (studentImportCSV: string) => {

			const { data } = Papa.parse(studentImportCSV)

			const items: string[] = data
				.filter((x: any) => x.length === studentCSVHeaders.length)
				.slice(1) as string[]// ignore headers

			// note that this is linked to the headers in the template above. see
			const students = items
				.map(([Name, RollNumber, BForm, Gender, Phone, Active, ManCNIC, ManName, Birthdate, Address, Notes, StartDate, AdmissionNumber]) => {

					const student: MISStudent = {
						id: v4(),
						Name: toTitleCase(Name),
						RollNumber,
						BForm: formatCNIC(BForm),
						Gender: Gender.toLowerCase() === "m" ? "male" : (Gender.toLowerCase() === "f" ? "female" : ""),
						Phone: formatPhone(Phone),
						Active: Active.toLowerCase() === "y" || Active.toLowerCase() === "yes" || Active.toLowerCase() === "true" || Active.toLowerCase() === "",
						ManCNIC: formatCNIC(ManCNIC),
						ManName: toTitleCase(ManName),
						Birthdate,
						Address,
						Notes,
						StartDate: StartDate ? moment(StartDate, "DD/MM/YYYY").unix() * 1000 : new Date().getTime(), // shady...
						AdmissionNumber,
						Fee: 0,

						section_id: "",
						BloodType: "",
						prospective_section_id: "",

						fees: {},
						payments: {},
						attendance: {},
						exams: {},
						tags: {},
						certificates: {},
						diagnostic_result: {},
						learning_levels: {}
					}

					return student
				})

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
	}, [])


	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center rounded-2xl bg-gray-700 my-4 md:mt-8">
			<div className="w-4/5 md:w-2/5 mb-6">
				<div className="text-white text-center text-base my-5">Adding Students to {defaultSection?.namespaced_name}</div>

				<div className="flex items-center flex-row my-4">
					<img className="w-20 h-20 rounded-full" src={UserIconSvg} alt="user-logo" />
					<div className="flex flex-col space-y-1 text-sm text-white ml-10">
						<div className="text-semibold">{sectionTeacherName}</div>
						<div>{defaultSection?.className}</div>
						<div>{defaultSection.name} Section</div>
					</div>
				</div>

				{
					Object.keys(students).length === 0 ?
						<>
							<div className="space-y-4 pb-2">
								<button type="button" className="inline-flex w-full tw-btn bg-orange-brand text-white" onClick={downloadCSVTemplate}>
									<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
									</svg>
									<span className="mx-auto">Download Template</span>
								</button>
								<button type="button" className="inline-flex w-full tw-btn text-white bg-teal-500">
									<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
									</svg>
									<label className="w-full mx-auto">
										<input type="file" className="hidden" onChange={handleUploadCSV} accept=".csv" />
										<span>Upload Excel File</span>
									</label>
								</button>
							</div>

							<TextDivider textColor="text-white" />
						</>
						:
						<div className="w-full max-h-40 overflow-y-scroll">
							<div className="space-y-2">
								{
									Object.values(students)
										.filter(s => s.Name)
										.sort((a, b) => a.Name.localeCompare(b.Name))
										.map(s => (
											<div key={s.id + s.section_id} className="bg-white flex justify-between p-2 px-4 rounded w-full">
												<div className="text-sm">{s.Name}</div>
												<div className="text-sm">{s.ManName}</div>
												<div className="text-sm">{s.Phone}</div>
											</div>
										))
								}
							</div>
						</div>
				}

				<AddStudentForm section={defaultSection} />

				<div className="w-full flex flex-row items-center space-x-2 mt-4">
					<button type="button" className="w-full tw-btn bg-orange-brand text-white">Skip</button>
					<button type="button" className="w-full tw-btn bg-teal-500 text-white">Finish</button>
				</div>
			</div>
		</div>
	)
}