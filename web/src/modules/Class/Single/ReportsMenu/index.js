import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import Former from 'utils/former'
import { StudentMarks, reportStringForStudent } from 'modules/Student/Single/Marks'
import { smsIntentLink } from 'utils/intent'
import { logSms } from 'actions'


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
				subjectFilterText: ""
			}
		}
		this.report_former = new Former(this, ["report_filters"])
	}

	logSms = (messages) => {
		if(messages.length === 0){
			console.log("No Message to Log")
			return
		}
		const historyObj = {
			faculty: this.props.faculty_id,
			date: moment.now(),
			type: "EXAM",
			count: messages.length
		}
	
		this.props.logSms(historyObj)
	}

	render() {

		const { students, exams, curr_class, settings, sms_templates } = this.props
		
		const relevant_students = Object.values(students)
			.filter(s => curr_class.sections[s.section_id] !== undefined)
			
		const subjects = new Set()
		const examSet = new Set()
		
		for(let s of relevant_students)
		{
			for(let e of Object.values(exams))
			{ 
				if(e.section_id === s.section_id){
					subjects.add(e.subject)
					examSet.add(e.name)
				}
			}
		}

		const messages = relevant_students
			.filter(s => s.Phone !== "")
			.map(student => ({
				number: student.Phone,
				text: sms_templates.result
					.replace(/\$NAME/g, student.Name)
					.replace(/\$REPORT/g, reportStringForStudent(student, exams, moment(this.state.report_filters.start), moment(this.state.report_filters.end), this.state.report_filters.examFilterText, this.state.report_filters.subjectFilter))
			}))
				
		const url = smsIntentLink({
			messages,
			return_link: window.location.href
		})


		return <div className="class-report-menu" style={{width: "100%"}}>
			<div className="title no-print">Print Reports for {this.props.curr_class.name}</div>
			<div className="form no-print" style={{width: "90%", margin: "auto"}}>
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
							Array.from(examSet).map(exam => {
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
							Array.from(subjects).map(subject => {
								return <option key={subject} value={subject}>{subject}</option>	
							})
						}
					</select>
				</div>
			</div>
			
			<div className="class-report" style={{height: "100%"}}>
			
			<div className="print button" onClick={() => window.print()}>Print</div>

			{ settings.sendSMSOption === "SIM" ? <a className="button blue sms" onClick={() => this.logSms(messages)}  href={url}>Send Reports using SMS</a> : false }
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
							curr_class={this.props.curr_class}
						/>
					</div>)
			}
			
			</div>

		</div>
	}
}
 
export default connect((state, { match: { params: { id } } }) => ({
	 curr_class: state.db.classes[id],
	 faculty_id: state.auth.faculty_id,
	 classes : state.db.classes,
	 students: state.db.students,
	 settings: state.db.settings,
	 exams: state.db.exams,
	 sms_templates: state.db.sms_templates
}), dispatch => ({
	logSms: (history) => dispatch(logSms(history))
}))(ClassReportMenu)