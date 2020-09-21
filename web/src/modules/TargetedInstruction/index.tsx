import React, { useState } from 'react';
import Layout from 'components/Layout'
import { RouteComponentProps } from 'react-router-dom'
import { Route, Link } from 'react-router-dom'
import Grades from './Grades'
import Diagnostic from './Diagnostic'

import { connect } from 'react-redux'
import './style.css'
// type P = RootReducerState & RouteComponentProps

interface P {
	classes: RootDBState["classes"]
	targeted_instruction: RootDBState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const Test: React.FC<PropsType> = (props) => {


	const loc = props.location.pathname.split('/').slice(-1).pop();
	const [selectedClass, setSelectedClass] = useState('')
	const [selectedSubject, setSelectedSubject] = useState('')
	const [type, setType] = useState('test')
	const [url, setUrl] = useState('')
	const [label, setLabel] = useState('')

	const classes = [
		"Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"
	]
	const subjects = [
		"Mathematics", "English", "Urdu", "Pak Study", "Science", "Islamiat"
	]

	const getSelectedClass = (e: any) => {
		setSelectedClass(e.target.value)
		getPDF(selectedSubject, e.target.value)
	}

	const getSelectedSubject = (e: any) => {
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
	return <Layout history={props.history}>
		<div className="analytics">
			<div className="row tabs">
				<Link className={`button ${loc === "test" ? "orange" : ''}`} to="test" replace={true}>Test</Link>
				<Link className={`button ${loc === "grades" ? "blue" : ''}`} to="grades" replace={true}>Grades</Link>
			</div>
			<div className="section form">
				<div className="row">
					<label className="no-print">Test Type</label>
					<select className="no-print" onClick={getSelectedClass}>
						<option value="">Select Test Type</option>
						<option value="Diagnostic">Diagnostic</option>
						<option value="Monthly">Monthly</option>
					</select>
				</div>
				<div className="row">
					<label className="no-print">Class/Section</label>
					<select className="no-print" onClick={getSelectedClass}>
						<option value="">Select Class</option>
						{
							classes.map((c) => <option key={c} value={c}>{c}</option>)
						}
					</select>
				</div>
				<div className="row">
					<label className="no-print">Test Subject</label>
					<select className="no-print" onClick={getSelectedSubject}>
						<option value="">Select Subject</option>
						{
							subjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)
						}
					</select>
				</div>
				{loc === 'test' && <Diagnostic label={label} url={url} />}
				{/* {label ? <div className="pdfLabel no-print"><label className="">{label}</label></div> : null}
				{url ? <PDFViewer
					hideNavbar={true}
					document={{
						url: url,
					}}
				/> : null} */}

			</div>
			{/* <Route path="/targeted-instruction/test" component={Diagnostic} />
			<Route path="/targeted-instruction/grades" component={Grades} /> */}
		</div>
	</Layout>

}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.db.targeted_instruction
}))(Test)
// export default Test