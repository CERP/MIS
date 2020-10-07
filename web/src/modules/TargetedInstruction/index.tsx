//@ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import Layout from 'components/Layout'
import { RouteComponentProps } from 'react-router-dom'
import { Link } from 'react-router-dom'
import StudentGrades from './Grades'
import Diagnostic from './Diagnostic'
import Report from './Report'
import { connect } from 'react-redux'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import getSubjectsFromClasses from 'utils/getSubjectsFromClasses'
import './style.css'

interface P {
	classes: RootDBState["classes"]
	students: RootDBState["students"]
	targeted_instruction: RootDBState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const Test: React.FC<PropsType> = (props) => {

	const loc = props.location.pathname.split('/').slice(-1).pop();

	const [selectedSubject, setSelectedSubject] = useState('')
	const [selectedClass, setSelectedClass] = useState('')
	const [questions, setQuestions] = useState([])
	const [testId, setTestId] = useState('')
	const [testType, setTestType] = useState('')
	const [report, setReport] = useState('')
	const [stdId, setStdId] = useState('')
	const [tests, setTests] = useState([])
	const [label, setLabel] = useState('')
	const [url, setUrl] = useState('')
	const [data, setData] = useState([])
	const [allSubjects, setAllSubjects] = useState({})
	const [sortedSections, setSortedSections] = useState([])
	const [sectionId, setSectionId] = useState('')

	useEffect(() => {
		setSortedSections(getSectionsFromClasses(props.classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0)))
		setAllSubjects(getSubjectsFromClasses(props.classes))
	}, [])

	const students = useMemo(
		() => getAllStudents(sectionId, props.students),
		[sectionId]
	)

	const getClass = (e: any) => {
		setSelectedClass(e.target.value)
		let index = e.target.selectedIndex;
		let el = e.target.childNodes[index]
		setSectionId(el.dataset.id)
		getPDF(selectedSubject, e.target.value, testType)

	}

	const getSubject = (e: any) => {
		setSelectedSubject(e.target.value)
		if (testType) {
			getPDF(e.target.value, selectedClass, testType)
			setTests(getTestList(testType, e.target.value))
		}
	}

	const getTestType = (e: any) => {
		setTestType(e.target.value)
		getPDF(selectedSubject, selectedClass, e.target.value)
		setTests(getTestList(e.target.value, selectedSubject))
	}

	const getTestList = (testType: any, selectedSubject: any) => {
		const testArr = []
		for (let [, obj] of Object.entries(props.targeted_instruction.tests)) {
			if (obj.class === selectedClass && obj.type === testType && obj.subject === selectedSubject) {
				testArr.push(obj.name)
				setQuestions([])
			}
		}
		return testArr
	}

	const getStudent = (e: any) => {
		setStdId(e.target.value)
		if (testId) {
			getQuestionList(testId, props.students[e.target.value])
		}
	}

	const getTest = (e: any) => {
		setTestId(e.target.value)
		getQuestionList(e.target.value, props.students[stdId])
	}

	const getSelected = (e: any) => {
		setReport(e.target.value)
		graphData()
	}

	const getPDF = (selectedSubject: any, selectedClass: any, testType: any) => {
		for (let [, obj] of Object.entries(props.targeted_instruction['tests'])) {
			if (obj.type === testType && obj.class === selectedClass && obj.subject === selectedSubject) {
				setUrl(obj.pdf_url)
				setLabel(obj.label)
				break;
			} else {
				setUrl('')
				setLabel('')
			}
		}
	}

	const getQuestionList = (selectedTest: any, stdObj: any) => {
		let questionArr = []
		const res = stdObj.diagnostic_result && stdObj.diagnostic_result[selectedTest]
		if (res && testType === 'Diagnostic') {
			for (let obj of Object.entries(res && res)) {
				questionArr.push({
					"question": obj[0],
					"answer": obj[1].isCorrect,
					"correctAnswer": obj[1].answer
				})

			}
			setQuestions(questionArr.reverse())
		}
	}

	const graphData = () => {

		let graphData = {}
		if (testId) {
			for (let [, student] of Object.entries(props.students)) {
				const test = student.report && student.report[testType] && student.report[testType][testId]
				if (test) {
					for (let [testId, testObj] of Object.entries(test)) {
						if (graphData[testId]) {
							graphData[testId] += testObj.percentage
						} else {
							graphData[testId] = testObj.percentage
						}
					}
				}
			}
			let arr = []
			for (let [id, graphObj] of Object.entries(graphData)) {
				arr.push(
					{ name: id, percentage: Math.round(graphObj / Object.entries(props.students).length) }
				)
			}
			setData(arr)
		}
	}


	return <Layout history={props.history}>
		<div className="analytics">
			<div className="row tabs">
				<Link className={`button ${loc === "test" ? "orange" : ''}`} to="test" replace={true}>Test</Link>
				<Link className={`button ${loc === "grades" ? "blue" : ''}`} to="grades" replace={true}>Grades</Link>
				<Link className={`button ${loc === "report" ? "green" : ''}`} to="report" replace={true}>Report</Link>
			</div>
			<div className="section form">
				<div className="row">
					<label className="no-print">Class/Section</label>
					<select className="no-print" onChange={(e) => getClass(e)}>
						<option id="0" value="">Select Section</option>
						{
							sortedSections && sortedSections.map(s => <option key={s.id} data-id={s.id} value={s.className}>{s.className}</option>)
						}
					</select>
				</div>
				<div className="row">
					<label className="no-print">Subject</label>
					<select className="no-print" onChange={(e) => getSubject(e)}>
						<option value="">Select Subject</option>
						{
							(allSubjects[selectedClass] || []).map((sub) => <option key={sub} value={sub}>{sub}</option>)
						}
					</select>
				</div>
				<div className="row">
					<label className="no-print">Test Type</label>
					<select className="no-print" onChange={(e) => getTestType(e)}>
						<option value="">Select Test Type</option>
						<option value="Diagnostic">Diagnostic</option>
						<option value="Monthly">Monthly</option>
					</select>
				</div>
				{(loc !== "test") &&
					<>
						{((report !== 'All Students' && loc === "report") || loc === "grades") && <div className="row">
							<label className="no-print">Students</label>
							<select className="no-print" onChange={(e) => getStudent(e)}>
								<option value="">Select Students</option>
								{
									students && students.map((std) => <option key={std.id} value={std.id}>{std.Name}</option>)
								}
							</select>
						</div>}
						<div className="row">
							<label className="no-print">Test</label>
							<select className="no-print" onChange={(e) => getTest(e)}>
								<option value="">Select Test</option>
								{
									tests && tests.map((test) => <option key={test} value={test}>{test}</option>)
								}
							</select>
						</div>
					</>
				}
				{loc === 'report' && <div className="row">
					<label className="no-print">Select</label>
					<select className="no-print" onChange={(e) => getSelected(e)}>
						<option value="">Select Type</option>
						<option value="Single Student">Single Student</option>
						<option value="All Students">All Students</option>
					</select>
				</div>}
				{loc === 'test' ? <Diagnostic label={label} url={url} /> :
					loc === 'grades' ?
						<StudentGrades
							questions={questions}
							stdId={stdId}
							testId={testId}
							testType={testType}
							stdObj={props.students[stdId]} /> :
						<Report
							testId={testId}
							testType={testType}
							type={report}
							stdId={stdId}
							setReport={setReport}
							allStudents={students}
							data={data}
							selectedClass={selectedClass}
						/>}
			</div>
		</div>
	</Layout>

}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.db.targeted_instruction,
	classes: state.db.classes,
	students: state.db.students
}))(Test)

type getAllStudents = {
	(sectionId: sectionId, studentsObj: P["students"])
}

const getAllStudents: getAllStudents = (sectionId, studentsObj) => {
	const students = Object.values(studentsObj)
		.reduce((agg, student) => {
			if (student.section_id === sectionId) {
				return [...agg,
					student
				]
			}
			return [...agg,]
		}, [])
	return students
}