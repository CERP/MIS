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
	exam_title: string
	min_date: number
	max_date: number
}

class ExamsAnalytics extends Component<P, S> {
	former: Former
	constructor(props: P) {
		super(props)

		const min_date = moment().subtract(1, "year").unix() * 1000
		const max_date = moment().unix() * 1000

		this.state = {
			exam_title: "",
			min_date,
			max_date,
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

	isBetweenDateRange = (exam_date: number): boolean => {

		const { min_date, max_date } = this.state

		return moment(exam_date).isBetween(moment(min_date), moment(max_date), "day")
	}

	render() {


		const { exams, classes, students, grades } = this.props

		const { exam_title, class_id, min_date, max_date, toggleFilter } = this.state

		let years = new Set<string>()
		let filtered_exams: MISExam[] = []
		let subjects = new Set<string>()

		for (const exam of Object.values(exams)) {

			years.add(moment(exam.date).format("YYYY"))

			if ((exam_title ? exam.name === exam_title : true) &&
				(class_id ? class_id === exam.class_id : true)) {

				if (this.isBetweenDateRange(exam.date)) {
					filtered_exams.push(exam)
				}
			}
			// show all subjects of class in the list
			if (class_id ? exam.class_id === class_id : true) {
				subjects.add(exam.subject)
			}
		}

		const students_exams = this.getMergeStudentsExams(students, filtered_exams)

		return <div className="exams-analytics">
			<div className="section filter-button no-print">
				<div className="row">
					<button className="button blue" onClick={this.onToggleFilter} style={{ marginLeft: "auto", width: "110px" }}>{toggleFilter ? "Hide Filters" : "Show Filters"}</button>
				</div>
			</div>
			<div className={`filter-container ${toggleFilter ? 'show' : 'hide'}`}>
				<div className="section-container section form no-print">
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
						<label>Exams Date Range</label>
						<div>
							<div className="date-range">
								<input type="date" {...this.former.super_handle(["min_date"])} value={moment(min_date).format("YYYY-MM-DD")} />
								<input type="date" {...this.former.super_handle(["max_date"])} value={moment(max_date).format("YYYY-MM-DD")} />
							</div>
						</div>
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
			</div>
			{
				students_exams.length > 0 && <>
					<StudentProgressGraph relevant_students={students_exams} grades={grades} years={[...years]} />
					<ClassTopStudentGraph relevant_students={students_exams} grades={grades} subjects={[...subjects]} />
					<ClassGradesGraph relevant_students={students_exams} grades={grades} subjects={[...subjects]} />
				</>
			}
		</div>
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