import React, { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment';
import { v4 } from 'node-uuid';

import Layout from '../../../components/Layout'
import downloadCSV from '../../../utils/downloadCSV'
import { createStudentMerges } from '../../../actions';

interface S {

	importedStudents: MISStudent[]

	loadingStudentImport: boolean
}

type P = {
	saveStudents: (student : MISStudent[]) => void
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

			// should check if admission numbers are unique
			// check RollNumber
			this.setState({
				loadingStudentImport: false,
				importedStudents: convertCSVToStudents(text)
			})
		}

		reader.onloadstart = () => {
			this.setState({
				loadingStudentImport: true
			})
		}

		reader.readAsText(file)
	}

	onSave = () => {
		
		this.props.saveStudents(this.state.importedStudents)

		this.setState({
			importedStudents: []
		})

	}

	render() {

		let student = this.state.importedStudents[0]

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
						<input type="file" accept=".csv" onChange={this.importStudentData}/>
					</div>

					{ this.state.loadingStudentImport && <div>Loading student import sheet....</div> }

					{ this.state.importedStudents.length > 0 && <div className="section">
						<div className="divider">Student Preview</div>

						<div className="row">
							<label>Total Number of Students</label>
							<div>{this.state.importedStudents.length}</div>
						</div>

						<div style={{textAlign: "center", fontSize: "1.1rem"}}>Example Student</div>

						<div className="row">
							<label>Name</label>
							<div>{student.Name}</div>
						</div>

						<div className="row">
							<label>Roll Number</label>
							<div>{student.RollNumber}</div>
						</div>

						<div className="row">
							<label>BForm</label>
							<div>{student.BForm}</div>
						</div>

						<div className="row">
							<label>Gender</label>
							<div>{student.Gender}</div>
						</div>

						<div className="row">
							<label>Phone</label>
							<div>{student.Phone}</div>
						</div>

						<div className="row">
							<label>Active</label>
							<div>{student.Active}</div>
						</div>

						<div className="row">
							<label>Father CNIC</label>
							<div>{student.ManCNIC}</div>
						</div>

						<div className="row">
							<label>Father Name</label>
							<div>{student.ManName}</div>
						</div>

						<div className="row">
							<label>Birthdate</label>
							<div>{student.Birthdate}</div>
						</div>

						<div className="row">
							<label>Address</label>
							<div>{student.Address}</div>
						</div>

						<div className="row">
							<label>Notes</label>
							<div>{student.Notes}</div>
						</div>

						<div className="row">
							<label>Start Date</label>
							<div>{moment(student.StartDate).format("DD/MM/YYYY")}</div>
						</div>

						<div className="row">
							<label>Admission Number</label>
							<div>{student.AdmissionNumber}</div>
						</div>

					</div> }

					<div className="save button" onClick={this.onSave}>Save</div>
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
			Gender: Gender.toLowerCase() == "m" ? "male" : ( Gender.toLowerCase() == "f" ? "female" : ""),
			Phone,
			Active: Active.toLowerCase() == "y" || Active.toLowerCase() == "yes" || Active.toLowerCase() == "true" || Active.toLowerCase() == "",
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

}), (dispatch : Function) => ({
	saveStudents: (students: MISStudent[]) => dispatch(createStudentMerges(students))
}))(withRouter(ExcelImport))