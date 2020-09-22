import React, { useState } from 'react';
import Layout from 'components/Layout'
import { RouteComponentProps } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Grades from './Grades'
import Diagnostic from './Diagnostic'
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
	const [students, setStudents] = useState([])
	const [subjects, setSubjects] = useState([])
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
		getPDF(selectedSubject, e.target.value)
		setSubjects(getSubjectsFromClasses(props.classes, e.target.value))
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

	const getSubject = (e: any) => {
		setSelectedSubject(e.target.value)
		getPDF(e.target.value, selectedClass)
	}

	const getPDF = (selectedSubject: any, selectedClass: any) => {
		for (let [id, obj] of Object.entries(props.targeted_instruction['tests'])) {
			//@ts-ignore
			if (obj.type === 'Diagnostic' && obj.class === selectedClass && obj.subject === selectedSubject) {
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

	const getTests = () => {

	}

	const getTestType = (e: any) => {
		setTestType(e.target.value)
		const testArr = []
		for (let [id, obj] of Object.entries(props.targeted_instruction.tests)) {
			//@ts-ignore
			if (obj.class === selectedClass) {
				//@ts-ignore
				testArr.push(obj.name)
			}
		}
		setTests(testArr)
	}

	const getStudent = (e: any) => {
		setStdId(e.target.value)
	}

	return <Layout history={props.history}>
		<div className="analytics">
			<div className="row tabs">
				<Link className={`button ${loc === "test" ? "orange" : ''}`} to="test" replace={true}>Test</Link>
				<Link className={`button ${loc === "grades" ? "blue" : ''}`} to="grades" replace={true}>Grades</Link>
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
				{loc === 'grades' &&
					<>
						<div className="row">
							<label className="no-print">Test</label>
							<select className="no-print" onClick={getTests}>
								<option value="">Select Test</option>
								{
									tests && tests.map((sub) => <option key={sub} value={sub}>{sub}</option>)
								}
							</select>
						</div>
						<div className="row">
							<label className="no-print">Students</label>
							<select className="no-print" onClick={getStudent}>
								<option value="">Select Students</option>
								{
									students && students.map((std) => <option key={std.id} value={std.id}>{std.name}</option>)
								}
							</select>
						</div>
					</>
				}
				{loc === 'test' && <Diagnostic label={label} url={url} />}
			</div>
		</div>
	</Layout>

}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.db.targeted_instruction,
	classes: state.db.classes,
	students: state.db.students
}))(Test)
