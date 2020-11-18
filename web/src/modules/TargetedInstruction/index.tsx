import React, { useState, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom'
import StudentGrades from './Grades'
import Diagnostic from './Diagnostic'
import Report from './Report'
import { connect } from 'react-redux'
import { createAllStdReport, createSingleStdReport, getQuestionList, getSubjectsFromTests } from 'utils/targetedInstruction'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
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

type S = {
	selectedSection: string
	selectedSubject: string
	sectionId: string
	testType: "" | "Diagnostic" | "Monthly"
	type: string
	stdId: string
}

const Test: React.FC<PropsType> = (props) => {

	const loc = props.location.pathname.split('/').slice(-1).pop();

	const [state, setState] = useState<S>({
		selectedSection: '',
		selectedSubject: '',
		sectionId: '',
		testType: '',
		type: '',
		stdId: ''
	})

	const { selectedSubject, selectedSection, sectionId, testType, type, stdId } = state

	const students = useMemo(() => getStudentsBySectionId(sectionId, props.students), [sectionId])
	const sortedSections = useMemo(() => getSectionsFromClasses(props.classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0)), [])
	const selectedClassName = useMemo(() => getClassnameFromSectionId(sortedSections, sectionId), [sectionId])
	const Subjects: string[] = useMemo(() => getSubjectsFromTests(props.targeted_instruction), [])
	const singleStdReport = useMemo(() => createSingleStdReport(students[stdId] && students[stdId].diagnostic_result, props.targeted_instruction, selectedSubject), [stdId, type]);
	const allStdReport = useMemo(() => createAllStdReport(students, props.targeted_instruction, selectedSubject, type), [type])
	const questions = useMemo(() => getQuestionList(selectedSubject, props.students[stdId], testType), [selectedSubject, stdId]);
	const [pdfUrl, pdfLabel] = useMemo(() => getPDF(selectedSubject, selectedClassName, testType, props.targeted_instruction), [selectedSubject, testType]);

	const setType = (type: string) => {
		setState({ ...state, type: type })
	}

	console.log(pdfLabel, pdfUrl)

	return <div className="section form">
		<div className="row no-print">
			<label>Grades</label>
			<select onChange={(e) => setState({ ...state, sectionId: e.target.value })}>
				<option id="" value="">Select Grade</option>
				{
					sortedSections && sortedSections.map(s => <option key={s.id} value={s.id}>{s.namespaced_name}</option>)
				}
			</select>
		</div>
		<div className="row no-print">
			<label>Subject</label>
			<select onChange={(e) => setState({ ...state, selectedSubject: e.target.value })}>
				<option value="">Select Subject</option>
				{
					Subjects.map((sub: any) => <option key={sub} value={sub}>{sub}</option>)
				}
			</select>
		</div>
		<div className="row no-print">
			<label>Test Type</label>
			<select onChange={(e) => setState({ ...state, testType: e.target.value as S["testType"] })}>
				<option value="">Select Test Type</option>
				<option value="Diagnostic">Diagnostic</option>
				<option value="Monthly">Monthly</option>
			</select>
		</div>
		{loc === 'report' && <div className="row">
			<label className="no-print">Type</label>
			<select className="no-print" onChange={(e) => setState({ ...state, type: e.target.value })}>
				<option value="">Select Type</option>
				<option value="Single Student">Single Student</option>
				<option value="All Students">All Students</option>
			</select>
		</div>}
		{(loc !== "test") &&
			<>
				{(type !== 'All Students' && loc === 'report' || loc === 'grades') && <div className="row">
					<label className="no-print">Students</label>
					<select className="no-print" onChange={(e) => setState({ ...state, stdId: e.target.value })}>
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
					selectedClass={selectedSection}
					singleStdReport={singleStdReport}
					allStdReport={allStdReport}
					faculty_id={props.faculty_id}
					setType={setType}
					logSms={props.logSms}
				/>}
	</div>
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

const getStudentsBySectionId = (sectionId: string, students: RootDBState["students"]) => {
	return students = Object.values(students)
		.reduce<RootDBState["students"]>((agg, student) => {
			if (student.section_id === sectionId) {
				return {
					...agg,
					[student.id]: student
				}
			}
			return agg
		}, {})
}

const getPDF = (selectedSubject: string, selectedSection: string, testType: string, targeted_instruction: RootDBState["targeted_instruction"]) => {
	let url, label
	let misTest: Tests = targeted_instruction['tests']
	for (let obj of Object.values(misTest)) {
		if (obj.type === testType && obj.class === selectedSection && obj.subject === selectedSubject) {
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

const getClassnameFromSectionId = (sortedSections: AugmentedSection[], sectionId: string) => {
	return sortedSections.reduce((agg: string, section: AugmentedSection) => {
		if (section.id === sectionId) {
			return section.className
		}
		return agg
	}, '')
}