import React, { Component } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import getStudentExamMarksSheet from 'utils/studentExamMarksSheet'
import { StudentsPerformanceList } from 'components/Printable/ResultCard/studentPerformance'
import chunkify from 'utils/chunkify'
import { Link } from 'react-router-dom'
import calculateGrade from 'utils/calculateGrade'

type PropsType = {
	relevant_students: MergeStudentsExams[]
	grades: MISGrades
	classes?: RootDBState["classes"]
}

type GraphData = {
	total_marks: number
	marks_obtained: number
	percentage: number
} & StudentMarksSheet

const CHUNK_SIZE = 22

class StudentsPerformance extends Component<PropsType> {

	getPercentage = (marks_obtained: number, total_marks: number): number => {

		const percentage = (marks_obtained / total_marks) * 100

		return parseFloat(percentage.toFixed(2))
	}

	getStudentsExamsData = (students: MergeStudentsExams[], grades: MISGrades): GraphData[] => {

		const marks_sheet = getStudentExamMarksSheet(students, grades)

		const graph_data = marks_sheet.reduce<GraphData[]>((agg, curr) => {

			let marks = { total: 0, obtained: 0 }

			for (const exam of curr.merge_exams) {

				marks.obtained += parseFloat(exam.stats.score.toString() || '0')
				marks.total += parseFloat(exam.total_score.toString() || '0')
			}

			return [
				...agg,
				{
					id: curr.id,
					name: curr.name,
					manName: curr.manName,
					rollNo: curr.rollNo,
					marks_obtained: marks.obtained,
					total_marks: marks.total,
					grade: calculateGrade(marks.obtained, marks.total, grades),
					percentage: this.getPercentage(marks.obtained, marks.total)
				}
			]
		}, [])

		return graph_data
	}

	render() {

		const { grades, relevant_students } = this.props

		const graph_data = this.getStudentsExamsData(relevant_students, grades)

		const ascending_sorted_data = [...graph_data].sort((a, b) => a.percentage - b.percentage)
		const descending_sorted_data = [...graph_data].sort((a, b) => b.percentage - a.percentage)

		return <>
			<div className="school-grades-graph no-print">
				<div className="title divider">Students Position Graph</div>
				<div className="section">
					<ResponsiveContainer width="100%" height={280}>
						<BarChart
							data={ascending_sorted_data}>

							<XAxis dataKey="percentage" />
							<YAxis />

							<Tooltip itemSorter={() => 1} />

							<Bar dataKey="name" barSize={0} fill="#93d0c5" />
							<Bar dataKey="percentage" barSize={40} fill="#fc6171"></Bar>
							<Bar dataKey="grade" barSize={0} fill="" />

						</BarChart>
					</ResponsiveContainer>
				</div>
				<div className="divider">Students Position List</div>
				<div className="section">
					<div className="table row">
						<label><b>Name</b></label>
						<label><b>Marks</b></label>
						<label><b>Percentage</b></label>
						<label><b>Grade</b></label>
					</div>
					{
						descending_sorted_data
							.map(student => <div className="table row" key={student.id}>
								<Link to={`/student/${student.id}/marks`}>{student.name}</Link>
								<div>{student.marks_obtained}/{student.total_marks}</div>
								<div>{student.percentage}%</div>
								<div>{student.grade}</div>
							</div>)
					}
					<div className="print button" onClick={() => window.print()} style={{ marginTop: "10px" }}>Print</div>
				</div>
			</div>
			{
				chunkify(descending_sorted_data, CHUNK_SIZE)
					.map((items: GraphData[], i: number) => <StudentsPerformanceList key={i}
						items={items}
						schoolName={""}
						chunkSize={i === 0 ? 0 : CHUNK_SIZE * i}
					/>)
			}
		</>
	}
}

export default StudentsPerformance