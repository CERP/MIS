import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import Former from 'utils/former'
import { StudentMarks, reportStringForStudent } from 'modules/Student/Single/Marks'
import { smsIntentLink } from 'utils/intent'
import { logSms } from 'actions'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import chunkify from 'utils/chunkify'
import { ClassResultSheet } from 'components/Printable/ResultCard/classResultSheet'

import './style.css'

class ClassReportMenu extends Component {

	constructor(props) {
		super(props);

		this.state = {
			report_filters: {
				start: moment().subtract(3, "month").unix() * 1000,
				end: moment.now(),
				exam_name: "",
				examFilterText: "",
				subjectFilterText: "",
				dateOrSerial: "Date",
				is_class_printable: false
			}
		}
		this.report_former = new Former(this, ["report_filters"])
	}

	logSms = (messages) => {
		if (messages.length === 0) {
			console.log("No Message to Log")
			return
		}
		const historyObj = {
			faculty: this.props.faculty_id,
			date: new Date().getTime(),
			type: "EXAM",
			count: messages.length
		}

		this.props.logSms(historyObj)
	}

	printableClassResultSheet = () => {
		// to print only class result sheet
		this.setState({
			is_class_printable: true
		})
		window.print()
	}

	printableClassResultCard = () => {
		// to print only class result cards
		this.setState({
			is_class_printable: false
		})
		window.print()
	}

	render() {

		const { students, exams, classes, settings, sms_templates, curr_section_id, curr_class_id } = this.props

		const curr_section = getSectionsFromClasses(classes).filter( section  => section.id === curr_section_id)[0]

		const relevant_students = Object.values(students)
			.filter(s => s.Name && s.exams && s.section_id !== undefined && s.section_id === curr_section_id)
			.sort((a, b) => (a.RollNumber || 0) - (b.RollNumber || 0))
		
		const relevant_exams = Object.values(exams)
			.filter(e => e.class_id === curr_class_id &&
				e.section_id !== undefined &&
				e.section_id === curr_section_id)
		
		const examSubjectsMarks = new Set()
		const examSet = new Set()
		const subjects = new Set()

		for (const e of Object.values(relevant_exams)) {
			// show only subjects and marks for selected exam else all subjects
			if( this.state.report_filters.examFilterText !== "" ? e.name === this.state.report_filters.examFilterText : true) {
				examSubjectsMarks.add(`${e.subject} ( ${e.total_score} )`)
				subjects.add(e.subject)
			}
			// exams list
			examSet.add(e.name)
		}

		const marksSheet = relevant_students
			.reduce((agg, curr) => { 

				let new_exams = []
				let temp_marks = { total: 0, obtained: 0}

				for (const e of relevant_exams) {
					if (curr.exams[e.id]) {
						new_exams.push({
							...exams[e.id],
							stats: curr.exams[e.id]
						})

						temp_marks.obtained = temp_marks.obtained + parseFloat(curr.exams[e.id].score || 0)
						temp_marks.total = temp_marks.total + parseFloat(e.total_score || 0)

					} else {
						new_exams.push({
							...exams[e.id],
							stats: { score: 0, remarks: "", grade:""}
						})
					}
				}

				return [
					...agg,
					{
						id: curr.id,
						name: curr.Name,
						roll: curr.RollNumber ? curr.RollNumber : "",
						total_marks: temp_marks.total,
						marks_obtained: temp_marks.obtained,
						grade: "A",
						position: 0,
						exams: new_exams
					}
				]
			}, [])

		const messages = relevant_students
			.filter(s => s.Phone !== "")
			.map(student => ({
				number: student.Phone,
				text: sms_templates.result
					.replace(/\$NAME/g, student.Name)
					.replace(/\$REPORT/g, reportStringForStudent(student, exams, moment(this.state.report_filters.start), moment(this.state.report_filters.end), this.state.report_filters.examFilterText, this.state.report_filters.subjectFilterText))
			}))

		const url = smsIntentLink({
			messages,
			return_link: window.location.href
		})


		return <div className="class-report-menu" style={{ width: "100%" }}>
			<div className="title no-print">Print Result Card for {curr_section.namespaced_name}</div>
			<div className="form no-print">
				<div className="row">
					<label>Start Date</label>
					<input type="date" onChange={this.report_former.handle(["start"])} value={moment(this.state.report_filters.start).format("YYYY-MM-DD")} placeholder="Start Date" />
				</div>
				<div className="row">
					<label>End Date</label>
					<input type="date" onChange={this.report_former.handle(["end"])} value={moment(this.state.report_filters.end).format("YYYY-MM-DD")} placeholder="End Date" />
				</div>

				<div className="row">
					<label>Exam Name</label>
					<select {...this.report_former.super_handle(["examFilterText"])}>
						<option value="">Select Exam</option>
						{
							Array.from(examSet)
								.sort((a, b) => a.localeCompare(b))
								.map(exam => {
									return <option key={exam} value={exam}>{exam}</option>
								})
						}
					</select>
				</div>
				<div className="row">
					<label>Subject Name</label>
					<select {...this.report_former.super_handle(["subjectFilterText"])}>
						<option value="">Select Subject</option>
						{
							Array.from(subjects)
								.sort((a, b) => a.localeCompare(b))
								.map(subject => {
									return <option key={subject} value={subject}>{subject}</option>
								})
						}
					</select>
				</div>
				<div className="row">
					<label>Show Date/Serial No.</label>
					<select {...this.report_former.super_handle(["dateOrSerial"])}>
						<option value="Date">Date</option>
						<option value="Serial No.">Serial No.</option>
					</select>
				</div>

			</div>

			<div className="table btn-section">
				{settings.sendSMSOption === "SIM" ? <a className="row button blue sms" onClick={() => this.logSms(messages)} href={url}>Send Reports using SMS</a> : false}
				<div className="row print button" onClick={() => this.printableClassResultCard()} style={{ marginTop: " 10px" }}>Print</div>
				<div className="row print button" onClick={() => this.printableClassResultSheet()} style={{ marginTop: " 10px" }}>Print Class Result Sheet</div>
			</div>

			<div className="class-report" style={{ height: "100%" }}>
				{ this.state.is_class_printable && <ClassResultSheet
					sectionName={curr_section.namespaced_name}
					examSubjectsMarks={examSubjectsMarks}
					examName={this.state.report_filters.examFilterText}
					schoolName={this.props.settings.schoolName}
					students={chunkify(marksSheet, 15)}
					chunkSize={15}/>
				}
				{
					//TODO: put in total marks, grade, signature, and remarks.
					relevant_students.map(s =>
						<div className="print-page student-report" key={s.id} style={{ height: "100%" }}>
							<StudentMarks
								student={s}
								exams={this.props.exams}
								settings={this.props.settings}
								startDate={this.state.report_filters.start}
								endDate={this.state.report_filters.end}
								examFilter={this.state.report_filters.examFilterText}
								subjectFilter={this.state.report_filters.subjectFilterText}
								curr_section={curr_section}
								logo={this.props.schoolLogo}
								grades={this.props.grades}
								dateOrSerial={this.state.report_filters.dateOrSerial}
							/>
						</div>)
				}
			</div>

		</div>
	}
}

export default connect((state, { match: { params: { class_id, section_id } } }) => ({
	curr_class_id: class_id,
	curr_section_id: section_id,
	faculty_id: state.auth.faculty_id,
	classes: state.db.classes,
	students: state.db.students,
	settings: state.db.settings,
	exams: state.db.exams,
	grades: state.db.settings.exams.grades,
	schoolLogo: state.db.assets ? state.db.assets.schoolLogo || "" : "",
	sms_templates: state.db.sms_templates
}), dispatch => ({
	logSms: (history) => dispatch(logSms(history))
}))(ClassReportMenu)