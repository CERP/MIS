import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Former from 'utils/former'
import { ExamTitles } from 'constants/exam'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import {
	BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer,
} from 'recharts';
import calculateGrade from 'utils/calculateGrade'

type P = {
	grades: RootDBState["settings"]["exams"]["grades"]
} & RootDBState

type S = {
	class_id: string
	section_id: string
} & ExamFilter

type graphData = {
	grade: string
	total: number
}

class ExamsAnalytics extends Component<P, S> {
	former: Former
	constructor(props: P) {
		super(props)

		const curr_year = moment().format("YYYY")

		this.state = {
			exam_title: "Final-Term",
			subject: "",
			year: curr_year,
			month: "",
			class_id: "",
			section_id: ""
		}
		this.former = new Former(this, [])
	}

	gradeRecords = (students: MergeStudentsExams[], grades: RootDBState["settings"]["exams"]["grades"]) => {

		let Arr: graphData[] = []

		// for (const grade of Object.keys(grades)) {
		// 	Arr.push({
		// 		grade,
		// 		total: 0
		// 	})
		// }

		let gradesObject = Object.keys(grades)
			.reduce((agg, curr) => {
				return {
					...agg,
					[curr]: 0
				}
			}, {})

		for (const student of students) {
			let marks = { total: 0, obtained: 0 }

			for (const exam of student.merge_exams) {
				marks.obtained += parseFloat(exam.stats.score.toString() || '0')
				marks.total += parseFloat(exam.total_score.toString() || '0')
			}

			const grade = calculateGrade(marks.obtained, marks.total, grades)

			//@ts-ignore
			gradesObject[grade] += 1;

		}

		return Object.entries(gradesObject)
			.reduce((agg, curr) => {
				return [
					...agg,
					{
						grade: curr[0],
						total: curr[1]
					}
				]
			}, [])

	}

	render() {

		const { exams, classes, students, grades } = this.props

		const { exam_title, subject, year, month, section_id, class_id } = this.state

		const sections = getSectionsFromClasses(classes).sort((a, b) => a.classYear || 0 - b.classYear || 0)

		let years = new Set<string>()
		let filtered_exams: MISExam[] = []
		let subjects = new Set<string>()

		for (const exam of Object.values(exams)) {

			years.add(moment(exam.date).format("YYYY"))

			if (exam.name === exam_title && moment(exam.date).format("YYYY") === year &&
				(section_id ? section_id === exam.section_id : true)) {
				filtered_exams.push(exam)
			}
			// show all subjects of class in the list
			if (exam.section_id === section_id && exam.class_id === class_id) {
				subjects.add(exam.subject)
			}
		}

		const exam_students = Object.values(students)
			.filter(student => student && student.Name && student.section_id && student.exams)
			.reduce<MergeStudentsExams[]>((agg, curr) => {

				const merge_exams: AugmentedMISExam[] = []

				for (const exam of filtered_exams) {
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

		return (
			<>
				<div className="section form" style={{ width: "80%", margin: "auto" }}>
					<div className="row">
						<label>Exams Year</label>
						<select {...this.former.super_handle(["year"])}>
							<option value="">Select Year</option>
							{
								Array.from(years).map(year => <option key={year} value={year}>{year}</option>)
							}
						</select>
					</div>
					<div className="row">
						<label>Exam Name</label>
						<select {...this.former.super_handle(["exam_title"])}>
							<option value="">Select Exam</option>
							{
								ExamTitles.map(title => {
									return <option key={title} value={title}>{title}</option>
								})
							}
						</select>
					</div>
					<div className="row">
						<label>Exams for Class</label>
						<select {...this.former.super_handle(["section_id"])}>
							<option value="">Select Class</option>
							{
								sections
									.map(section => <option key={section.id} value={section.id}>{section.namespaced_name}</option>)
							}
						</select>
					</div>
				</div>
				<div className="" style={{ marginTop: "40px" }}>
					<Example graphData={this.gradeRecords(exam_students, grades)} />
				</div>
			</>
		)
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

export const Example = (props: any) => {

	return (
		<BarChart
			width={500}
			height={300}
			data={props.graphData}>
			<XAxis dataKey="grade" />
			<YAxis />
			<Tooltip />
			<Legend />
			<Bar dataKey="total" fill="#8884d8" minPointSize={5}>
			</Bar>
		</BarChart>
	);
}
