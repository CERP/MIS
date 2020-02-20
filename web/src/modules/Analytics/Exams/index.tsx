import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

type P = {
	grades: RootDBState["settings"]["exams"]["grades"]
} & RootDBState

type S = {
	class_id: string
	section_id: string
} & ExamFilter


class ExamsAnalytics extends Component<P, S> {
	constructor(props: P) {
		super(props)

		const curr_year = moment().format("YYYY")

		this.state = {
			exam_title: "",
			subject: "",
			year: curr_year,
			month: "",
			class_id: "",
			section_id: "",
		}
	}

	render() {

		const { exams } = this.props

		const { exam_title, subject, year, month, section_id, class_id } = this.state


		let years = new Set<string>()
		let filtered_exams: MISExam[] = []
		let subjects = new Set<string>()

		for (const exam of Object.values(exams)) {

			years.add(moment(exam.date).format("YYYY"))

			if (exam.name === exam_title && moment(exam.date).format("YYYY") === year &&
				exam.section_id === section_id &&
				(exam_title === "Test" && month ? moment(exam.date).format("MMMM") === month : true) &&
				(exam_title === "Test" && subject ? exam.subject === subject : true)) {
				filtered_exams.push(exam)
			}
			// show all subjects of class in the list
			if (exam.section_id === section_id && exam.class_id === class_id) {
				subjects.add(exam.subject)
			}
		}

		return <>
		</>
	}
}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	classes: state.db.classes,
	settins: state.db.settings,
	grades: state.db.settings.exams.grades,
	exams: state.db.exams,
	faculty: state.db.faculty
}))(ExamsAnalytics)
