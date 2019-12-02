import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import moment from 'moment'
import {v4} from 'node-uuid'

import former from 'utils/former';

import { PrintHeader } from 'components/Layout'
import Banner from 'components/Banner'
import { addMultiplePayments, addPayment, logSms, editPayment } from 'actions'
import { sendSMS } from 'actions/core'
import { checkStudentDuesReturning } from 'utils/checkStudentDues'
import { smsIntentLink } from 'utils/intent'
import { numberWithCommas } from 'utils/numberWithCommas'
import { getFeeLabel } from 'utils/getFeeLabel'
import { getFilteredPayments } from 'utils/getFilteredPayments'
import { sortYearMonths } from 'utils/sortUtils'

import './style.css'

type payment = {
	student: MISStudent;
	payment_id: string;
} & MISStudentPayment

interface P {
	faculty_id: RootReducerState["auth"]["faculty_id"];
	students: RootDBState["students"];
	connected: RootReducerState["connected"];
	settings: RootDBState["settings"];
	feeSMSTemplate: RootDBState["sms_templates"]["fee"];
	schoolLogo: RootDBState["assets"]["schoolLogo"];
	addPayment: (student: MISStudent, id: string, amount: number, date: number, type: MISStudentPayment["type"], fee_id?: string, fee_name?: string) => any;
	addMultiplePayments: (payments: payment[] ) => any;
	sendSMS: (text: string, number: string) => any;
	logSms: (history: any) => any;
	editPayment: (student: MISStudent, payments: MISStudent["payments"]) => any;
}

interface S {
	banner: {
		active: boolean;
		good: boolean;
		text: string;
	};
	payment: {
		active: boolean;
		amount: string;
		type: "SUBMITTED" | "FORGIVEN";
		sendSMS?: boolean;
	};
	month: string;
	year: string;
	edits: MISStudent["payments"];

}

interface RouteInfo {
	id: string;
	famId: string
}

type propTypes = RouteComponentProps<RouteInfo> & P


class StudentFees extends Component <propTypes, S> {

	Former: former
	constructor(props: propTypes) {
		super(props);
		
		const current_month = moment().format("MM/YYYY")
		const edits = Object.entries(this.mergedPayments())
			.filter(([id,payment]) => moment(payment.date).format("MM/YYYY") === current_month && payment.type !== "SUBMITTED")
			.reduce((agg,[id,payment]) => {
				return {
					...agg,
					[id]: {
						amount: payment.amount,
						fee_id: payment.fee_id
					}
				}
			}, {})

		this.state = {
			banner: {
				active: false,
				good: true,
				text: "Saved!"
			},
			payment: {
				active: false,
				amount: "",
				type: "SUBMITTED", // submditted or owed
				sendSMS: false
			},
			month: "",
			year: moment().format("YYYY"),
			edits
		}

		this.Former = new former(this, []);
	}

	student = () => {
		const id = this.props.match.params.id;
		return this.props.students[id];
	}

	familyID = () => {
		return this.props.match.params.famId
	}

	siblings = () => {

		const familyID = this.student() !== undefined ? this.student().FamilyID : this.familyID();

		return Object.values(this.props.students)
			.filter(s => s && s.Name && s.FamilyID && s.FamilyID === familyID)
	}

	mergedPayments = () => {

		const siblings = this.siblings()
		if(siblings.length > 0) {

			const merged_payments = siblings.reduce((agg, curr) => ({
				...agg,
				...Object.entries(curr.payments).reduce((agg, [pid, p]) => { 
					return {
						...agg,
						[pid]: {
							...p,
							fee_name: p.fee_name && `${curr.Name}-${p.fee_name}`
						}
					}
				}, {} as MISStudent['payments'])
			}), {} as { [id: string]: MISStudentPayment})

			return merged_payments;

		}

		return this.student().payments
	}
	
	getFees = () => {
		
		const siblings = this.siblings()

		if(siblings.length > 0) {
			const agg_fees = siblings
				.reduce((agg, curr) => ({
					...agg,
					...Object.entries(curr.fees)
						.reduce((agg, [fid, f]) => { 
							return {
								...agg,
								[fid]: {
									...f
								}
							}
						}, {} as MISStudent['fees'])
				}), {} as { [id: string]: MISStudentFee})

			return agg_fees;
		}
		
		return this.student().fees
    }

	newPayment = () => {
		this.setState({ 
			payment: {
				active: !this.state.payment.active,
				amount: "",
				type: "SUBMITTED"
			}
		})
	}

	addPayment = () => {
		// dispatch addPayment action 

		if(this.state.payment.amount === "") {
			return
		}

		const id = v4();
		const payment: MISStudentPayment = {
			amount: parseFloat(this.state.payment.amount),
			type: this.state.payment.type,
			date: new Date().getTime()
		}

		const balance = [...Object.values(this.mergedPayments()), payment]
					.reduce((agg, curr) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)

		// if single student ledger, get the student else look for sibling for family ledger
		const student = this.student() || this.siblings()[0]

		if(this.state.payment.sendSMS) {
			// send SMS with replace text for regex etc.
			console.log("SENDING MESSAGE", this.state.payment.sendSMS)
			const message = this.props.feeSMSTemplate
					.replace(/\$BALANCE/g, `${balance}`)
					.replace(/\$AMOUNT/g, `${payment.amount}`)
					.replace(/\$NAME/g, student.Name)

			
			if(this.props.settings.sendSMSOption !== "SIM") {
				alert("can only send messages from local SIM");
			} else {
				const url = smsIntentLink({ messages: [{ text: message, number: student.Phone }], return_link: window.location.href })
				
				const historyObj = {
					faculty: this.props.faculty_id,
					date: new Date().getTime(),
					type: "FEE",
					count: 1,
				}

				this.props.logSms(historyObj)
				//this.props.history.push(url);
				window.location.href = url;
			}
		}

		this.props.addPayment(student, id, payment.amount, payment.date, payment.type, payment.fee_id)

		this.setState({
			payment: {
				...this.state.payment,
				active: false
			}
		})
	}

	componentDidMount() {
		// loop through fees, check if we have added 
		// check in case of family ledger
		if(this.student() !== undefined){
			const owedPayments = checkStudentDuesReturning(this.student());
			if (owedPayments.length > 0) {
				this.props.addMultiplePayments(owedPayments);
			}
		}

		if (this.siblings().length > 0) {
			const sibling_payments = this.siblings()
				.reduce((agg, curr) => {
					const curr_student_payments = checkStudentDuesReturning(curr)
					if (curr_student_payments.length > 0) {
						return [
							...agg,
							...curr_student_payments
						]
					}
					return agg
				}, [])

			this.props.addMultiplePayments(sibling_payments)
		}
	}

	componentWillReceiveProps(nextProps: propTypes) {
		// This will make we get the lates changes
		const id = this.props.match.params.id;
		const famId = this.props.match.params.famId

		// if single student ledger, get the student else look for sibling for family ledger
		const student =  nextProps.students[id] || Object.values(nextProps.students).find(student => student && student.FamilyID && student.FamilyID === famId);

		const current_month = moment().format("MM/YYYY")
		const edits = Object.entries(student.payments)
			.filter(([id,payment]) => moment(payment.date).format("MM/YYYY") === current_month && payment.type !== "SUBMITTED")
			.reduce((agg,[id,payment]) => {
				return {
					...agg,
					[id]: {
						amount: payment.amount,
						fee_id: payment.fee_id
					}
				}
			}, {})

			this.setState({
				edits
			})
	}

	onSave = () => {
		this.setState({
			banner: {
				active: true,
				good: true,
				text: "Saved!"
			}
		})

		setTimeout(() => {
			this.setState({
				banner: {
					...this.state.banner,
					active: false
				}
			})
		}, 1000);

		const next_edits = Object.entries(this.state.edits)
			.reduce((agg, [payment_id, { fee_id, amount }]) => {
				return {
					...agg,
					[payment_id]: {
						fee_id,
						amount
					}
				}
			}, {})

		// if single student ledger, get the student else look for sibling for family ledger
		const student = this.student() || this.siblings()[0] 
		
		this.props.editPayment(student, next_edits)
	}

	getOwedAmountStyle = (owed_amount: number): string => {
		return owed_amount <= 0 ? "advance-amount" : "pending-amount"
	}

	render() {
		
		const merged_payments = this.mergedPayments() || {}
		
		const Months =  new Set(
			Object.entries(merged_payments)
				.sort(([, a_payment], [, b_payment]) => a_payment.date - b_payment.date)
				.map(([id, payment]) => moment(payment.date).format("MMMM"))
			)
		const Years = [...new Set(
			Object.entries(merged_payments)
				.sort(([,a_payment],[,b_payment]) => a_payment.date - b_payment.date)
				.map(([id,payment]) => moment(payment.date).format("YYYY"))
			)]
			
		const filteredPayments = getFilteredPayments(merged_payments, this.state.year, this.state.month)

		const filtered_owed = filteredPayments.reduce((agg, [,curr]) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)
		
		const total_owed = Object.entries(merged_payments)
			.reduce((agg, [, curr]) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)

		return <div className="student-fees">
			{ this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false }
			<PrintHeader settings={this.props.settings} logo={this.props.schoolLogo}/>
			<div className="divider">Payments Information</div>
			<div className="table row">
				<label>Total Monthly Fees:</label>
				<div>Rs. {Object.values(this.getFees()).reduce((agg, curr) => curr.type === "FEE" && curr.period === "MONTHLY" ? agg + parseFloat(curr.amount) : agg, 0)}</div>
			</div>

			<div className="table row">
				<label>Total One-Time Fees:</label>
				<div>Rs. {
					Object.values(this.getFees())
						.reduce((agg, curr) => curr.type === "FEE" && curr.period === "SINGLE" ? agg + parseFloat(curr.amount) : agg, 0)
				}</div>
			</div>
			<div className="divider">{this.familyID() !== undefined ? "Family Ledger" : "Student Ledger"}</div>

			<div className="filter row no-print"  style={{marginBottom:"10px"}}>
				<select className="" {...this.Former.super_handle(["month"])} style={{ width: "150px" }}>
				
				<option value="">Select Month</option>
				{
					sortYearMonths(Months).map(Month => {
						return <option key={Month} value={Month}>{Month}</option>	
					})
				}
				</select>
				
				<select className="" {...this.Former.super_handle(["year"])}>
				
				<option value="">Select Year</option>
				{ 
					Years.map(year => {
						return <option key={year} value={year}> {year} </option>
					})
				}
				</select>
			</div>

			{//<div className="student-name print-only" style={{ textAlign: "left", fontWeight: "normal" }}><b>Student Name:</b> {this.student().Name}</div>}
			}
			<div className="payment-history section">
				<div className="table row heading">
					<label><b>Date</b></label>
					<label><b>Label</b></label>
					<label><b>Amount</b></label>
				</div>
					{filteredPayments
						.map(([id, payment]) => {
							return <div className="payment" key={id}>
								<div className="table row">
									<div>{moment(payment.date).format("DD/MM")}</div>
									<div>{getFeeLabel(payment)}</div>
									
									{ this.state.edits[id] !== undefined ? 
										<div className="row" style={{color:"rgb(94, 205, 185)"}}>
											<input style={{textAlign:"right", border: "none"}} type="number" {...this.Former.super_handle(["edits", id, "amount"])} />
											<span className="no-print" style={{ width:"min-content" }}>*</span>
										</div>
									: <div> {numberWithCommas(payment.amount)}</div>}
								</div>
							</div> })
				}
				{
					this.state.month !== "" && <div className={`table row last ${this.getOwedAmountStyle(filtered_owed)}`}>
						<label>{filtered_owed <= 0 ? "Current Month Advance:" : "Current Month Pending:"}</label>
						<div>Rs. {numberWithCommas(Math.abs(filtered_owed))}</div>
					</div>
				}
				<div className={`table row last ${this.getOwedAmountStyle(total_owed)}`}>
					<label>{total_owed <= 0 ? "Total Advance:" : "Total Pending:"}</label>
					<div>Rs. {numberWithCommas(Math.abs(total_owed))}</div>	
				</div>
			</div>
			<div className="form">
			<div className="button save" onClick={this.onSave}>Save</div>
				<div className={`button ${this.state.payment.active ? "orange" : "green"}`} onClick={this.newPayment} style={{marginTop:"10px"}}>{this.state.payment.active ? "Cancel" : "New Entry"}</div>

				{ this.state.payment.active && <div className="new-payment">
					<div className="row">
						<label>Amount</label>
						<input type="number" {...this.Former.super_handle(["payment", "amount"])} placeholder="Enter Amount" />
					</div>
					<div className="row">
						<label>Type</label>
						<select {...this.Former.super_handle(["payment", "type"])}>
							<option value="SUBMITTED">Paid</option>
							<option value="FORGIVEN">Need Scholarship</option>
						</select>
					</div>
					<div className="table row">
						<label>Send SMS</label>
						<select {...this.Former.super_handle(["payment", "sendSMS"])}>
							<option value={"false"}>No SMS Notification</option>
							<option value={"true"}>Send SMS Notification</option>
						</select>
					</div>
					<div className="button save" onClick={this.addPayment}>Add Payment</div>
				</div> }
				<Link className="print button" to={`/student/${this.props.match.params.id}/fee-print-preview?month=${this.state.month}&year=${this.state.year}`}>Print Preview</Link>
			</div>

		</div>
	}
}

export default connect((state: RootReducerState) => ({
	faculty_id: state.auth.faculty_id,
	students: state.db.students,
	connected: state.connected,
	settings: state.db.settings,
	feeSMSTemplate: (state.db.sms_templates || {} as RootDBState["sms_templates"]).fee || "",
	schoolLogo: state.db.assets ? state.db.assets.schoolLogo || "" : "" 
}), (dispatch: Function) => ({
	addPayment: (student: MISStudent, id: string, amount: number, date: number, type: MISStudentPayment["type"], fee_id: string, fee_name: string) => dispatch(addPayment(student, id, amount, date, type, fee_id, fee_name)),
	addMultiplePayments: (payments: payment[]) => dispatch(addMultiplePayments(payments)),
	sendSMS: (text: string, number: string) => dispatch(sendSMS(text, number)),
	logSms: (history: any) => dispatch(logSms(history)),
	editPayment: (student: MISStudent, payments: MISStudent["payments"]) => dispatch(editPayment(student,payments))
}))(withRouter(StudentFees))