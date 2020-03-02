import React, { Component } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import calculateGrade from 'utils/calculateGrade'
import { ExamTitles } from 'constants/exam'

import Former from 'utils/former'

type PropsType = {
	relevant_students: MergeStudentsExams[]
	years: string[]
	grades: MISGrades
}

type GraphData = {
	grade: string
	total: string
}

type S = {

} & ExamFilter

class ClassGradesGraph extends Component<PropsType, S> {
	former: Former
	constructor(props: PropsType) {
		super(props)

		this.state = {
			year: "",
			exam_title: ""
		}

		this.former = new Former(this, [])
	}

	getClassGrades = (students: MergeStudentsExams[], grades: MISGrades): GraphData[] => {

		// creating grade record object
		let gradesObject = Object.keys(grades)
			.reduce((agg, curr) => {
				return {
					...agg,
					[curr]: 0
				}
			}, {})

		// aggregating students marks
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

		// creating data map for graph
		const graph_data = Object.entries(gradesObject)
			.reduce((agg, curr) => {
				return [
					...agg,
					{
						grade: curr[0],
						total: curr[1]
					}
				]
			}, []).sort((a, b) => {
				const aPercentage = grades && grades[a.grade] && grades[a.grade].percent ? grades[a.grade].percent : '0'
				const bPercentage = grades && grades[b.grade] && grades[b.grade].percent ? grades[b.grade].percent : '0'
				return parseInt(aPercentage) - parseInt(bPercentage)
			})

		return graph_data
	}


	render() {

		const { years, relevant_students, grades } = this.props

		const graphData = this.getClassGrades(relevant_students, grades)

		return <>
			<div className="title">School Grades</div>
			<div className="section-container section">
				<div className="row">
					<div className="" style={{ marginRight: "10px" }}>
						<div className="row">
							<select {...this.former.super_handle(["year"])}>
								<option value="">Grades for Year</option>
								{
									years
										.map(year => <option key={year} value={year}>{year}</option>)
								}
							</select>
						</div>
					</div>
					<div className="grades-graph">
						<BarChart
							width={680}
							height={300}
							data={graphData}>
							<Tooltip />
							<Legend />
							<XAxis dataKey="grade" />
							<YAxis label={{ value: 'Total Grades', angle: -90, position: 'insideLeft', textAnchor: 'end' }} />
							<Bar dataKey="total" name="Final Grades" fill="#8884d8" minPointSize={5} />
						</BarChart>
					</div>
				</div>
			</div>
		</>
	}
}

export default ClassGradesGraph