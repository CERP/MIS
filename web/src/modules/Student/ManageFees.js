import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 } from 'node-uuid'

import {getSectionsFromClasses} from 'utils/getSectionsFromClasses';

import { addMultipleFees, addFee, addPayment } from 'actions'

import former from 'utils/former'
import Layout from 'components/Layout'
import Banner from 'components/Banner'
import moment from 'moment'


class ManageFees extends Component {

	constructor(props) {
		super(props);

		this.state = {
			banner: {
				active: false,
				good: true,
				text: "Saved!"
			},
			feeFilter: "to_all_students",
			section_id: "",
			selected_student_id: "",
			fee: {
					name: "",
					type: "",
					amount: "",
					period: "" 
				} 
		}

		this.former = new former(this, [])
	}

	save = () => {
		
		const { students } = this.props;

		if( this.state.fee.name === "" || 
			this.state.fee.amount	=== "" || 
			this.state.fee.period === "" || 
			this.state.fee.type === ""
			){
				setTimeout(() => this.setState({ banner: { active: false } }), 3000);
				return this.setState({
					banner:
					{
						active: true,
						good:false,
						text: "Please fill all of the information"
					}
				})
			}
		
		if(this.state.feeFilter === "to_all_students" || this.state.feeFilter === "to_single_class") {
		
			const fees = Object.values(students)
				.filter( s => s.Active && this.state.section_id === "" ? true : s.section_id === this.state.section_id)
				.map(student => {
					const fee_id = v4()
					const {name, amount, type, period } = this.state.fee
					return {
							student,
							fee_id,
							name,
							amount,
							type,
							period
						}
					})

			if(fees === undefined){
				return this.setState({
					banner:
					{
						active: true,
						good:false,
						text: "There are no students for this Class"
					}
				})
			}
			
			// invoking multiple method
			this.props.addMultipleFees(fees)
		}

		if(this.state.feeFilter === "to_single_student" && this.state.selected_student_id !=="") {
			
			const fee_id = v4()
			const student_fee = {
				student_id: this.state.selected_student_id,
				fee_id: fee_id,
				...this.state.fee
			}

			const student = {
				id: this.state.selected_student_id
			}
			const payment_id = fee_id
			const amount = parseFloat(this.state.fee.amount)
			const name  = this.state.fee.name
			const date = moment.now()
			const type = "SUBMITTED"
			
			// add fee
			this.props.addFee(student_fee)
			// add payment
			this.props.addPayment(student, payment_id, amount, date, type, fee_id, name);

		}

		this.setState({
			banner: {
				active: true,
				good: true,
				text: "Fee added successfully"
			}
		})
		setTimeout(() => this.setState({ banner: { active: false } }), 3000);
	}

	filterCallBack = () => this.state.feeFilter === "to_all_students" ? this.setState({ section_id: "" }) : true 

	render() {
		
		const { classes } = this.props;
		const sortedSections = getSectionsFromClasses(classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0));

		return <Layout history={this.props.history}>
			<div className="sms-page">
				{ this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false }

				<div className="title">Fee Management</div>
				<div className="form">
					<div className="divider">Add Fees</div>
					<div className="section">
						<div className="row"> 
							<label>Add To</label>		
							<select {...this.former.super_handle(["feeFilter"], () => true, this.filterCallBack)}>
								<option value="">Select Students</option>
								<option value="to_all_students">All Students</option>
								<option value="to_single_class">Single Class</option>
								<option value="to_single_student">Single Student</option>
							</select>
						</div>

						{this.state.feeFilter === "to_single_class" || this.state.feeFilter === "to_single_student" ?  //Section Wise
                        <div className="row"> 
							<label>Select Class</label>		
							<select {...this.former.super_handle(["section_id"])}>
								<option value="" >Select class</option>
								{
									sortedSections.map( s => <option key={s.id} value={s.id}>{s.namespaced_name}</option>)
								}
							</select>
						</div> : false}
						{this.state.feeFilter === "to_single_student" && this.state.section_id != "" ?
						<div className = "row">
							<label>Select student</label>
							<select {...this.former.super_handle(["selected_student_id"])}>
								<option value = "">Select student</option>
								{
									Object.values(this.props.students)
										  .filter(  s => s.Active && s.section_id === this.state.section_id)
										  .map(s => <option key={s.id} value={s.id}>{s.Name}</option>)
								}
							</select>
						</div> : false}
					</div>

					<div className="section">
                        <div className="row"> 
							<label>Fee Type</label>		
							<select {...this.former.super_handle(["fee","type"])}>
								<option value="">Select</option>
								<option value="FEE">Fee</option>
								<option value="SCHOLARSHIP">Scholarship</option>
							</select>
						</div>
                        <div className="row"> 
                            <label>Name</label>		
                            <input type="text" {...this.former.super_handle(["fee","name"])} placeholder="Enter Name"/>
						</div>
                        <div className="row"> 
                            <label>Amount</label>		
                            <input type="text" {...this.former.super_handle(["fee","amount"])} placeholder="Enter Amount"/>
						</div>
                        <div className="row">
                        	<label>Fee Period</label>		
							<select {...this.former.super_handle(["fee","period"])}>
								<option value="">Select</option>
								<option value="MONTHLY">Monthly</option>
								<option value="SINGLE">One Time</option>
							</select>
						</div>
                        <div className="button blue" onClick={this.save}> Add </div>
					</div>
				</div>
			</div>
		</Layout>
	}
}

export default connect(state => ({
	students: state.db.students,
	classes: state.db.classes,
}), dispatch => ({
	addMultipleFees: (fees) => dispatch(addMultipleFees(fees)),
	addFee: (fee) => dispatch(addFee(fee)),
	addPayment: (student, payment_id, amount, date, type, fee_id, fee_name) => dispatch(addPayment(student, payment_id, amount, date, type, fee_id, fee_name)) 
}))(ManageFees);