import React, { useCallback } from 'react'
import Papa from 'papaparse'
import { v4 } from 'node-uuid'
import { useSelector } from 'react-redux'
import moment from 'moment'

import downloadCSV from 'utils/downloadCSV'
import toTitleCase from 'utils/toTitleCase'
import { formatCNIC, formatPhone } from 'utils'

import UserIconSvg from 'assets/svgs/user.svg'

type TAddStudentProps = {

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

export const AddStudent: React.FC<TAddStudentProps> = ({ }) => {

	const { classes, settings, } = useSelector((state: RootReducerState) => state.db)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

	}

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

		const reader = new FileReader()

		reader.onloadend = () => {

			const text = reader.result as string
			const importedStudents = convertCSVToStudents(text)

			// do something with uploaded data
		}

		reader.onloadstart = () => {
			// do something here to show some stuff
		}

		reader.readAsText(file)
	}, [])

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center rounded-2xl bg-gray-700 my-4 md:mt-8">

			<div className="text-white text-center text-base my-5">Adding Students to Class 5</div>

			<div className="w-4/5 flex items-center flex-row my-4">
				<img className="w-20 h-20 rounded-full" src={UserIconSvg} alt="user-logo" />
				<div className="flex flex-col space-y-1 text-sm text-white ml-10">
					<div className="text-semibold">Rohullah</div>
					<div>Class 5</div>
					<div>Rainbow Section</div>
				</div>
			</div>


			<form id='admin-account' className="text-white space-y-4 px-4 mt-4" onSubmit={handleSubmit}>
				<div className="space-y-4">
					<button type="button" className="inline-flex w-full tw-btn bg-orange-brand text-white" onClick={downloadCSVTemplate}>
						<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						<span className="mx-auto">Download Template</span>
					</button>
					<button type="button" className="inline-flex w-full tw-btn text-white bg-teal-500">
						<label>
							<input type="file" aria-label="file-browser" onChange={handleUploadCSV} accept=".csv" />
						</label>
						<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
						</svg>
						<span className="mx-auto">Upload Excel File</span>
					</button>
				</div>

				<div>
					<div className="mt-8 mb-6 relative h-px bg-white">
						<div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
							<span className="bg-gray-700 px-4 text-xs text-white uppercase">or</span>
						</div>
					</div>
				</div>

				<div className="text-center">Add Students Data Manually</div>

				<div className="">Name*</div>
				<input
					name="Name"
					type="text"
					required
					placeholder="e.g. John Doe"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Father Name*</div>
				<input
					name="ManName"
					type="text"
					required
					placeholder="e.g. John Doe"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Contact Number*</div>
				<input
					name="Phone"
					type="number"
					required
					placeholder="e.g. 03xxxxxxxx"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />

				<div className="flex flex-col justify-center">
					<button type="submit" className="tw-btn-blue py-3 font-semibold my-4">
						Save and Add new Student
					</button>
					<div className="flex flex-row items-center space-x-2">
						<button type="button" className="w-full tw-btn bg-orange-brand text-white">Skip</button>
						<button type="button" className="w-full tw-btn bg-teal-500 text-white">Finish</button>
					</div>
				</div>
				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
		</div>
	)
}