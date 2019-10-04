import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { logSms } from 'actions'
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

	logSms = () =>{

		const historyObj = {
			faculty: this.props.faculty_id,
			date: new Date().getTime(),
			type: "EXAM",
			count: 1,
		}

		this.props.logSms(historyObj)
	}

	render() {
		const {match, students, settings, sms_templates, exams, classes } = this.props;
		const id = match.params.id;
		const student = students[id];
		const curr_class = Object.values(classes).find(c => c.sections[student.section_id]!== undefined)		
		const subjectSet = new Set(); 
		const examSet = new Set();   

		for(let [e_id, e] of Object.entries(exams)){
			if(student.exams !== undefined && student.exams[e_id] !== undefined)
			{
				examSet.add(e.name)
				subjectSet.add(e.subject)
			}
		}
		const startDate = moment(this.state.start).unix() * 1000
		const endDate = moment(this.state.end).unix() * 1000

		const report_string = reportStringForStudent(student, exams, startDate, endDate, this.state.examFilterText, this.state.subjectFilterText );

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
				<StudentMarks student={student} 
					exams={exams} settings={settings} 
					startDate={startDate} endDate={endDate} 
					examFilter={this.state.examFilterText} 
					subjectFilter={this.state.subjectFilterText} 
					curr_class={curr_class} 
					logo={this.props.schoolLogo}
					grades={this.props.grades}/>

				<div className="table btn-section">
					{ settings.sendSMSOption === "SIM" ? <a href={url} onClick={this.logSms} className="row button blue">Send SMS from Local SIM</a> : false }
					<div className="row print button" onClick={() => window.print()} style={{ marginTop: "10px"}}>Print</div>
				</div>
			</div>
	}
}

export const getReportFilterCondition = (examFilter, exam, subjectFilter, subject) => 
{
	return (examFilter === exam || examFilter === "") && (subjectFilter === subject || subjectFilter === "")
}

export const reportStringForStudent = (student, exams, startDate=0, endDate=moment.now(), examFilter = "", subjectFilter = "") => {

	// we want a line for each exam. subject - exam name - marks / out of (percent)

	const start = moment(startDate)
	const end = moment(endDate)

	const relevant_exams = Object.keys(student.exams || {})
			.map(exam_id => exams[exam_id])
			.filter(exam => moment(exam.date).isBetween(start, end) && getReportFilterCondition(examFilter, exam.name, subjectFilter, exam.subject ))
	
	const { total_score, max_score } = relevant_exams.reduce((agg, exam) => ({ 
		total_score: agg.total_score + parseFloat(student.exams[exam.id].score, 10), 
		max_score: agg.max_score + parseFloat(exam.total_score, 10) }),
	{ total_score: 0, max_score: 0 })

	const report_arr= [
		...relevant_exams
			.sort((a, b) => a.date - b.date)
			.map(exam => `${exam.subject} ${examFilter === "" ? `- ${exam.name} -` : ""} ${student.exams[exam.id].score}/${exam.total_score} (${(student.exams[exam.id].score / exam.total_score * 100).toFixed(1)}%)`),
		`Total Marks: ${total_score.toFixed(1)}/${max_score.toFixed(1)}`,
		`Total Percentage: ${(total_score/max_score * 100).toFixed(1)}%`
		]
	
	if(examFilter !== "") {
		report_arr.unshift(examFilter)
	}
	
	return report_arr.join('\n');
}

export const StudentMarks = ({student, exams, settings, startDate=0, endDate=moment.now(), examFilter, subjectFilter, curr_class, logo, grades }) => {
	
	const start = moment(startDate);
	const end = moment(endDate);
		
	const { total_marks, marks_obtained } = Object.keys(student.exams || {})
		.map(exam_id => exams[exam_id])
		.filter(exam => moment(exam.date).isBetween(start, end) && student.exams[exam.id].grade !== "Absent" && getReportFilterCondition(examFilter, exam.name, subjectFilter, exam.subject ))
		.reduce((agg, curr) => ({
			total_marks: agg.total_marks + parseFloat(curr.total_score),
			marks_obtained: agg.marks_obtained + parseFloat(student.exams[curr.id].score)
		}), {
			total_marks: 0,
			marks_obtained: 0
		})

	const getGrade = (obtained, total) => {

		const percent_score = Math.abs(( obtained / total) * 100) || 0

		const sorted_grades = Object.entries(grades).sort((a, b)=> parseFloat(b[1]) - parseFloat(a[1]))

		let prev_grade = 0

		const highest_grade = sorted_grades[0]

		for( let e of sorted_grades)
		{
			if(prev_grade !== 0 && percent_score >= parseFloat(highest_grade[1])){
				return highest_grade[0]
			}
			else if(prev_grade !== 0 && percent_score <= prev_grade && percent_score >= e[1]){
				return e[0]
			}
			else {
				prev_grade = parseFloat(e[1])
			}
		}
	}

	return<div className="result-card"> 
		<div className="student-marks">
			<PrintHeader settings={settings} logo={logo} />
			
			<div className="title">{ examFilter === "" ? "Result Card" : examFilter + " Result Card"}</div>
			<div><b>Class:</b> {curr_class !== undefined ? curr_class.name: "______"} </div>
			<div className="student-info">
				<div className="row">
					<div className="name"><b>Student Name:</b> {student.Name}</div>
					<div className="name" style={{ marginLeft: "1em"}}><b>Father Name:</b> {student.ManName}</div>
					<div style={{ marginLeft: "1em"}}><b>Roll No:</b> {student.RollNumber !== undefined ? student.RollNumber : "______"}</div>
				</div>
			</div>
			<div className="section table">
				<div className="table row heading">
					<label>Date</label>
					<label style={{width: "10rem"}}>Subject</label>
					{examFilter === "" ? <label style={{width: "10rem"}}>Name</label> : false}
					<label>Total</label>
					<label>Obtained</label>
					<label>Percent</label>
					<label>Grade</label>
					<label style={{width: "10rem"}}>Remarks</label>
				</div>
			{
				[...Object.keys(student.exams || {})
					.map(exam_id => exams[exam_id])
					.filter(exam => moment(exam.date).isBetween(start, end) && getReportFilterCondition(examFilter, exam.name, subjectFilter, exam.subject ))
					.sort((a, b) => a.date - b.date)
					.map(exam => <div className="table row" key={exam.id}>
							<div>{moment(exam.date).format("MM/DD")}</div>
							<div style={{width: "10rem"}}>{exam.subject}</div>
							{examFilter === "" ? <Link style={{width: "10rem"}} to={`/reports/${exam.class_id}/${exam.section_id}/exam/${exam.id}`}>{exam.name}</Link> : false}
							<div>{exam.total_score}</div>
							<div>{student.exams[exam.id].grade !== "Absent" ? student.exams[exam.id].score: "N/A"}</div>
							<div>{student.exams[exam.id].grade !== "Absent" ? (student.exams[exam.id].score / exam.total_score * 100).toFixed(2) : "N/A"}</div>
							<div>{student.exams[exam.id].grade}</div>
							<div style={{width: "10rem"}}>{student.exams[exam.id].remarks}</div>
						</div>)
				]
			}
			</div>
			
			<div className="result-stats">
				<div className="row">Total Marks: <b>{total_marks}</b></div>
				<div className="row">Marks Obtained: <b>{marks_obtained} / {total_marks}</b></div>
				<div className="row">Percentage: <b>{(marks_obtained/total_marks * 100).toFixed(2)}%</b></div>
				<div className="row">Grade: <b>{ getGrade( marks_obtained, total_marks) }</b></div>
				<div className="row">Position: </div>
			</div>

			<div className="print-only">
				<div className="remarks">
					<div>Comments:</div> 
					<div>_____________________________________________________________________</div>
				</div>
				<div className="result-footer">
					<div className="left">
						<div> Teacher Signature</div>
					</div>
					<div className="right">
						<div> Principal Signature</div>
					</div>
				</div>
			</div> 
		</div>
	</div>
}


export default connect(state => ({
	faculty_id: state.auth.faculty_id,
	students: state.db.students,
	exams: state.db.exams,
	classes: state.db.classes,
	grades: state.db.settings.exams.grades,
	settings: state.db.settings,
	sms_templates: state.db.sms_templates,
	schoolLogo: state.db.assets ? (state.db.assets.schoolLogo || "") : "" 
}), dispatch => ({
	logSms: (history)=> dispatch(logSms(history)),
}))(StudentMarksContainer)
