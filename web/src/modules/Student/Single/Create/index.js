import React, { Component } from 'react'
import moment from 'moment';
import { v4 } from 'node-uuid'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import checkCompulsoryFields from 'utils/checkCompulsoryFields'


import { createStudentMerge, deleteStudent } from 'actions'

import Banner from 'components/Banner'
import Former from 'utils/former'

import './style.css'

// this page will have all the profile info for a teacher.
// all this data will be editable.

// should come up with reusable form logic. 
// I have an object with a bunch of fields
// text and date input, dropdowns....

const blankStudent = () => ({
	id: v4(),
	Name: "",
	RollNumber: "",
	BForm: "",
	Gender: "",
	Phone: "",
	Fee: 0,
	Active: true,

	ManCNIC: "",
	ManName: "",
	Birthdate: moment().subtract(20, "year"),
	Address: "",
	Notes: "",
	StartDate: moment(),
	AdmissionNumber: "",

	fees: {
		[v4()]: {
			name: "Monthly Fee",
			type: "FEE",
			amount: "",
			period: "MONTHLY"  // M: MONTHLY, Y: YEARLY 
		}
	},
	payments: {},
	attendance: {},
	section_id: ""
})
// should be a dropdown of choices. not just teacher or admin.

class SingleStudent extends Component {

	constructor(props) {
		super(props);

		const id = props.match.params.id;

		this.state = {
			profile: props.students[id] || blankStudent(),
			redirect: false,
			banner: {
				active: false,
				good: true,
				text: "Saved!"
			}
		}

		this.former = new Former(this, ["profile"])

		// console.log(this.state.profile)
	}

	isNew = () => this.props.location.pathname.indexOf("new") >= 0

	onSave = () => {
		console.log('save!', this.state.profile)

		const student = this.state.profile;

		// verify 

		const compulsoryFields = checkCompulsoryFields(this.state.profile, [
			["Name"], 
			["section_id"]
		]);

		if(compulsoryFields) 
		{
			const errorText = "Please Fill " + compulsoryFields + " !!!"
			
				return this.setState({
				banner: {
					visible : true,
					good: false,
					text: errorText
				}
			})
		}

		if(Object.values(this.props.students).some(student => student.section_id === this.state.profile.section_id && student.id !== this.state.profile.id && student.RollNumber !== "" && student.RollNumber === this.state.profile.RollNumber ))
		{
			return this.setState({
				banner: {
					visible : true,
					good: false,
					text: "Roll No Already Exists"
				}
			})
		}

		if(Object.values(this.props.students).some(student => student.id !== this.state.profile.id && student.AdmissionNumber !== "" && student.AdmissionNumber === this.state.profile.AdmissionNumber))
		{
			return this.setState({
				banner: {
					visible : true,
					good: false,
					text: "Admission Number Already Exists"
				}
			})
		}

		for(let fee of Object.values(this.state.profile.fees)) {
			console.log('fees', fee)

			if(fee.type === "" || fee.amount === "" || fee.name === "" || fee.period === "") {
				return this.setState({
					banner: {
						visible: true,
						good: false,
						text: "Please fill out all Fee Information"
					}
				})
			}
		}

		this.props.save(student)
		this.setState({
			banner: {
				visible: true,
				good: true,
				text: "Saved!"
			}
		})

		setTimeout(() => {
			this.setState({
				banner: {
					visible: false
				},
				redirect: this.isNew() ? `/student` : false
			})
		}, 2000);
	}

	addSibling = (sibling) => {
		console.log("ADD SIBLING", sibling)

		// we create another table called "families" with a unique id, and loop and check that map
		// on the student there would be a family id. similar to how we do classes.

		/*
		families: {
			[id]: { 
				name: "",

				students: { [id]: true},
				contact: { phone: number, address: string},
				profile: {
					fathername: "",
					fathercnic: ""
				}
			}
		}

		once added to a family, these fields should also be set on the student profile. if that is the case then it should be above these fields 
		then like a subject, if it's not there they will need to be able to set this 
		*/
	}

	onDelete = () => {
		// console.log(this.state.profile.id)

		this.props.delete(this.state.profile)

		this.setState({
			redirect: `/student`
		})
	}

	addFee = () => {
		this.setState({
			profile: {
				...this.state.profile,
				fees: {
					...this.state.profile.fees,
					[v4()]: {
						name: "",
						type: "FEE", 
						amount: "",
						period: "",
					}
				}
			}
		})
	}

	removeFee = id => () => {
		const {[id]: removed, ...nextFee} = this.state.profile.fees;

		this.setState({
			profile: {
				...this.state.profile,
				fees: nextFee
			}
		})
	}

	componentWillReceiveProps(newProps) {
		// this means every time students upgrades, we will change the fields to whatever was just sent.
		// this means it will be very annoying for someone to edit the user at the same time as someone else
		// which is probably a good thing. 

		this.setState({
			profile: newProps.students[this.props.match.params.id] || this.state.profile
		})
	}

	render() {

		if(this.state.redirect) {
			console.log('redirecting....')
			return <Redirect to={this.state.redirect} />
		}

		return <div className="single-student">
				{ this.state.banner.visible ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false }

				<div className="title">Edit Student</div>


				<div className="form">
					<div className="divider">Personal Information</div>
					
					<div className="row">
						<label>Full Name</label>
						<input type="text" {...this.former.super_handle(["Name"])} placeholder="Full Name" />
					</div>

					<div className="row">
						<label>Roll No</label>
						<input type="text" {...this.former.super_handle(["RollNumber"])} placeholder="Roll Number" />
					</div>
					
					<div className="row">
						<label>B-Form Number</label>
						<input type="number" {...this.former.super_handle(["BForm"])} placeholder="BForm" />
					</div>

					<div className="row">
						<label>Date of Birth</label>
						<input type="date" onChange={this.former.handle(["Birthdate"])} value={moment(this.state.profile.Birthdate).format("YYYY-MM-DD")} placeholder="Date of Birth" />
					</div>

					<div className="row">
						<label>Gender</label>
						<select {...this.former.super_handle(["Gender"])}>
							<option value='' disabled>Please Set a Gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>

					<div className="row">
						<label>Father Name</label>
						<input type="text" {...this.former.super_handle(["ManName"])} placeholder="Father Name" />
					</div>

					<div className="row">
						<label>Father CNIC</label>
						<input type="number" {...this.former.super_handle(["ManCNIC"])} placeholder="Father CNIC" />
					</div>

					<div className="divider">Contact Information</div>

					<div className="row">
						<label>Phone Number</label>
						<input type="tel" {...this.former.super_handle(["Phone"])} placeholder="Phone Number" />
					</div>

					<div className="row">
						<label>Address</label>
						<input type="text" {...this.former.super_handle(["Address"])} placeholder="Address" />
					</div>

					<div className="divider">School Information</div>

					{ this.state.profile.class_id === '' ? false : <div className="row">
						<label>Class Section</label>
						<select {...this.former.super_handle(["section_id"])}>
							{
								 [
									<option key="" value="">Please Select a Section</option>,
									 ...getSectionsFromClasses(this.props.classes)
										 .map(c => <option key={c.id} value={c.id}>{c.namespaced_name}</option>)
								]
							}
						</select>
					</div>
					}

					<div className="row">
						<label>Active Status</label>
						<select {...this.former.super_handle(["Active"])}>
							<option value={true}>Student Currently goes to this School</option>
							<option value={false}>Student No Longer goes to this School</option>
						</select>
					</div>

					<div className="row">
						<label>Admission Date</label>
						<input type="date" onChange={this.former.handle(["StartDate"])} value={moment(this.state.profile.StartDate).format("YYYY-MM-DD")} placeholder="Admission Date"/>
					</div>

					<div className="row">
						<label>Admission Number</label>
						<input type="text" {...this.former.super_handle(["AdmissionNumber"])} placeholder="Admission Number" />
					</div>

					<div className="row">
						<label>Notes</label>
						<textarea {...this.former.super_handle(["Notes"])} placeholder="Notes" />
					</div>

					<div className="divider">Payment</div>
					{
						Object.entries(this.state.profile.fees).map(([id, fee]) => {
							return <div className="section" key={id}>
								<div className="click-label" onClick={this.removeFee(id)}>Remove Fee</div>
								<div className="row">
									<label>Type</label>
									<select {...this.former.super_handle(["fees", id, "type"])}>
										<option value="" disabled>Select Fee or Scholarship</option>
										<option value="FEE">Fee</option>
										<option value="SCHOLARSHIP">Scholarship</option>
									</select>
								</div>
								<div className="row">
									<label>Name</label>
									<input type="text" {...this.former.super_handle(["fees", id, "name"])} placeholder={this.state.profile.fees[id].type === "SCHOLARSHIP" ? "Scholarship Name" : "Fee Name"} />
								</div>
								<div className="row">
									<label>Amount</label>
									<input type="number" {...this.former.super_handle(["fees", id, "amount"])} placeholder="Amount" />
								</div>
								<div className="row">
									<label>Fee Period</label>
									<select {...this.former.super_handle(["fees", id, "period"])}>
										<option value="" disabled>Please Select a Time Period</option>
										<option value="SINGLE">One Time</option>
										<option value="MONTHLY">Every Month</option>
									</select>
								</div>
							</div>
						})
					}
					<div className="button green" onClick={this.addFee}>Add Additional Fee or Scholarship</div>
					<div className="save-delete">
						<div className="button red" onClick={this.onDelete}>Delete</div>
						<div className="button blue" onClick={this.onSave}>Save</div>
					</div>
				</div>
			</div>
	}
}

export default connect(state => ({
	students: state.db.students, classes: state.db.classes }) , dispatch => ({ 
	save: (student) => dispatch(createStudentMerge(student)),
	delete: (student) => dispatch(deleteStudent(student))
 }))(SingleStudent);