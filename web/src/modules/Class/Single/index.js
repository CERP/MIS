import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 } from 'node-uuid'

import Layout from 'components/Layout'
import Former from 'utils/former'

import Dropdown from 'components/Dropdown'

import { createEditClass, addStudentToSection, removeStudentFromSection } from 'actions'

import './style.css'

const blankClass = {
	id: v4(),
	name: "",
	sections: { },
	subjects: {
		// these need to come from a central list of subjects...
	},
	new_subject: ""
}

class SingleClass extends Component {

	constructor(props) {
		super(props);

		const id = props.match.params.id;
		const currClass = id === 'new' ? blankClass : this.props.classes[id]

		this.state = {
			class: currClass
		}

		this.former = new Former(this, ["class"])
	}

	uniqueSubjects = () => {
		// instead of having a db of subjects, just going to derive it from the 
		// sections table.
		// so we need to loop through all sections, pull out the subjects and compile them

		const s = new Set();

		Object.values(this.props.classes)
			.forEach(cl => {
				Object.keys(cl.subjects)
					.forEach(subj => s.add(subj))
			})

		return s;
	}

	onSave = () => {

		// create an id
		// will be overriden if its already in class
		this.props.save(this.state.class);
	}

	addSubject = () => {

		this.setState({
			class: {
				...this.state.class,
				subjects: {
					...this.state.class.subjects,
					[this.state.class.new_subject]: true
				},
				new_subject: ""
			}
		})
	}

	removeSubject = subj => () => {
		const {[subj]: removed, ...rest} = this.state.class.subjects;

		this.setState({
			class: {
				...this.state.class,
				subjects: rest
			}
		})
	}

	removeSection = (id) => () => {

		const {[id]: removed, ...rest} = this.state.class.sections;

		this.setState({
			class: {
				...this.state.class,
				sections: rest 
			}
		})
	}

	addSection = () => {
		this.setState({
			class: {
				...this.state.class,
				sections: {
					...this.state.class.sections,
					[v4()]: {
						name: "New Section"
					}
				}
			}
		}, () => this.props.save(this.state.class))
	}

	addStudent = student => {
		this.props.addStudent(this.state.class.id, student);
	}

	removeStudent = student => {
		this.props.removeStudent(student)
	}

	render() {

		const class_students = Object.values(this.props.students)
			.filter(student => student.class_id == this.state.class.id)

		return <Layout>
			<div className="single-class">
				<div className="title">Edit Class</div>
				<div className="form">
					<div className="row">
						<label>Name</label>
						<input type="text" {...this.former.super_handle(["name"])} placeholder="Name" />
					</div>

					<div className="divider">Subjects</div>
					{
						Object.keys(this.state.class.subjects)
						.map(subject => <div className="row" key={subject}>
							<label>{subject}</label>
							<div className="button" onClick={this.removeSubject(subject)}>Remove</div>
						</div>)
					}

					<div className="row">
						<input list="subjects" {...this.former.super_handle(["new_subject"])}/>
						<datalist id="subjects">
						{
							[...this.uniqueSubjects().keys()]
							.map(subj => <option key={subj} value={subj} />)
						}
						</datalist>
						<div className="button" onClick={this.addSubject} style={{marginLeft: "auto"}}>Add Subject</div>
					</div>

					<div className="divider">Sections</div>
					{
						Object.entries(this.state.class.sections)
							.map(([id, section], i, arr) => <div className="class-section" key={id}>
								<div className="row">
									<label>Section Name</label>
									<input type="text" {...this.former.super_handle(["sections", id, "name"])} />
								</div>

								<div className="row">
									<label>Section Lead</label>
									<select {...this.former.super_handle(["sections", id, "faculty_id"])}>
										<option disabled selected value>select teacher</option>
										{
											Object.values(this.props.faculty)
											.map(faculty => <option value={faculty.id} key={faculty.id}>{faculty.Name}</option>)
										}
									</select>
								</div>

								<div className="students">
									<h4>Students</h4>
									{
										Object.values(this.props.students)
										.filter(student => student.section_id === id)
										.map(student => {
											return <div className="row" key={student.id}>
												<label>{student.Name}</label>
												<div className="button" onClick={() => this.removeStudent(student)}>Remove</div>
											</div>
										})
									}
									<Dropdown items={Object.values(this.props.students)} toLabel={s => s.Name} onSelect={this.addStudent} toKey={s => s.id} placeholder="Student Name" />
								</div>

								<div className="button" onClick={this.removeSection(id)}>Delete Section</div>
							</div>)
					}
					<div className="button" onClick={this.addSection}>Add Section</div>


					<div className="button save" onClick={this.onSave}>Save</div>
				</div>
			</div>
		</Layout>
	}
}

export default connect(state => ({
	//sections: state.db.sections, // maybe this can just be classes. i dont see a problem with the class data structure
	classes: state.db.classes,
	faculty: state.db.faculty,
	students: state.db.students
}), dispatch => ({
	save: (c) => dispatch(createEditClass(c)),
	addStudent: (section_id, student) => dispatch(addStudentToSection(section_id, student)),
	removeStudent: (student) => dispatch(removeStudentFromSection(student))
}))(SingleClass)