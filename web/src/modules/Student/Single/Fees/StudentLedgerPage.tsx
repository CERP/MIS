import React from 'react'
import { PrintHeaderSmall } from "components/Layout";
import numberWithCommas from "utils/numberWithCommas";
import moment from "moment";
import getFeeLabel from "utils/getFeeLabel";


interface StudentLedgerPageProp {
	payments: [string, MISStudentPayment][] 
	student: MISStudent
	class_name: string
	settings: RootDBState["settings"]
	voucherNo: number
	css_style: string
}

export const StudentLedgerPage : React.SFC < StudentLedgerPageProp > = ({ payments, student, settings, class_name, voucherNo, css_style }) => {

	const owed = payments.reduce((agg, [,curr]) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)
 
	return <div className={`payment-history section print-page ${css_style}`}>
			
			<PrintHeaderSmall settings={settings}/>

			<div className="divider">Student Information</div>
				<div className="row info">
					<label>Name:</label>
					<div>{student.Name}</div>
				</div>
				<div className="row info">
					<label>Father Name:</label>
					<div>{student.ManName}</div>
				</div>
				<div className="row info">
					<label>Class:</label>
					<div>{class_name}</div>
				</div>
				<div className="row info">
					<label>Roll No:</label>
					<div>{student.RollNumber}</div>
				</div>
				<div className="row info">
					<label>Admission No:</label>
					<div>{student.AdmissionNumber}</div>
				</div>
				<div className="row info">
					<label>Voucher No:</label>
					<div>{voucherNo}</div>
				</div>

			<div className="divider">Payment Information</div>

			<div className="table row heading">
				<label><b>Date</b></label>
				<label><b>Label</b></label>
				<label><b>Amount</b></label>
			</div>

			{payments
				.map(([id, payment]) => {
					return <div className="payment" key={id} >

						<div className="voucher table row">
							<div className="date">{moment(payment.date).format("DD/MM")}</div>
							<div className="label">{getFeeLabel(payment)}</div>
							<div className="amount">{numberWithCommas(payment.amount)}</div>
						</div>
					</div>
				}
			)}

			<div className="table row last">
				<label className={owed <= 0 ? "advance-amount" : "pending-amount"}><b>{owed <= 0 ? "Advance:" : "Pending:"}</b></label>
				<div className={owed <= 0 ? "advance-amount" : "pending-amount"}><b>Rs. {numberWithCommas(Math.abs(owed))}</b></div>
			</div>
			{ // don't show if student ledger rendered in historical fee module, Voucher No. hard coded in this case
				voucherNo !== 777 && <>
					<div className="row voucher-signature line">
						<div>___________________</div>
						<div>___________________</div>
					</div>	
					<div className="row voucher-signature">
						<div>Principal Signature</div>
						<div>Accountant Signature</div>
					</div>
				</>
			}
	</div>
	
}