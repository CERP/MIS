import React, { Component } from 'react'
import { XAxis, YAxis, Tooltip, Legend, LineChart, CartesianGrid, Line } from 'recharts'
import moment from 'moment'
import getStudentExamMarksSheet from 'utils/studentExamMarksSheet'
import { ExamTitles } from 'constants/exam'
import Former from 'utils/former'


type PropsType = {
	relevant_students: MergeStudentsExams[]
	years: string[]
	grades: MISGrades
	subjects?: string[]
}

type GraphData = {
	name: string
	total_marks: number
	marks_obtained: number
}

type S = {
	student_id: string
} & ExamFilter

class StudentProgressGraph extends Component<PropsType, S> {
	former: Former
	constructor(props: PropsType) {
		super(props)
		this.state = {
			student_id: "",
			exam_title: "",
			year: "",
		}

		this.former = new Former(this, [])
	}

	getStudentExamsMarks = (students: MergeStudentsExams[], grades: MISGrades, years: string[]): GraphData[] => {

		const { student_id } = this.state

		let student = getStudentExamMarksSheet(students, grades)[0] // get the top student from list

		// get the selected student from the list
		if (student_id !== "") {
			student = getStudentExamMarksSheet(students, grades)
				.find(student => student.id === student_id)
		}

		const graph_data = years.reduce((agg, curr) => {

			// creating grade record object
			let examsObject = ExamTitles
				.reduce((agg, curr) => {
					return {
						...agg,
						[curr]: 0
					}
				}, {})

			for (const exam of student.merge_exams) {

				if (moment(exam.date).format("YYYY") === curr) {
					//@ts-ignore
					examsObject[exam.name] += parseFloat(exam.stats.score.toString() || '0')
				}
			}
			return [
				...agg,
				{
					year: curr,
					...examsObject
				}
			]
		}, [])

		return graph_data

	}

	render() {

		const { years, grades, relevant_students } = this.props

		const graphData = this.getStudentExamsMarks(relevant_students, grades, years)

		return <>
			<div className="title divider">Student Progress in Exams</div>
			<div className="section-container section">
				<div className="row">
					<div className="" style={{ marginRight: "10px" }}>
						<div className="row">
							<select {...this.former.super_handle(["year"])}>
								<option value="">Exams for Year</option>
								{
									Array.from(years)
										.map(year => <option key={year} value={year}>{year}</option>)
								}
							</select>
						</div>
						<div className="row">
							<select {...this.former.super_handle(["exam_title"])}>
								<option value="">Exams</option>
								{
									ExamTitles
										.map(title => <option key={title} value={title}>{title}</option>)
								}
							</select>
						</div>
						<div className="row">
							<select {...this.former.super_handle(["student_id"])}>
								<option value="">Select Student</option>
								{
									relevant_students
										.map(student => <option key={student.id} value={student.id}>{student.Name}</option>)
								}
							</select>
						</div>
					</div>
					<div className="grades-graph">
						<LineChart width={730} height={250} data={graphData}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="year" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line type="monotone" dataKey="1st Term" stroke="#8884d8" />
							<Line type="monotone" dataKey="2nd Term" stroke="#82ca9d" />
							<Line type="monotone" dataKey="Mid-Term" stroke="#413ea0" />
							<Line type="monotone" dataKey="Final-Term" stroke="#ff7300" />
							<Line type="monotone" dataKey="Test" stroke="#ff0660" />
						</LineChart>
					</div>
				</div>
			</div>
		</>
	}
}

export default StudentProgressGraph
