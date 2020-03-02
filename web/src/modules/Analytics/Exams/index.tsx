import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Former from 'utils/former'
import { ExamTitles } from 'constants/exam'

import ClassGradesGraph from './Graphs/classGrades'
import ClassTopStudentGraph from './Graphs/classStudents'
import StudentProgressGraph from './Graphs/studentProgress'

import './style.css'

type P = {
	grades: MISGrades
} & RootDBState

type S = {
	class_id: string
	section_id: string
	toggleFilter: boolean
} & ExamFilter

class ExamsAnalytics extends Component<P, S> {
	former: Former
	constructor(props: P) {
		super(props)

		this.state = {
			exam_title: "",
			year: "",
			class_id: "",
			section_id: "",
			toggleFilter: false,
		}
		this.former = new Former(this, [])
	}

	onToggleFilter = () => {
		this.setState({ toggleFilter: !this.state.toggleFilter })
	}

	getMergeStudentsExams = (students: P["students"], exams: MISExam[]) => {
		const students_exams = Object.values(students)
			.filter(student => student && student.Name && student.exams)
			.reduce<MergeStudentsExams[]>((agg, curr) => {

				const merge_exams: AugmentedMISExam[] = []

				for (const exam of exams) {
					const stats = curr.exams[exam.id]
					if (stats != null) {
						merge_exams.push({ ...exam, stats })
					}
				}

				// in case there is no exams for the curr student, no need to put into list
				if (merge_exams.length === 0)
					return agg

				return [...agg, { ...curr, merge_exams }]

			}, [])
		return students_exams
	}

	render() {


		const { exams, classes, students, grades } = this.props

		const { exam_title, year, class_id, toggleFilter } = this.state

		let years = new Set<string>()
		let filtered_exams: MISExam[] = []
		let subjects = new Set<string>()

		for (const exam of Object.values(exams)) {

			years.add(moment(exam.date).format("YYYY"))

			if ((exam_title ? exam.name === exam_title : true) &&
				(year ? moment(exam.date).format("YYYY") === year : true) &&
				(class_id ? class_id === exam.class_id : true)) {
				filtered_exams.push(exam)
			}
			// show all subjects of class in the list
			if (exam.class_id === class_id) {
				subjects.add(exam.subject)
			}
		}

		const students_exams = this.getMergeStudentsExams(students, filtered_exams)

		return <>
			<div className="section" style={{ border: "none", marginBottom: "10px", width: "92%" }}>
				<div className="row" >
					<button className="button blue" onClick={this.onToggleFilter} style={{ marginLeft: "auto" }}>{toggleFilter ? "Hide Filters" : "Show Filters"}</button>
				</div>
			</div>
			{
				toggleFilter && <div className="section-container section form">
					<div className="row">
						<label>Exams for Class</label>
						<select {...this.former.super_handle(["class_id"])}>
							<option value="">Select Class</option>
							{
								Object.values(classes)
									.sort((a, b) => a.classYear - b.classYear)
									.map(mis_class => <option key={mis_class.id} value={mis_class.id}>{mis_class.name}</option>)
							}
						</select>
					</div>
					<div className="row">
						<label>Exams Title</label>
						<select {...this.former.super_handle(["exam_title"])}>
							<option value="">Select Exams</option>
							{
								ExamTitles
									.map(title => <option key={title} value={title}>{title}</option>)
							}
						</select>
					</div>
				</div>
			}

			{students_exams.length > 0 && <ClassGradesGraph relevant_students={students_exams} grades={grades} years={[...years]} />}
			{students_exams.length > 0 && < ClassTopStudentGraph relevant_students={students_exams} grades={grades} years={[...years]} />}
			{students_exams.length > 0 && <StudentProgressGraph relevant_students={students_exams} grades={grades} years={[...years]} />}
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