import React, { useState, useMemo } from 'react';
import Layout from 'components/Layout'
import { RouteComponentProps } from 'react-router-dom'
import { Link } from 'react-router-dom'
import StudentGrades from './Grades'
import Diagnostic from './Diagnostic'
import Report from './Report'
import { connect } from 'react-redux'
import { createReport, getQuestionList } from 'utils/targetedInstruction'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import getSubjectsFromClasses from 'utils/getSubjectsFromClasses'
import { logSms, addReport } from 'actions'
import './style.css'

interface P {
	faculty_id: string
	classes: RootDBState["classes"]
	students: RootDBState["students"]
	targeted_instruction: RootDBState["targeted_instruction"]

	logSms: (history: MISSMSHistory) => any
	saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport, selectedSubject: string) => void
}

type PropsType = P & RouteComponentProps

const Test: React.FC<PropsType> = (props) => {

	const loc = props.location.pathname.split('/').slice(-1).pop();
	const [selectedSubject, setSelectedSubject] = useState('')
	const [selectedClass, setSelectedClass] = useState('')
	const [sectionId, setSectionId] = useState('')
	const [testType, setTestType] = useState('')
	const [type, setType] = useState('')
	const [stdId, setStdId] = useState('')

	const students = useMemo(() => getAllStudents(sectionId, props.students), [sectionId])
	const sortedSections = useMemo(() => getSectionsFromClasses(props.classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0)), [])
	const allSubjects: Subjects = useMemo(() => getSubjectsFromClasses(props.classes), [props.classes])
	const stdReport: Report = useMemo(() => createReport(students, props.targeted_instruction, selectedSubject), [selectedSubject]);
	const questions = useMemo(() => getQuestionList(selectedSubject, props.students[stdId], testType), [selectedSubject, stdId]);
	const [pdfUrl, pdfLabel] = useMemo(() => getPDF(selectedSubject, selectedClass, testType, props.targeted_instruction), [selectedSubject, testType]);

	const getClass = (e: any) => {
		setSelectedClass(e.target.value)
		let index = e.target.selectedIndex;
		let el = e.target.childNodes[index]
		setSectionId(el.dataset.id)
	}

	return <Layout history={props.history}>
		<div className="analytics">
			<div className="row tabs">
				<Link className={`button ${loc === "test" ? "orange" : ''}`} to="test" replace={true}>Test</Link>
				<Link className={`button ${loc === "grades" ? "blue" : ''}`} to="grades" replace={true}>Grades</Link>
				<Link className={`button ${loc === "report" ? "green" : ''}`} to="report" replace={true}>Report</Link>
			</div>
			<div className="section form">
				<div className="row no-print">
					<label>Grades</label>
					<select onChange={getClass}>
						<option id="" value="">Select Grade</option>
						{
							sortedSections && sortedSections.map(s => <option key={s.id} data-id={s.id} value={s.className}>{s.className}</option>)
						}
					</select>
				</div>
				<div className="row no-print">
					<label>Subject</label>
					<select onChange={(e) => setSelectedSubject(e.target.value)}>
						<option value="">Select Subject</option>
						{
							(allSubjects[selectedClass] || []).map((sub: any) => <option key={sub} value={sub}>{sub}</option>)
						}
					</select>
				</div>
				<div className="row no-print">
					<label>Test Type</label>
					<select onChange={(e) => setTestType(e.target.value)}>
						<option value="">Select Test Type</option>
						<option value="Diagnostic">Diagnostic</option>
						<option value="Monthly">Monthly</option>
					</select>
				</div>
				{loc === 'report' && <div className="row">
					<label className="no-print">Type</label>
					<select className="no-print" onChange={(e) => setType(e.target.value)}>
						<option value="">Select Type</option>
						<option value="Single Student">Single Student</option>
						<option value="All Students">All Students</option>
					</select>
				</div>}
				{(loc !== "test") &&
					<>
						{((type !== 'All Students' && loc === "report") || loc === "grades") && <div className="row">
							<label className="no-print">Students</label>
							<select className="no-print" onChange={(e) => setStdId(e.target.value)}>
								<option value="">Select Students</option>
								{
									Object.values(students)
										.sort((a, b) => a.Name.localeCompare(b.Name))
										.map((std) => (<option key={std.id} value={std.id}>{std.Name}</option>))
								}
							</select>
						</div>}
					</>
				}
				{loc === 'test' ? <Diagnostic label={pdfLabel} url={pdfUrl} /> :
					loc === 'grades' ?
						<StudentGrades
							questions={questions}
							stdId={stdId}
							testId={selectedSubject}
							testType={testType}
							students={props.students}
							saveReport={props.saveReport}
						/> :
						<Report
							testType={testType}
							testId={selectedSubject}
							type={type}
							stdId={stdId}
							students={students}
							selectedClass={selectedClass}
							stdReport={stdReport}
							faculty_id={props.faculty_id}
							setType={setType}
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
	saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport, selectedSubject: string) => dispatch(addReport(stdId, diagnostic_report, selectedSubject)),
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

const getPDF = (selectedSubject: string, selectedClass: string, testType: string, targeted_instruction: RootDBState["targeted_instruction"]) => {
	let url, label
	let misTest: Tests = targeted_instruction['tests']
	for (let obj of Object.values(misTest)) {
		if (obj.type === testType && obj.class === selectedClass && obj.subject === selectedSubject) {
			url = obj.pdf_url
			label = obj.label
			break
		} else {
			url = ''
			label = ''
		}
	}
	return [url, label]
}
