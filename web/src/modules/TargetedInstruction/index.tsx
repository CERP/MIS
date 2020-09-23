import React, { useState } from 'react';
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
	const [students, setStudents] = useState([])
	const [subjects, setSubjects] = useState([])
	const [testId, setTestId] = useState('')
	const [testType, setTestType] = useState('')
	const [stdId, setStdId] = useState('')
	const [tests, setTests] = useState([])
	const [label, setLabel] = useState('')
	const [url, setUrl] = useState('')

	const sortedSections = getSectionsFromClasses(props.classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0));

	const getClass = (e: any) => {
		let index = e.target.selectedIndex;
		let el = e.target.childNodes[index]
		setSelectedClass(e.target.value)
		setStudents(getAllStudnets(el.dataset.id))
		getPDF(selectedSubject, e.target.value, testType)
		setSubjects(getSubjectsFromClasses(props.classes, e.target.value))
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
		for (let [id, obj] of Object.entries(props.targeted_instruction.tests)) {
			//@ts-ignore
			if (obj.class === selectedClass && obj.type === testType && obj.subject === selectedSubject) {
				//@ts-ignore
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


	const getAllStudnets = (sectionId: string) => {
		const students = Object.values(props.students)
			.reduce((agg, student) => {
				if (student.section_id === sectionId) {
					return [...agg,
					{ id: student.id, name: student.Name }
					]
				}
				return [...agg,]
			}, [])
		return students
	}

	const getPDF = (selectedSubject: any, selectedClass: any, testType: any) => {
		for (let [id, obj] of Object.entries(props.targeted_instruction['tests'])) {
			//@ts-ignore
			if (obj.type === testType && obj.class === selectedClass && obj.subject === selectedSubject) {
				//@ts-ignore
				setUrl(obj.pdf_url)
				//@ts-ignore
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
		//@ts-ignore
		const res = stdObj.diagnostic_result[selectedTest]
		debugger
		if (res && testType === 'Diagnostic') {
			for (let obj of Object.entries(res && res)) {
				debugger
				questionArr.push({
					"key": obj[0],
					//@ts-ignore
					"value": obj[1].isCorrect
				})

			}
			setQuestions(questionArr)
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
					<select onClick={getClass}>
						<option id="0" value="">Select Section</option>
						{
							sortedSections.map(s => <option key={s.id} data-id={s.id} value={s.namespaced_name}>{s.namespaced_name}</option>)
						}
					</select>
				</div>
				<div className="row">
					<label className="no-print">Subject</label>
					<select className="no-print" onClick={getSubject}>
						<option value="">Select Subject</option>
						{
							subjects && subjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)
						}
					</select>
				</div>
				<div className="row">
					<label className="no-print">Test Type</label>
					<select className="no-print" onClick={getTestType}>
						<option value="">Select Test Type</option>
						<option value="Diagnostic">Diagnostic</option>
						<option value="Monthly">Monthly</option>
					</select>
				</div>
				{(loc === 'grades' || loc === 'report') &&
					<>
						<div className="row">
							<label className="no-print">Students</label>
							<select className="no-print" onClick={getStudent}>
								<option value="">Select Students</option>
								{
									students && students.map((std) => <option key={std.id} value={std.id}>{std.name}</option>)
								}
							</select>
						</div>
						<div className="row">
							<label className="no-print">Test</label>
							<select className="no-print" onClick={getTest}>
								<option value="">Select Test</option>
								{
									tests && tests.map((test) => <option key={test} value={test}>{test}</option>)
								}
							</select>
						</div>
					</>
				}
				{loc === 'test' ? <Diagnostic label={label} url={url} /> :
					loc === 'grades' ?
						<StudentGrades
							questions={questions}
							stdId={stdId}
							testId={testId}
							stdObj={props.students[stdId]} /> :
						<Report name="Humna" />}
			</div>
		</div>
	</Layout>

}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.db.targeted_instruction,
	classes: state.db.classes,
	students: state.db.students
}))(Test)
