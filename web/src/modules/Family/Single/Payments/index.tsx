import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment'
import {v4} from 'node-uuid'

import former from 'utils/former';

import Banner from 'components/Banner'
import { addMultiplePayments, addPayment, logSms, editPayment } from 'actions'
import { sendSMS } from 'actions/core'
import { checkStudentDuesReturning } from 'utils/checkStudentDues'
import { smsIntentLink } from 'utils/intent'
import { numberWithCommas } from 'utils/numberWithCommas'
import { getFeeLabel } from 'utils/getFeeLabel'
import { getFilteredPayments } from 'utils/getFilteredPayments'
import { sortYearMonths } from 'utils/sortUtils'

type payment = {
	student: MISStudent
	payment_id: string
} & MISStudentPayment

interface P {
	faculty_id: RootReducerState["auth"]["faculty_id"]
	students: RootDBState["students"]
	connected: RootReducerState["connected"]
	settings: RootDBState["settings"]
    feeSMSTemplate: RootDBState["sms_templates"]["fee"]
    addPayment: (student: MISStudent, id: string, amount: number, date: number, type: MISStudentPayment["type"], fee_id?: string, fee_name?: string) => any;
	addMultiplePayments: (payments: payment[]) => any;
	sendSMS: (text: string, number: string) => any;
	logSms: (history: any) => any;
	editPayment: (student: MISStudent, payments: MISStudent["payments"]) => any;
}

interface S {
	banner: {
		active: boolean;
		good: boolean
		text: string
	};
	payment: {
		active: boolean
		amount: string
		type: "SUBMITTED" | "FORGIVEN"
		sendSMS?: boolean
    };
    sibling: string
	month: string
    year: string
	edits: MISStudent["payments"]
}

interface RouteInfo {
	id: string
}

type propTypes = RouteComponentProps<RouteInfo> & P

class FamilyFees extends Component <propTypes, S> {

	Former: former
	constructor(props: propTypes) {
        super(props);
        
        const edits = Object.entries(this.getCurrentMonthSiblingsPayments(this.getSiblings(this.famId())))
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
				type: "SUBMITTED", // submitted or owed
				sendSMS: false
            },
            sibling: "",
			month: "",
            year: moment().format("YYYY"),
            edits
		}

		this.Former = new former(this, []);
	}

    getSiblings = (familyId: string): MISStudent[] => { 
        return Object.values(this.props.students)
                .filter(s => s.Name && s.FamilyID && s.FamilyID === familyId)
    }

    getCurrentMonthSiblingsPayments = (siblings: MISStudent[]) => {
        
        const current_period = moment().format("MM/YYYY")

        const unmerged_payments = siblings
            .reduce((agg, curr) => ({
                ...agg,
                ...Object.entries(curr.payments)
                    .filter(([pid, p]) => p && p.type !=="SUBMITTED" && moment(p.date).format("MM/YYYY") === current_period )
                    .reduce((agg, [pid, p]) => { 
                        return {
                            ...agg,
                            [pid]: {
                                ...p
                            }
                        }
                }, {} as MISStudent['payments'])
            }), {} as { [id: string]: MISStudentPayment})

        return unmerged_payments;
    }

    getSiblingsPayments = (siblings: MISStudent[], sibling_name: string) => {
        const merged_payments = siblings
            .filter(sibling => sibling_name !== "" ? sibling.Name === sibling_name : true)
            .reduce((agg, curr) => ({
                ...agg,
                ...Object.entries(curr.payments).reduce((agg, [pid, p]) => { 
                    return {
                        ...agg,
                        [pid]: {
                            ...p,
                            fee_name: sibling_name !== "" ? p.fee_name && `${curr.Name}-${p.fee_name}` : p.fee_name || ""
                        }
                    }
                }, {} as MISStudent['payments'])
            }), {} as { [id: string]: MISStudentPayment})

        return merged_payments;
    }

    getSiblingFees = (siblings: MISStudent[], sibling_name: string) => {
        const agg_fees = siblings
            .filter(sibling => sibling_name !== "" ? sibling.Name === sibling_name : true)
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

    newPayment = (): void => {
		this.setState({ 
			payment: {
				active: !this.state.payment.active,
				amount: "",
				type: "SUBMITTED"
			}
		})
    }
    
    addPayment = (sibling: MISStudent) => {
        
        // need to add check here, so sibling must select first to add payment
        if(this.state.sibling === "")
        {
            alert("Please select sibling first to add payment")
            return
        }

		if(this.state.payment.amount === "") {
			return
		}

        const id = v4();
        
		const payment: MISStudentPayment = {
			amount: parseFloat(this.state.payment.amount) || 0,
			type: this.state.payment.type,
			date: new Date().getTime()
		}

		const balance = [...Object.values(sibling.payments), payment]
					.reduce((agg, curr) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)

		if(this.state.payment.sendSMS) {
			// send SMS with replace text for regex etc.
			const message = this.props.feeSMSTemplate
					.replace(/\$BALANCE/g, `${balance}`)
					.replace(/\$AMOUNT/g, `${payment.amount}`)
					.replace(/\$NAME/g, sibling.Name)

			if(this.props.settings.sendSMSOption !== "SIM") {
				alert("can only send messages from local SIM");
			} else {
				const url = smsIntentLink({ messages: [{ text: message, number: sibling.Phone }], return_link: window.location.href })				
				const historyObj = {
					faculty: this.props.faculty_id,
					date: new Date().getTime(),
					type: "FEE",
					count: 1,
                }
                
				this.props.logSms(historyObj)
				window.location.href = url;
			}
		}

        // adding payment of selected sibling 
		this.props.addPayment(sibling, id, payment.amount, payment.date, payment.type, payment.fee_id)

		this.setState({
			payment: {
				...this.state.payment,
				active: false
			}
		})
    }
    
    onSave = (sibling: MISStudent) => {
        
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
    
        if(this.state.sibling === "") {
            alert("Please select sibling first to update fee")
            return
        }

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

		this.props.editPayment(sibling, next_edits)
    }
    
    componentDidMount() {
    
        const sibling_payments = this.getSiblings(this.famId())
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

	componentWillReceiveProps(newProps: propTypes) {
	
        const siblings =  Object.values(newProps.students)
            .filter(s => s.Name && s.FamilyID && s.FamilyID === this.famId())
        
        const edits = Object.entries(this.getCurrentMonthSiblingsPayments(siblings))
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
    
    famId = (): string => this.props.match.params.id
    
    render() {
        
        const famId = this.famId()
        const siblings = this.getSiblings(famId)
        
        const selected_sibling = siblings.find(sibling => sibling.Name === this.state.sibling)

        let months = new Set<string>()
		let years = new Set<string>()

		for(const sibling of siblings) {
            for(const [, payment] of Object.entries(sibling.payments) ) {
                months.add(moment(payment.date).format("MMMM"))
                years.add(moment(payment.date).format("YYYY"))
            }
        }
        
        const filteredPayments = getFilteredPayments(this.getSiblingsPayments(siblings, this.state.sibling), this.state.year, this.state.month)
        
        const owed = filteredPayments.reduce((agg, [,curr]) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)
        
        const totalMonthFees = Object.values(this.getSiblingFees(siblings, this.state.sibling))
            .reduce((agg, curr) => curr.type === "FEE" && curr.period === "MONTHLY" ? agg + parseFloat(curr.amount) : agg, 0)
        
        const totalOneTimeFees = Object.values(this.getSiblingFees(siblings, this.state.sibling))
            .reduce((agg, curr) => curr.type === "FEE" && curr.period === "SINGLE" ? agg + parseFloat(curr.amount) : agg, 0)


        const style = { color: owed <= 0 ? "#5ECDB9" : "#FC6171" }

        return <div style={{width: "90%", margin: "auto"}}>
			{ this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false }
			<div className="divider">Payments Information</div>
			<div className="table row">
				<label>Total Monthly Fees:</label>
				<div>Rs. {totalMonthFees}</div>
			</div>

			<div className="table row">
				<label>Total One-Time Fees:</label>
				<div>Rs. {totalOneTimeFees}</div>
			</div>
			<div className="divider">Family Ledger</div>

			<div className="filter row no-print"  style={{marginBottom:"10px"}}>
                <select className="" {...this.Former.super_handle(["sibling"])}>
                    <option value="">Select Subling</option>
                    {
                        siblings
                            .sort((a, b) => a.Name.localeCompare(b.Name))
                            .map(sibling => <option key={sibling.id} value={sibling.Name}>{sibling.Name}</option>)
                    }
                </select>

                <select className="" {...this.Former.super_handle(["month"])} style={{ width: "150px" }}>
                    <option value="">Select Month</option>
                    {
                        sortYearMonths(months).map(month => {
                            return <option key={month} value={month}>{month}</option>	
                        })
                    }
				</select>
				<select className="" {...this.Former.super_handle(["year"])}>
                    <option value="">Select Year</option>
                    { 
                        Array.from(years).map(year => {
							return <option key={year} value={year}>{year}</option>
						})
                    }
				</select>
            </div>
            			
			<div className="payment-history section">
				<div className="table row heading">
					<label>Date</label>
					<label>Label</label>
					<label>Amount</label>
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
                        </div>})
                }
            <div className="table row last">
                <label style={style}><b>{owed <= 0 ? "Advance:" : "Pending:"}</b></label>
                <div style={style}><b>Rs. {numberWithCommas(Math.abs(owed))}</b></div>
            </div>
			</div>
			<div className="form">
                <div className="button save" onClick={() => this.onSave(selected_sibling)}>Save</div>
                <div className={`button ${this.state.payment.active ? "orange" : "green"}`} onClick={this.newPayment} style={{margin:"10px 0px"}}>{this.state.payment.active ? "Cancel" : "New Entry"}</div>

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
					<div className="button save" onClick={() => this.addPayment(selected_sibling)}>Add Payment</div>
                </div> }
                <button className="print button" style={{marginBottom: "10px"}}>Print Preview</button>
                
			</div>

		</div>
	}
}

export default connect((state: RootReducerState) => ({
	faculty_id: state.auth.faculty_id,
	students: state.db.students,
	connected: state.connected,
	settings: state.db.settings,
    feeSMSTemplate: (state.db.sms_templates || {} as RootDBState["sms_templates"]).fee || ""
}), (dispatch: Function) => ({
    addPayment: (student: MISStudent, id: string, amount: number, date: number, type: MISStudentPayment["type"], fee_id: string, fee_name: string) => dispatch(addPayment(student, id, amount, date, type, fee_id, fee_name)),
	addMultiplePayments: (payments: payment[]) => dispatch(addMultiplePayments(payments)),
	sendSMS: (text: string, number: string) => dispatch(sendSMS(text, number)),
	logSms: (history: any) => dispatch(logSms(history)),
	editPayment: (student: MISStudent, payments: MISStudent["payments"]) => dispatch(editPayment(student,payments))
}))(withRouter(FamilyFees))