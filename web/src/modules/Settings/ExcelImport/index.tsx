import React, { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment';
import { v4 } from 'node-uuid';

import Layout from '../../../components/Layout'
import downloadCSV from '../../../utils/downloadCSV'

interface S {

	importedStudents: MISStudent[]

	loadingStudentImport: boolean
	loadingAmount: number
}

type P = {

} & RouteComponentProps

const studentCSVHeaders = [
	"Name",
	"RollNumber",
	"BForm",
	"Gender (M/F)",
	"Phone",
	"Active",
	"FatherCNIC",
	"FatherName",
	"Birthdate (dd/mm/yyyy)",
	"Address",
	"Notes",
	"StartDate (dd/mm/yyyy)",
	"AdmissionNumber"
]

class ExcelImport extends React.Component<P, S> {

	constructor(props : P) {
		super(props)

		this.state = {
			importedStudents: [],
			loadingStudentImport: false,
			loadingAmount: 0
		}
	}

	onStudentImportTemplateClick = () => {
		// download student import csv file
		downloadCSV([studentCSVHeaders], "student-import-template")
	}

	importStudentData = (e : ChangeEvent<HTMLInputElement>) => {
		
		const file = e.target.files[0]
		const reader = new FileReader();

		reader.onloadend = () => {
			const text = reader.result as string

			this.setState({
				loadingStudentImport: false
			})

			const students = convertCSVToStudents(text)
		}

		reader.onprogress = ev => {
			console.log(ev.total)
		}

		reader.onloadstart = () => {
			this.setState({
				loadingStudentImport: true
			})
		}

		reader.readAsText(file)
	}

	render() {

		return <Layout history={this.props.history}>
			<div className="excel-import">
				<div className="form" style={{width: "90%"}}>
					<div className="title">Excel Import</div>

					<div className="row">
						<label>Student Template CSV</label>
						<div className="button grey" onClick={this.onStudentImportTemplateClick}>Download</div>
					</div>

					<div className="row">
						<label>Upload Student Data CSV</label>
						<input type="file" onChange={this.importStudentData}/>
					</div>
				</div>
			</div>
		</Layout>
	}
}

const convertCSVToStudents = (studentImportCSV : string ) => {

	// naive csv parse, will break on commas.
	const lines = studentImportCSV.split('\n')
		.map(x => x.split(',').map(x => x.trim()))
		.filter(x => x.length === studentCSVHeaders.length)
		.slice(1) // ignore headers

	console.log(studentImportCSV)
	console.log(lines)
	
	// note that this is linked to the headers in the template above. see 
	const students = lines.map(([Name, RollNumber, BForm, Gender, Phone, Active, ManCNIC, ManName, Birthdate, Address, Notes, StartDate, AdmissionNumber]) => {
		const student : MISStudent = {
			id: v4(),
			Name,
			RollNumber,
			BForm,
			Gender,
			Phone,
			Active: Active.toLowerCase() == "y" || Active.toLowerCase() == "yes" || Active.toLowerCase() == "true",
			ManCNIC,
			ManName,
			Birthdate,
			Address,
			Notes,
			StartDate: StartDate ? moment(StartDate, "DD/MM/YYYY").unix() : new Date().getTime(), // shady...
			AdmissionNumber,
			Fee: 0,

			section_id: "",
			prospective_section_id: "",

			fees: { },
			payments: { },
			attendance: { },
			exams: { },
			tags: { }
		}
	
		return student;
	})

	// at this point should show some preview of the students
	// 
	console.log(students)

	return students;
	
}

export default connect(state => ({

}))(withRouter(ExcelImport))