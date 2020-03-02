import React, { Component } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import getStudentExamMarksSheet from 'utils/studentExamMarksSheet'
import calculateGrade from 'utils/calculateGrade'
import { ExamTitles } from 'constants/exam'
import Former from 'utils/former'

type PropsType = {
	relevant_students: MergeStudentsExams[]
	years: string[]
	grades: MISGrades
}

type GraphData = {
	name: string
	total_marks: number
	marks_obtained: number
}

type S = {
	position_count: string
} & ExamFilter

class ClassTopStudentGraph extends Component<PropsType, S> {

	former: Former
	constructor(props: PropsType) {
		super(props)

		this.state = {
			year: "",
			exam_title: "",
			position_count: "5"
		}

		this.former = new Former(this, [])
	}

	getClassStudentsMarks = (students: MergeStudentsExams[], grades: MISGrades) => {

		const { position_count, exam_title } = this.state
		const no_of_positions = parseInt(position_count)


		let students_chunk;

		if (no_of_positions < 0) {
			students_chunk = getStudentExamMarksSheet(students, grades).splice(no_of_positions) // getting slice of bottom students
		} else {
			students_chunk = getStudentExamMarksSheet(students, grades).splice(0, no_of_positions) // from start of array
		}

		const graph_data = students_chunk.reduce((agg, curr) => {

			let marks = { total: 0, obtained: 0 }

			for (const exam of curr.merge_exams) {

				const exam_title_flag = exam_title ? exam.name === exam_title : true

				if (exam_title_flag) {

					marks.obtained += parseFloat(exam.stats.score.toString() || '0')
					marks.total += parseFloat(exam.total_score.toString() || '0')
				}
			}
			return [
				...agg,
				{
					name: curr.name,
					marks_obtained: marks.obtained,
					marks_total: marks.total
				}
			]
		}, [])

		return graph_data
	}

	render() {

		const { years, grades, relevant_students } = this.props

		const graphData = this.getClassStudentsMarks(relevant_students, grades)

		return <>
			<div className="title divider">Students Position in Class</div>
			<div className="section-container section">
				<div className="row">
					<div className="" style={{ marginRight: "10px" }}>
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
							<select {...this.former.super_handle(["position_count"])}>
								<option value="">Show Positions of</option>
								<option value="5">Top 5 Students</option>
								<option value="10">Top 10 Students</option>
								<option value="-5">Last 5 Students</option>
								<option value="-10">Last 10 Students</option>
							</select>
						</div>
					</div>
					<div className="grades-graph">
						<BarChart
							width={780}
							height={380}
							data={graphData}>

							<XAxis dataKey="name" />
							<YAxis label={{ value: 'Total Marks', angle: -90, position: 'insideLeft', textAnchor: 'end' }} />

							<Tooltip />
							<Legend />
							<Bar dataKey="marks_obtained" barSize={50} name="Obtained Marks" fill="#8884d8" />
						</BarChart>
					</div>
				</div>
			</div>
		</>
	}
}

export default ClassTopStudentGraph