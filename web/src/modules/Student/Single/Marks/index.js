import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { smsIntentLink } from 'utils/intent'

import Former from 'utils/former'
import { PrintHeader } from 'components/Layout'

import './style.css'
 
class StudentMarksContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			start: moment().subtract(3, "month"),
			end: moment.now(),
			examFilterText: "",
			subjectFilterText: ""
		}

		this.former = new Former(this, []);
	}

	render() {
		const {match, students, settings, sms_templates, exams } = this.props;
		const id = match.params.id;

		const student = students[id];
		const subjectSet = new Set(); 
		const examSet = new Set();   

		for(let e of Object.values(exams)){
			if(e.section_id === student.section_id){
				examSet.add(e.name)
				subjectSet.add(e.subject)
			}
		}
		const startDate = moment(this.state.start).unix() * 1000
		const endDate = moment(this.state.end).unix() * 1000

		const report_string = reportStringForStudent(student, exams, startDate, endDate, this.state.examFilterText, this.state.subjectFilterText);

		const text = sms_templates.result.replace(/\$NAME/g, student.Name).replace(/\$REPORT/g, report_string);

		const url = smsIntentLink({ messages: [{ number: student.Phone, text: text }], return_link: window.location.href })

		return <div className="student-marks-container">
				<div className="no-print">
					<div className="form">
						<div className="row">
							<label>Start Date</label>
							<input type="date" onChange={this.former.handle(["start"])} value={moment(this.state.start).format("YYYY-MM-DD")} placeholder="Start Date" />
						</div>
						<div className="row">
							<label>End Date</label>
							<input type="date" onChange={this.former.handle(["end"])} value={moment(this.state.end).format("YYYY-MM-DD")} placeholder="End Date" />
						</div>

						 <div className="row">
							<label>Exam Name</label>
							<select {...this.former.super_handle(["examFilterText"])}> 
							<option value="">Select Exam</option>
							{
								Array.from(examSet).map(exam => {
									return <option key={exam} value={exam}>{exam}</option>	
								})
							}
							</select>
						</div> 

						<div className="row">
							<label>Subject Name</label>
							<select {...this.former.super_handle(["subjectFilterText"])}> 
							<option value="">Select Subject</option>
							{
								Array.from(subjectSet).map(subject => {
									return <option key={subject} value={subject}>{subject}</option>	
								})
							}
							</select>						
						</div>
					</div>
				</div>
				<StudentMarks student={student} exams={exams} settings={settings} startDate={startDate} endDate={endDate} examFilter={this.state.examFilterText} subjectFilter={this.state.subjectFilterText}/>


				{ settings.sendSMSOption === "SIM" ? <a href={url} className="button blue">Send SMS from Local SIM</a> : false }
				<div className="print button" onClick={() => window.print()} style={{ marginTop: "15px", marginRight: "5%", alignSelf: "flex-end", }}>Print</div>
			</div>
	}
}

export const getReportFilterCondition = (examFilter, exam, subjectFilter, subject) => {
	
	if(examFilter !== "" && subjectFilter !== "")
		return examFilter === exam && subjectFilter === subject 
	else if(examFilter !== ""){
		return examFilter === exam
	}
	else if(subjectFilter !== ""){
		return subjectFilter === subject
	}
	else
		return true
	
}

export const reportStringForStudent = (student, exams, startDate=0, endDate=moment.now(), examFilter, subjectFilter) => {

	// we want a line for each exam. subject - exam name - marks / out of (percent)

	const start = moment(startDate)
	const end = moment(endDate)

	const report_string = Object.keys(student.exams || {})
		.map(exam_id => exams[exam_id])
		.filter(exam => moment(exam.date).isBetween(start, end) && getReportFilterCondition(examFilter, student.exams[exam.id].name, subjectFilter, student.exams[exam.id].subject ))
		.sort((a, b) => a.date - b.date)
		.map(exam => `${exam.subject} - ${exam.name} - ${student.exams[exam.id].score}/${exam.total_score} (${(student.exams[exam.id].score / exam.total_score * 100).toFixed(2)}%)`)
		.join('\n')
	
	return report_string;
}

export const StudentMarks = ({student, exams, settings, startDate=0, endDate=moment.now(), examFilter, subjectFilter}) => {
	
	const start = moment(startDate);
	const end = moment(endDate);
		
	const { total_possible, total_marks } = Object.keys(student.exams || {})
		.map(exam_id => exams[exam_id])
		.filter(exam => moment(exam.date).isBetween(start, end) && student.exams[exam.id].grade !== "Absent" && getReportFilterCondition(examFilter, exam.name, subjectFilter, exam.subject ))
		.reduce((agg, curr) => ({
			total_possible: agg.total_possible + parseFloat(curr.total_score),
			total_marks: agg.total_marks + parseFloat(student.exams[curr.id].score)
		}), {
			total_possible: 0,
			total_marks: 0
		})

	return <div className="student-marks">
		<PrintHeader settings={settings} />

		<div className="title">Result Card</div>
		<div className="student-info">
			<div className="name"><b>Student Name:</b> {student.Name}</div>
		</div>
		<div className="section table">
			<div className="table row heading">
				<label><b>Date</b></label>
				<label><b>Subject</b></label>
				<label><b>Name</b></label>
				<label><b>Marks</b></label>
				<label><b>Out of</b></label>
				<label><b>Percent</b></label>
				<label><b>Grade</b></label>
			</div>
		{
			[...Object.keys(student.exams || {})
				.map(exam_id => exams[exam_id])
				.filter(exam => moment(exam.date).isBetween(start, end) && getReportFilterCondition(examFilter, exam.name, subjectFilter, exam.subject ))
				.sort((a, b) => a.date - b.date)
				.map(exam => <div className="table row" key={exam.id}>
						<div>{moment(exam.date).format("MM/DD")}</div>
						<div>{exam.subject}</div>
						<Link to={`/reports/${exam.class_id}/${exam.section_id}/exam/${exam.id}`}>{exam.name}</Link>
						<div>{student.exams[exam.id].grade !== "Absent" ? student.exams[exam.id].score: "N/A"}</div>
						<div>{exam.total_score}</div>
						<div>{student.exams[exam.id].grade !== "Absent" ? (student.exams[exam.id].score / exam.total_score * 100).toFixed(2) : "N/A"}</div>
						<div>{student.exams[exam.id].grade}</div>
					</div>),
					<div className="table row footing" key={`${student.id}-total-footing`}>
						<label><b>Total Marks</b></label>
						<label><b>Out of</b></label>
						<label><b>Percent</b></label>
					</div>,
					<div className="table row" key={`${student.id}-total-value`}>
						<div>{total_marks}</div>
						<div>{total_possible}</div>
						<div>{(total_marks/total_possible * 100).toFixed(2)}%</div>
					</div> 
			]
		}
		</div>
	
		<div className="print-only">
			<div style={{ marginTop: "100px" }}>
				<div>Signature: ___________________</div>
			</div>

			<div style={{ marginTop: "50px" }}>
				<div>Parent Signature: ___________________</div>
			</div>
		</div>
	</div>
}


export default connect(state => ({
	students: state.db.students,
	exams: state.db.exams,
	settings: state.db.settings,
	sms_templates: state.db.sms_templates
}))(StudentMarksContainer)
