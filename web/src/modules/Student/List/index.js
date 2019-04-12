import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from 'query-string'
import {getSectionsFromClasses} from 'utils/getSectionsFromClasses';
import Former from 'utils/former'

import { LayoutWrap } from 'components/Layout';
import Card from 'components/Card'
import Title from 'components/Title';
import {PrintHeader} from 'components/Layout';

import './style.css'
import getStudentLimt from 'utils/getStudentLimit';

const StudentItem = (S) => {
	const cname = S.relevant_section ? S.relevant_section.className : "no class";
	const tags = S.tags !== undefined && Object.keys(S.tags).length > 0 ? Object.keys(S.tags) : false
	return <div className="icon-card">
				<div className="icard-title">
					<Link style={{textDecoration:"none"}} to={`/student/${S.id}/${S.forwardTo}`} key={S.id}>
						{S.Name} 
					</Link>
				</div>
				<div className="icard-para">
					{S.ManName ? <div className="para-row"> {S.ManName} </div> : ""}
					{ S.forwardTo !== "prospective-student" && <div className="para-row"><b></b> {cname /*+ "/" + sname */}</div> }
					{ S.forwardTo !== "prospective-student" && S.AdmissionNumber && 
						<div className="para-row">
							<b>{`Adm #: `}</b>{S.AdmissionNumber}
						</div>}
					{ tags && 
						<div className="row" style={{flexWrap:"wrap"}}>
						{
							 tags
							 .filter(t => t !== "FINISHED_SCHOOL") 
							 .map(t => <div className="tag bg-green"> {t}</div>) 
						}
						</div>
					}
				</div>
			</div>
}

const toLabel = (S) => {
	
	const cname = S.relevant_section ? S.relevant_section.className : "no class";

	return S.Name + S.ManName + cname ;

}

class StudentList extends Component {


	constructor(props) {
	  super(props)
	
	  this.state = {
		showActiveStudent: true,
		showInactiveStudent: false,
		tag:""
	  }
	  this.former = new Former(this, [])
	}

	uniqueTags = (students) => {

		const tags = new Set();

		Object.values(students)
			.filter(s => s.id && s.Name)
			.forEach(s => {
				Object.keys(s.tags || {})
					.forEach(tag => tags.add(tag))
			})

		return tags;
	}

	getListFilterCondition = (item) => {

		//Active is checked and inactive is unchecked
		if( this.state.showActiveStudent && !this.state.showInactiveStudent && this.state.tag === "" ){
			return item.Active
			//Show only Active
		}

		//Active is checked and inactive is unchecked
		if( this.state.showActiveStudent && !this.state.showInactiveStudent && this.state.tag !== "" ){

			if(item.tags === undefined){
				return false
			}
			return item.Active && Object.keys(item.tags).includes(this.state.tag)
			//Show showActiveStudent with selected tag
		}

		//Active is checked and inactive is checked
		if( this.state.showActiveStudent && this.state.showInactiveStudent && this.state.tag === "" ){
			return true
			//show All
		}
		
		//Active is checked and inactive is checked
		if( this.state.showActiveStudent && this.state.showInactiveStudent && this.state.tag !== "" ){

			if(item.tags === undefined){
				return false
			}
			return Object.keys(item.tags).includes(this.state.tag)
			//show all with selected tag
		}

		//Active is unchecked and inactive is checked
		if( !this.state.showActiveStudent && this.state.showInactiveStudent && this.state.tag === "" ){
			return !item.Active
			//show only InActive
		}

		//Active is unchecked and inactive is checked
		if( !this.state.showActiveStudent && this.state.showInactiveStudent && this.state.tag !== "" ){

			if(item.tags === undefined){
				return false
			}
			return !item.Active && Object.keys(item.tags).includes(this.state.tag)
			//Show InActive with selected tag
		}

	}

	render (){
		
		const { classes, students, settings, forwardTo, schoolLogo, max_limit } = this.props

		const sections = getSectionsFromClasses(classes)	
	
		let items = Object.entries(students)
		.filter(([, s]) => s.id && s.Name && (forwardTo === "prospective-student" || this.getListFilterCondition(s)) ) // hiding the error for now.... need to build reporting mechanism
		.sort(([,a], [,b]) => a.Name.localeCompare(b.Name))
		.map( ([id, student]) => {
			const relevant_section = sections.find(section => student.section_id === section.id);
			return { 
				...student,
				relevant_section,
				id,
				forwardTo
			} 
		});	
	
		let create = '/student/new' 
		let createText = "Add new Student"
		
		if(forwardTo === 'marks'){
			create = '';
		}
	
		if(getStudentLimt(students, max_limit)) {
			create = ''
		}
	
		if(forwardTo === "prospective-student"){
			create = "/student/prospective-student/new"
			createText = "New Prospective Student"
			items = items.filter(s => (s.tags !== undefined ) && (s.tags["PROSPECTIVE"]))
		}
		else{
			items = items.filter(s => (s.tags === undefined || !s.tags["PROSPECTIVE"]))
		}
	
		if(forwardTo === 'payment'){
			create = '/fees/manage'
			createText = "Manage Fees"
		}
		
		return <div className="student-list">
			<PrintHeader settings={settings} logo={schoolLogo} />
			<Title className="title">Students</Title>

			<Card
				items = {items}
				Component = {StudentItem}
				create = {create}
				createText = {createText}
				toLabel = {toLabel}>

				{forwardTo !== "prospective-student" && <div className="row filter-container">
					<div className="row checkbox-container">
						<div className="checkbox">
							<input type="checkbox" {...this.former.super_handle(["showActiveStudent"])} style={{height:"20px"}}/>
								Active
						</div>
						<div className="checkbox">
							<input type="checkbox" {...this.former.super_handle(["showInactiveStudent"])} style={{height:"20px"}} />
								InActive
						</div>
					</div>

					<select className="list-select" {...this.former.super_handle(["tag"])}>
						<option value="">Select Tag</option>
						{
							[...this.uniqueTags(students).keys()]
							.filter(tag => tag !== "PROSPECTIVE" && 
								( this.state.showActiveStudent && !this.state.showInactiveStudent ? tag !== "FINISHED_SCHOOL" : true )
							)
							.map(tag => <option key={tag} value={tag}> {tag} </option>)
						}
					</select>
				</div>}

			</Card>

			<div className="print button" onClick={() => window.print()}>Print</div>
		</div>
	}
}

export default connect((state, { location }) => ({ 
	students: state.db.students,
	classes: state.db.classes,
	settings: state.db.settings,
	schoolLogo: state.db.assets ? state.db.assets.schoolLogo || "" : "", 
	forwardTo: qs.parse(location.search, { ignoreQueryPrefix: true }).forwardTo || "profile",
	max_limit: state.db.max_limit || -1
}))(LayoutWrap(StudentList));