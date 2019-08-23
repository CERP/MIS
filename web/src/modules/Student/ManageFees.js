import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 } from 'node-uuid'

import { getSectionsFromClasses } from 'utils/getSectionsFromClasses';

import { addMultipleFees, deleteMultipleFees } from 'actions'

import former from 'utils/former'
import Layout from 'components/Layout'
import Banner from 'components/Banner'


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
			fee: {
				name: "",
				type: "",
				amount: "",
				period: ""
			}
		}

		this.former = new former(this, [])
	}

	delete = (stds_fees_id) => {

		if(window.confirm("Are you sure you want to undo added fees?")){

			setTimeout(() => this.setState({ banner: { active: false } }), 3000);
			
			this.props.deleteMultipleFees(stds_fees_id)

			this.setState({
				banner: {
					active: true,
					good: true,
					text: "Bulk fees removed"
				}
			})	
		
		}
	}
	save = () => {

		const { students } = this.props;

		setTimeout(() => this.setState({ banner: { active: false } }), 3000);

		if (this.state.fee.name === "" ||
			this.state.fee.amount === "" ||
			this.state.fee.period === "" ||
			this.state.fee.type === ""
		) {
			return this.setState({
				banner:
				{
					active: true,
					good: false,
					text: "Please fill all the required fields"
				}
			})
		}

		const fees = Object.values(students)
			.filter(s => s.Active && this.state.section_id === "" ? true : s.section_id === this.state.section_id)
			.map(student => {
				const fee_id = v4()
				const { name, amount, type, period } = this.state.fee
				return {
					student,
					fee_id,
					name,
					amount,
					type,
					period
				}
			})

		if (fees === undefined) {
			return this.setState({
				banner:
				{
					active: true,
					good: false,
					text: "There are no students for this Class"
				}
			})
		}

		if (window.confirm("Are you sure you want to add fee to whole class/all students?")) {

			this.props.addMultipleFees(fees)

			this.setState({
				banner: {
					active: true,
					good: true,
					text: "Saved!"
				}
			})
		}

	}

	filterCallBack = () => this.state.feeFilter === "to_all_students" ? this.setState({ section_id: "" }) : true

	render() {

		const { classes } = this.props;

		const reduced_fees = Object.values(this.props.students)
			.filter(x => x.Name && x.fees && x.payments)
			.reduce((agg, curr) => {
				
				const fees = curr.fees;

				Object.entries(fees)
					.forEach(([f_id, fee]) => {

						const fee_key = `${fee.name}-${fee.period}-${fee.type}-${fee.amount}`
						const current_fee_value = agg[fee_key]

						if (current_fee_value === undefined) {
							agg[fee_key] = {
								count: 0, 
								stds_fees_id: {
									[f_id]: curr.id
								}
							}
						}

						if(agg[fee_key]) {
							agg[fee_key] = {
								count: (agg[fee_key].count || 0) + 1,
								stds_fees_id: {
									...agg[fee_key].stds_fees_id,
									[f_id]: curr.id,
								}
							}
						}
					})

				return agg;

			}, {})
			
		const fee_counts = Object.keys(reduced_fees)
								.sort()
								.reduce((agg, curr) => (agg[curr] = reduced_fees[curr], agg), {})

		return <Layout history={this.props.history}>
			<div className="form sms-page">

				{this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false}

				<div className="title">Fee Management</div>
				<div className="form">

					<div className="divider">Add Fees</div>
					<div className="section">
						<div className="row">
							<label>Add To</label>
							<select {...this.former.super_handle(["feeFilter"], () => true, this.filterCallBack)}>
								<option value="" disabled>Select Students</option>
								<option value="to_all_students">All Students</option>
								<option value="to_single_class">Single Class</option>
							</select>
						</div>

						{this.state.feeFilter === "to_single_class" ?  //Section Wise
							<div className="row">
								<label>Select Class</label>
								<select {...this.former.super_handle(["section_id"])}>
									<option value="" disabled>Select class</option>
									{Object.entries(getSectionsFromClasses(classes))
										.map(([id, S]) => <option key={id} value={S.id}>{S.namespaced_name}</option>)
									}
								</select>
							</div> : false}
					</div>
					<div className="section">
						<div className="row">
							<label>Fee Type</label>
							<select {...this.former.super_handle(["fee", "type"])}>
								<option value="" disabled>Select type</option>
								<option value="FEE">Fee</option>
								<option value="SCHOLARSHIP">Scholarship</option>
							</select>
						</div>
						<div className="row">
							<label>Name</label>
							<input type="text" {...this.former.super_handle(["fee", "name"])} placeholder="Enter Name" />
						</div>
						<div className="row">
							<label>Amount</label>
							<input type="text" {...this.former.super_handle(["fee", "amount"])} placeholder="Enter Amount" />
						</div>
						<div className="row">
							<label>Fee Period</label>
							<select {...this.former.super_handle(["fee", "period"])}>
								<option value="" disabled>Select period</option>
								<option value="MONTHLY">Monthly</option>
								<option value="SINGLE">One Time</option>
							</select>
						</div>
						<div className="button blue" onClick={this.save}> Add </div>
					</div>
				</div>

				<div className="divider">Recent Added Fees</div>
				<div className="section">
				{ Object.entries(fee_counts)
					.filter(([, val]) => val.count > 2 )
					.map(([key, val]) => 
						<div className="row" key={key}>
							<label style={{ 'width' : "80%" }}>{ key }</label>
							<div className={ `button red` } style={{ padding : "5px 2px" }} onClick={ () => this.delete (val.stds_fees_id) }>Undo</div>
						</div>
				)}
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
	deleteMultipleFees: (stds_fees_id) => dispatch(deleteMultipleFees(stds_fees_id))
}))(ManageFees);