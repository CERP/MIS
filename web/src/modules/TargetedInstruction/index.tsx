import React, { useState, useEffect, useMemo } from 'react';
import Layout from 'components/Layout'
import { RouteComponentProps } from 'react-router-dom'
import { Link } from 'react-router-dom'
import StudentGrades from './Grades'
import Diagnostic from './Diagnostic'
import Report from './Report'
import { connect } from 'react-redux'
import { createReport } from 'utils/targetedInstruction'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import getSubjectsFromClasses from 'utils/getSubjectsFromClasses'
import { logSms } from 'actions'
import { addReport } from 'actions'
import './style.css'

interface P {
	faculty_id: string
	classes: RootDBState["classes"]
	students: RootDBState["students"]
	targeted_instruction: RootDBState["targeted_instruction"]

	logSms: (history: MISSMSHistory) => any
	saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport, testId: string) => void
}

type GraphData = {
	[name: string]: number
}

type PropsType = P & RouteComponentProps

const Test: React.FC<PropsType> = (props) => {

	const loc = props.location.pathname.split('/').slice(-1).pop();
	const [selectedSubject, setSelectedSubject] = useState('')
	const [sortedSections, setSortedSections] = useState([])
	const [selectedClass, setSelectedClass] = useState('')
	const [allSubjects, setAllSubjects] = useState<Subjects>({})
	const [questions, setQuestions] = useState({})
	const [sectionId, setSectionId] = useState('')
	const [testId, setTestId] = useState('')
	const [testType, setTestType] = useState('')
	const [report, setReport] = useState('')
	const [stdId, setStdId] = useState('')
	const [tests, setTests] = useState([])
	const [label, setLabel] = useState('')
	const [data, setData] = useState([])
	const [url, setUrl] = useState('')

	useEffect(() => {
		setSortedSections(getSectionsFromClasses(props.classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0)))
		setAllSubjects(getSubjectsFromClasses(props.classes))
	}, [])

	const students = useMemo(
		() => getAllStudents(sectionId, props.students),
		[sectionId]
	)

	const stdReport: Report = useMemo(() => createReport(students, props.targeted_instruction, testId), [students, props.targeted_instruction, testId]);

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

	const getTestList = (testType: string, selectedSubject: string) => {
		const testArr = []
		const misTest: Tests = props.targeted_instruction['tests']
		for (let [, obj] of Object.entries(misTest)) {
			if (obj.class === selectedClass && obj.type === testType && obj.subject === selectedSubject) {
				testArr.push(obj.name)
				setQuestions({})
			}
		}
		return testArr
	}

	const getStudent = (e: any) => {
		setStdId(e.target.value)
		if (testId) {
			setQuestions(getQuestionList(testId, props.students[e.target.value]))
		}
	}

	const getTest = (e: any) => {
		setTestId(e.target.value)
		setQuestions(getQuestionList(e.target.value, props.students[stdId]))
	}

	const getSelected = (e: any) => {
		setReport(e.target.value)
		graphData()
	}

	const getPDF = (selectedSubject: string, selectedClass: string, testType: string) => {
		let misTest: Tests = props.targeted_instruction['tests']
		for (let [, obj] of Object.entries(misTest)) {
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

	const getQuestionList = (selectedTest: string, stdObj: MISStudent) => {
		const res: MISDiagnosticReport = stdObj && stdObj.diagnostic_result && stdObj.diagnostic_result[selectedTest]
		if (res && testType === 'Diagnostic') {
			return Object.entries(res).reduce((acc, [key, value]) => {
				return {
					[key]: {
						"answer": value.isCorrect,
						"correctAnswer": value.answer,
						"slo": value.slo[0]
					},
					...acc
				}
			}, {})
		}
	}

	const graphData = () => {

		let graphData: GraphData = {}, arr = []
		for (let testObj of Object.values((stdReport && stdReport) || {})) {
			for (let [slo, rep] of Object.entries(testObj.report)) {
				graphData[slo] ? graphData[slo] = graphData[slo] + rep.percentage : graphData[slo] = rep.percentage
			}
		}
		for (let [id, percentage] of Object.entries(graphData)) {
			arr.push({ name: id, percentage: Math.round(percentage / Object.entries(props.students).length) })
		}
		arr.sort((a, b) => {
			return b.percentage - a.percentage;
		});
		setData(arr)
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
					<select className="no-print" onChange={getClass}>
						<option id="0" value="">Select Section</option>
						{
							sortedSections && sortedSections.map(s => <option key={s.id} data-id={s.id} value={s.className}>{s.className}</option>)
						}
					</select>
				</div>
				<div className="row">
					<label className="no-print">Subject</label>
					<select className="no-print" onChange={getSubject}>
						<option value="">Select Subject</option>
						{
							(allSubjects[selectedClass] || []).map((sub: any) => <option key={sub} value={sub}>{sub}</option>)
						}
					</select>
				</div>
				<div className="row">
					<label className="no-print">Test Type</label>
					<select className="no-print" onChange={getTestType}>
						<option value="">Select Test Type</option>
						<option value="Diagnostic">Diagnostic</option>
						<option value="Monthly">Monthly</option>
					</select>
				</div>
				{(loc !== "test") &&
					<>
						{((report !== 'All Students' && loc === "report") || loc === "grades") && <div className="row">
							<label className="no-print">Students</label>
							<select className="no-print" onChange={getStudent}>
								<option value="">Select Students</option>
								{
									Object.keys(students).map(function (key) {
										return <option key={students[key].id} value={students[key].id}>{students[key].Name}</option>
									})
								}
							</select>
						</div>}
						<div className="row">
							<label className="no-print">Test</label>
							<select className="no-print" onChange={getTest}>
								<option value="">Select Test</option>
								{
									tests && tests.map((test) => <option key={test} value={test}>{test}</option>)
								}
							</select>
						</div>
					</>
				}
				{loc === 'report' && <div className="row">
					<label className="no-print">Type</label>
					<select className="no-print" onChange={getSelected}>
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
							students={props.students}
							setQuestions={setQuestions}
							saveReport={props.saveReport}
						/> :
						<Report
							testType={testType}
							testId={testId}
							type={report}
							stdId={stdId}
							allStudents={props.students}
							students={students}
							data={data}
							selectedClass={selectedClass}
							stdReport={stdReport}
							faculty_id={props.faculty_id}
							setReport={setReport}
							logSms={props.logSms}
						/>}
			</div>
		</div>
	</Layout>
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.db.targeted_instruction,
	faculty_id: state.auth.faculty_id,
	classes: state.db.classes,
	students: state.db.students
}), (dispatch: Function) => ({
	logSms: (history: MISSMSHistory) => dispatch(logSms(history)),
	saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport, testId: string) => dispatch(addReport(stdId, diagnostic_report, testId)),
}))(Test)

const getAllStudents = (sectionId: string, students: RootDBState["students"]) => {
	return students = Object.values(students)
		.reduce<RootDBState["students"]>((agg, student) => {
			if (student.section_id === sectionId) {
				return {
					...agg,
					[student.id]: student
				}
			}
			return { ...agg, }
		}, {})
}

