import React, { Component } from 'react'
import moment from 'moment';
import { PrintHeader } from '../../../../components/Layout'
import { numberWithCommas } from '../../../Class/Single/ClassFeeMenu'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import qs from 'querystring'
import { getSectionsFromClasses } from '../../../../utils/getSectionsFromClasses';

interface P {
	classes: RootDBState["classes"]
	curr_student: MISStudent
	faculty_id: RootReducerState["auth"]["faculty_id"]
	students: RootDBState["students"]
	settings: RootDBState["settings"]
}

interface S {

}

interface RouteInfo {
	id: string
}

type propTypes = RouteComponentProps<RouteInfo> & P

class printPreview extends Component <propTypes, S>{
	constructor(props: propTypes) {
		super(props)

		this.state = {

		}
	}

	month = () => qs.parse(this.props.location.search).month || ""
	year = () => qs.parse(this.props.location.search).year || ""

	getFilterCondition = (payment: MISStudentPayment) =>
	{
		//when both are empty
		if(this.month() === "" && this.year() === "") {
			return true
		}
		//when month is empty	
		if(this.month() === "" && this.year() !== ""){
			return  moment(payment.date).format("YYYY") === this.year();

		}
		//when year is empty
		if(this.month() !== "" && this.year() === ""){
			return moment(payment.date).format("MMMM") === this.month()

		}
		//when both are not empty
		if(this.month() !== "" && this.year() !== "")
		{
			return moment(payment.date).format("MMMM") === this.month() && moment(payment.date).format("YYYY") === this.year();
		}
	}
	

	render() {

		const { classes, curr_student, settings } = this.props

		const sections =  getSectionsFromClasses(classes)

		let curr_class = ""

		for(let s of sections){
			if(curr_student.section_id === s.id)
			{
				curr_class = s.namespaced_name
				break
			}
		}

		const filteredPayments = Object.entries(curr_student.payments || {})
				.sort(([, a_payment], [, b_payment]) => a_payment.date - b_payment.date)
				.filter(([id,payment]) => this.getFilterCondition(payment))

		const owed = filteredPayments.reduce((agg, [,curr]) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)
		
		const totalOwed = Object.entries(curr_student.payments || {})
				.sort(([, a_payment], [, b_payment]) => a_payment.date - b_payment.date)
				.reduce((agg, [,curr]) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)

	return	<div className="student-fees-ledger">

				<div className="print button" style={{marginBottom:"10px"}} onClick={() => window.print()}>Print</div>

 			 	<div className="voucher-row">
				<StudentLedgerPage 
						filteredPayments = {filteredPayments} 
						owed = {owed}
						totalOwed = {totalOwed} 
						settings = {settings}
						curr_student = {curr_student}
						curr_class = {curr_class}
				/>
				
				<div className="row print-voucher">
					<StudentLedgerPage 
						filteredPayments = {filteredPayments} 
						owed = {owed}
						totalOwed = {totalOwed} 
						settings = {settings}
						curr_student = {curr_student}
						curr_class = {curr_class}
					/>
					<StudentLedgerPage 
						filteredPayments = {filteredPayments} 
						owed = {owed}
						totalOwed = {totalOwed} 
						settings = {settings}
						curr_student = {curr_student}
						curr_class = {curr_class}
				/>

				</div>
			</div>
		</div>
	
  }
}
export default connect((state: RootReducerState, { match: { params: { id } } } : { match: { params: { id: string}}}) => ({
	classes: state.db.classes,
	faculty_id: state.auth.faculty_id,
	curr_student: state.db.students[id],
	settings: state.db.settings,
}))(withRouter(printPreview))


interface StudentLedgerPageProp {
	filteredPayments: [string, MISStudentPayment][] 
	owed: number 
	totalOwed: number
	settings: RootDBState["settings"]
	curr_student: MISStudent
	curr_class: string
}

const StudentLedgerPage : React.SFC < StudentLedgerPageProp > = ({ filteredPayments, owed, totalOwed, settings, curr_student, curr_class }) => {

	return <div className="payment-history section print-page" >
			<PrintHeader settings={settings} logo={""}/>

			<div className="divider">Student Information</div>
				<div className="row info">
					<label> Name:</label>
					<div>{curr_student.Name}</div>
				</div>
				<div className="row info">
					<label> Father Name:</label>
					<div>{curr_student.ManName}</div>
				</div>
				<div className="row info">
					<label> Class Name:</label>
					<div>{curr_class}</div>
				</div>
				<div className="row info">
					<label> Roll #:</label>
					<div>{curr_student.RollNumber}</div>
				</div>
				<div className="row info">
					<label> Adm # :</label>
					<div>{curr_student.RollNumber}</div>
				</div>
				<div className="row info">
					<label style={{ color: owed <= 0 ? "#5ECDB9" : "#FC6171" }}> {owed <= 0 ? "Total Advance:" : "Total Pending:"}</label>
					<div style={{ color: owed <= 0 ? "#5ECDB9" : "#FC6171" }}>{`${numberWithCommas(Math.abs(totalOwed))} Rs`}</div>
				</div>

			<div className="divider">Payment Information</div>

			<div className="table row heading">
				<label><b>Date</b></label>
				<label><b>Label</b></label>
				<label><b>Amount</b></label>
			</div>

			{filteredPayments
				.map(([id, payment]) => {

					return <div className="payment" key={id} >
						<div className="table row">
							<div>{moment(payment.date).format("DD/MM")}</div>
							<div>{payment.type === "SUBMITTED" ? "Payed" : payment.type === "FORGIVEN" ? "Need Scholarship" : payment.fee_name || "Fee"}</div>
							<div>{payment.type === "OWED" ? `${numberWithCommas(payment.amount)}` : `${numberWithCommas(payment.amount)}`}</div>
						</div>
					</div>
				}
			)}

			<div className="table row last">
				<label style={{ color: owed <= 0 ? "#5ECDB9" : "#FC6171" }}><b>{owed <= 0 ? "Advance:" : "Pending:"}</b></label>
				<div style={{ color: owed <= 0 ? "#5ECDB9" : "#FC6171" }}><b>{numberWithCommas( Math.abs(owed))}</b></div>
			</div>
	</div>
}
