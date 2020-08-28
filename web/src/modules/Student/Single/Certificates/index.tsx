import React, { Component, FC } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import moment from 'moment'
import { capitalize } from 'utils/capitalize'
import { getGenderSpecificText } from "utils/getGenderSpecificText"
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'

import './style.css'
import Former from 'utils/former'
import { PrintHeader } from 'components/Layout'
import { issueCertificate } from 'actions'

interface P {
	students: RootDBState['students']
	teachers: RootDBState["faculty"]
	settings: RootDBState["settings"]
	schoolLogo: RootDBState["assets"]["schoolLogo"]
	classes: RootDBState["classes"]
	curr_teacher: string
	issueCertificate: (type: string, student_id: string, faculty_id: string) => void
}

interface S {
	selectedCertificate: string
}

interface RouteInfo {
	id: string
}

type propTypes = RouteComponentProps<RouteInfo> & P

class StudentCertificates extends Component<propTypes, S> {

	former: Former
	constructor(props: propTypes) {
		super(props)

		this.state = {
			selectedCertificate: "CHARACTER"
		}

		this.former = new Former(this, [])
	}

	student = (): MISStudent => {
		const id = this.props.match.params.id
		return this.props.students[id]
	}

	getSelectedCertificate = (relvSection: any) => {

		const { settings } = this.props

		const { start_date, end_date } = settings && settings.schoolSession ? settings.schoolSession : { start_date: "", end_date: "" }

		const start_year = start_date ? moment(start_date).format("YYYY") : ""
		const end_year = end_date ? moment(end_date).format("YYYY") : ""

		const session = `${start_year}-${end_year}`

		switch (this.state.selectedCertificate) {
			case "CHARACTER":
				return <CharacterCertificate curr_student={this.student()} relevant_section={relvSection} school_session={session} />
			case "SCHOOL_LEAVING":
				return <SchoolLeavingCertificate curr_student={this.student()} relevant_section={relvSection} school_session={session} />
			case "SPORTS":
				return <SportsCertificate curr_student={this.student()} relevant_section={relvSection} />
			case "PERFORMANCE":
				return <PerformanceCertificate curr_student={this.student()} relevant_section={relvSection} />
			case "COMPLETION":
				return <CompletionCertificate curr_student={this.student()} />
		}
	}

	handlePrint = () => {

		const curr_student = this.student()
		const certType = this.state.selectedCertificate
		const faculty_id = this.props.curr_teacher

		const issued = Object.values(curr_student.certificates || {})
			.filter(value => value.type === certType)

		if (issued.length === 0) {
			window.print()
			this.props.issueCertificate(certType, curr_student.id, faculty_id)
		}
		else if (issued.length >= 1 && window.confirm("Are you sure you want to issue again?")) {

			window.print()
			this.props.issueCertificate(certType, curr_student.id, faculty_id)

			return
		}

	}

	render() {
		const { settings, schoolLogo, classes } = this.props
		const sections = getSectionsFromClasses(classes)
		const relevant_section = sections.find(section => this.student().section_id === section.id)

		const issued = Object.values(this.student().certificates || {})
			.filter(value => value.type === this.state.selectedCertificate)

		return <div className="certificate">
			<PrintHeader settings={settings} logo={schoolLogo} />

			<div className="no-print">
				<h2 className="text-center">Certificates</h2>
			</div>

			<div className="cert-Info no-print">
				<div className="row">
					<label>Type</label>
					<select {...this.former.super_handle(["selectedCertificate"])}>
						<option value="SCHOOL_LEAVING">School Leaving</option>
						<option value="CHARACTER">Character</option>
						<option value="SPORTS"> Sports </option>
						<option value="PERFORMANCE"> Performance </option>
						<option value="COMPLETION"> Completion </option>
					</select>
				</div>
				<div className="button blue" onClick={() => this.handlePrint()}>{`Print ${issued.length >= 1 ? "( Already Issued )" : ""}`}</div>
			</div>
			{this.getSelectedCertificate(relevant_section)}

		</div>
	}
}
export default connect((state: RootReducerState) => ({
	students: state.db.students,
	teachers: state.db.faculty,
	settings: state.db.settings,
	schoolLogo: state.db.assets ? state.db.assets.schoolLogo || "" : "",
	classes: state.db.classes,
	curr_teacher: state.auth.faculty_id
}), (dispatch: Function) => ({
	issueCertificate: (type: string, student_id: string, faculty_id: string) => dispatch(issueCertificate(type, student_id, faculty_id))
}))(StudentCertificates)

interface CertificateProps {
	curr_student: MISStudent
	relevant_section?: AugmentedSection
	school_session?: string
}

const CharacterCertificate: React.FC<CertificateProps> = ({ curr_student, relevant_section, school_session }) => {
	const gender = curr_student.Gender
	const stdClass = relevant_section ? relevant_section.namespaced_name : ""

	return (
		<div className="certificate-page">
			<div className="head">
				<div className="divider" style={{ textDecoration: "underline" }}>CHARACTER CERTIFICATE</div>
				<div className="sub-divider"> To Whom it May Concern</div>
			</div>

			<div className="body">
				<div className="para" contentEditable suppressContentEditableWarning={true}>
					This is to certify that <span className="emphasize">{curr_student.Name}</span>, {getGenderSpecificText("son/daughter", gender)} of <span className="emphasize">{curr_student.ManName}</span>, is a bonafide student of this school and bears a good moral character. {capitalize(getGenderSpecificText("his/her", gender))} behaviour was good with teachers and students. {capitalize(getGenderSpecificText("he/she", gender))} has neither displayed persistent violent or aggressive behavior nor any desire to harm other.
			</div>

				<div className="cert-row" contentEditable suppressContentEditableWarning={true}> {capitalize(getGenderSpecificText("his/her", gender))} data according to our record is as follows</div>
				<div className="cert-row">
					<label>Admission No.: </label>
					<div>
						{curr_student.AdmissionNumber ? curr_student.AdmissionNumber : ""}
					</div>
				</div>
				<div className="cert-row">
					<label>Roll Number: </label>
					<div>
						{curr_student.RollNumber ? curr_student.RollNumber : ""}
					</div>
				</div>
				<div className="cert-row">
					<label>Class: </label>
					<div>
						{stdClass}
					</div>
				</div>

				<div className="cert-row">
					<label>Date of Birth: </label>
					<div>
						{curr_student.Birthdate ? `${moment(curr_student.Birthdate).format("DD-MM-YYYY")}` : ""}
					</div>
				</div>

				<div className="cert-row">
					<label>Exam Board: </label>
					<div contentEditable>
					</div>
				</div>

				<div className="cert-row">
					<label>Marks: </label>
					<div contentEditable suppressContentEditableWarning={true}>

					</div>
				</div>

				<div className="cert-row">
					<label>Session: </label>
					<div contentEditable suppressContentEditableWarning={true}>{school_session}</div>
				</div>

			</div>

			<div className="footer">
				<div className="left">
					<div> Date of Issue</div>
				</div>
				<div className="right">
					<div> Principal{"'"}s Signature</div>
				</div>
			</div>

		</div>
	)
}

const SchoolLeavingCertificate: React.FC<CertificateProps> = ({ curr_student, relevant_section, school_session }) => {
	const gender = curr_student.Gender
	const stdClass = relevant_section ? relevant_section.namespaced_name : ""

	return (
		<div className="certificate-page">

			<div className="head">
				<div className="divider" style={{ textDecoration: "underline" }}>SCHOOL LEAVING CERTIFICATE</div>
				<div className="sub-divider"> To Whom it May Concern</div>
			</div>

			<div className="body">
				<div className="para" contentEditable suppressContentEditableWarning={true}>
					This is to certify that <span className="emphasize">{curr_student.Name}</span>, {getGenderSpecificText("son/daughter", gender)} of <span className="emphasize">{curr_student.ManName}</span>, has Passed/Failed the Annual Examination held in <b>{school_session}</b> for promotion to Class ____________________.
			</div>

				<div className="cert-row" contentEditable suppressContentEditableWarning={true}> {capitalize(getGenderSpecificText("his/her", gender))} data according to our record is as follows
      		</div>

				<div className="cert-row">
					<label>Admission No. : </label>
					<div>
						{curr_student.AdmissionNumber ? curr_student.AdmissionNumber : ""}
					</div>
				</div>

				<div className="cert-row">
					<label>Roll No. : </label>
					<div>
						{curr_student.RollNumber ? curr_student.RollNumber : ""}
					</div>
				</div>

				<div className="cert-row">
					<label>Date of Birth: </label>
					<div>
						{curr_student.Birthdate ? `${moment(curr_student.Birthdate).format("DD-MM-YYYY")}` : ""}
					</div>
				</div>

				<div className="cert-row">
					<label>Admission Date: </label>
					<div>
						{curr_student.AdmissionNumber ? `${moment(curr_student.StartDate).format("DD-MM-YYYY")}` : ""}
					</div>
				</div>

				<div className="cert-row">
					<label>Class of Admission: </label>
					<div contentEditable suppressContentEditableWarning={true}>
					</div>
				</div>

				<div className="cert-row">
					<label>Withdrawal Date: </label>
					<div contentEditable suppressContentEditableWarning={true}>
					</div>
				</div>

				<div className="cert-row">
					<label className="slc-label">Class of Leaving: </label>
					<div>
						{stdClass}
					</div>
				</div>

				<div className="cert-row">
					<label>Reason of Leaving: </label>
					<div contentEditable suppressContentEditableWarning={true}>
					</div>
				</div>

				<div className="cert-row">
					<label>Prepared by: </label>
					<div contentEditable suppressContentEditableWarning={true}>
					</div>
				</div>

				<div className="cert-row">
					<label>Conduct: </label>
					<div contentEditable suppressContentEditableWarning={true}>
					</div>
				</div>

				<div className="cert-row">
					<label>Remarks:</label>
					<div contentEditable suppressContentEditableWarning={true}>
					</div>
				</div>

				<div className="cert-row">
					<label>&nbsp;</label>
					<div contentEditable suppressContentEditableWarning={true}>
					</div>
				</div>

			</div>

			<div className="footer">

				<div className="left">
					<div> Date of Issue</div>
				</div>

				<div className="right">
					<div> Principal{"'"}s Signature</div>
				</div>
			</div>
		</div>)
}

const SportsCertificate: React.FC<CertificateProps> = ({ curr_student, relevant_section }) => {

	const gender = curr_student.Gender
	const stdClass = relevant_section ? relevant_section.namespaced_name : ""

	return <div className="certificate-page">

		<div className="head">
			<div className="divider" style={{ textDecoration: "underline" }}>SPORTS CERTIFICATE</div>
			<div className="sub-divider"> To Whom it May Concern</div>
		</div>

		<div className="body">
			<div className="para" contentEditable suppressContentEditableWarning={true}>
				This certificate is awarded to <span style={{ fontWeight: "bold", textDecoration: "underline" }}>{curr_student.Name}</span>, {getGenderSpecificText("son/daughter", gender)} of <span style={{ fontWeight: "bold", textDecoration: "underline" }}>{curr_student.ManName}</span>, for {getGenderSpecificText("his/her", gender)} excellent athletics performance in ____________________ at our school.
      		</div>

			<div className="cert-row">
				<label>Admission No. : </label>
				<div>
					{curr_student.AdmissionNumber || ""}
				</div>
			</div>

			<div className="cert-row">
				<label className="slc-label">Class: </label>
				<div>
					{stdClass}
				</div>
			</div>
		</div>

		<div className="footer">
			<div className="left">
				<div> Date of Issue</div>
			</div>
			<div className="right">
				<div> Principal{"'"}s Signature</div>
			</div>
		</div>
	</div>
}

const PerformanceCertificate: React.FC<CertificateProps> = ({ curr_student, relevant_section }) => {

	const gender = curr_student.Gender
	const stdClass = relevant_section ? relevant_section.namespaced_name : ""

	return (
		<div className="certificate-page">

			<div className="head">
				<div className="divider" style={{ textDecoration: "underline" }}>PERFORMANCE CERTIFICATE</div>
				<div className="sub-divider"> To Whom it May Concern</div>
			</div>

			<div className="body">
				<div className="para" contentEditable suppressContentEditableWarning={true}>
					This certificate is awarded to <span className="emphasize">{curr_student.Name}</span>, {` ${getGenderSpecificText("son/daughter", gender)}`} of <span className="emphasize">{curr_student.ManName}</span>, for the acknowledgement of {getGenderSpecificText("his/her", gender)} outstanding performance in ____________________ at our school.
				</div>

				<div className="cert-row">
					<label>Admission No. : </label>
					<div>
						{curr_student.AdmissionNumber || ""}
					</div>
				</div>

				<div className="cert-row">
					<label className="slc-label">Class: </label>

					<div>
						{stdClass}
					</div>
				</div>

				<div className="para" contentEditable suppressContentEditableWarning={true}>
					We found {getGenderSpecificText("him/her", gender)} responsible, enthusiastic and hardworking and we hope {getGenderSpecificText("he/she", gender)} will keep up this good work and make us all proud.
				</div>

			</div>

			<div className="footer">

				<div className="left">
					<div> Date of Issue</div>
				</div>

				<div className="right">
					<div> Principal{"'"}s Signature</div>
				</div>

			</div>
		</div>)
}

const CompletionCertificate: React.FC<CertificateProps> = ({ curr_student, school_session }) => {

	const gender = curr_student.Gender

	return (
		<div className="certificate-page">

			<div className="head">
				<div className="divider" style={{ textDecoration: "underline" }}>COMPLETION CERTIFICATE</div>
				<div className="sub-divider"> To Whom it May Concern</div>
			</div>

			<div className="body">
				<div className="para" contentEditable suppressContentEditableWarning={true}>
					This certificate is awarded to <span className="emphasize">{curr_student.Name}</span>,
					{getGenderSpecificText("son/daughter", gender)} of <span className="emphasize">{curr_student.ManName}</span>, who is a bonafide student of this school and
					has successfully completed the following course(s) from our school
			</div>

				<div className="cert-row">
					<label>Course(s): </label>
					<div contentEditable suppressContentEditableWarning={true}>
					</div>
				</div>

				<div className="para" contentEditable suppressContentEditableWarning={true}>
					during the period of {school_session} and obtained Grade ____________________________. We wish {getGenderSpecificText("him/her", gender)} tremendous success in {getGenderSpecificText("his/her", gender)} future endeavours.
				</div>
			</div>

			<div className="footer">
				<div className="left">
					<div> Date of Issue</div>
				</div>
				<div className="right">
					<div> Principal{"'"}s Signature</div>
				</div>
			</div>
		</div>)
}