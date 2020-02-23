import React from 'react'
import { PrintHeaderSmall } from "components/Layout"
import numberWithCommas from "utils/numberWithCommas"
import moment from "moment"
import toTitleCase from 'utils/toTitleCase'


interface StudentLedgerPageProp {
	payments: [string, MISStudentPayment][]
	student?: MISStudent
	family?: AugmentedMISFamily
	section?: AugmentedSection
	settings: RootDBState["settings"]
	logo?: string
	voucherNo?: number
	css_style?: "print-only" | "no-print" | ""
	month?: string
	year?: string
}

export const StudentLedgerPage: React.SFC<StudentLedgerPageProp> = ({ payments, student, settings, section, voucherNo, css_style, family, logo, month, year }) => {

	const class_id = section ? section.class_id : undefined
	const monthly_fee = settings && settings.classes && settings.classes.defaultFee[class_id] ? settings.classes.defaultFee[class_id].amount : ""

	const owed = payments.reduce((agg, [, curr]) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)

	const voucher_options = settings && settings.classes && settings.classes.feeVoucher ? settings.classes.feeVoucher : undefined
	const voucherFor = family && family.ID ? "Family" : "Student"

	const due_days = parseInt(voucher_options.dueDays || "0")
	const curr_month_days = parseInt(moment().format("DD"))

	const fee_fine = curr_month_days >= due_days ? (curr_month_days - due_days) * parseInt(voucher_options.feeFine || "0") : 0

	return <div className={`payment-history section print-page ${css_style}`}>

		<PrintHeaderSmall settings={settings} logo={logo} />

		<div className="voucher-heading text-uppercase text-center bold">Fee Receipt - {moment().format("MMMM, YYYY")}</div>
		{
			voucherFor === "Student" ?
				<>
					<div className="row info">
						<label>Student Name:</label>
						<div>{toTitleCase(student.Name)}</div>
					</div>
					<div className="row info">
						<label>Father Name:</label>
						<div>{toTitleCase(student.ManName)}</div>
					</div>
					<div className="row info">
						<label>Class:</label>
						<div>{section ? section.namespaced_name : ""}</div>
					</div>
					<div className="row info">
						<label>Admission No:</label>
						<div>{student.AdmissionNumber}</div>
					</div>
					<div className="row info">
						<label>Voucher No:</label>
						<div>{voucherNo}</div>
					</div>
				</> :
				<>
					<div className="row info">
						<label>Family ID:</label>
						<div>{family.ID}</div>
					</div>
					<div className="row info">
						<label>Father Name:</label>
					</div>
					<div>{family.ManName}</div>
					<div className="row info">
						<label>Phone</label>
						<div>{family.Phone}</div>
					</div>
					<div className="row info">
						<label>Voucher No:</label>
						<div>{voucherNo}</div>
					</div>
				</>
		}

		<div className="voucher-heading text-uppercase text-center bold">PAYMENT INFORMATION</div>

		<div className="print-table">
			<table style={{ marginLeft: "auto" }}>
				<thead>
					<tr>
						<th className="th-description">Description</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Tuition Fee</td>
						<td className="cell-center">{monthly_fee}</td>
					</tr>
					<tr>
						<td className={owed > 0 ? "pending-amount" : ""} >Balance/Arrears</td>
						<td className="cell-center bold">{owed > 0 ? numberWithCommas(owed) : "-"}</td>
					</tr>
					<tr>
						<td className={owed <= 0 ? "advance-amount" : ""}>Advance</td>
						<td className="cell-center bold">{owed <= 0 ? numberWithCommas(Math.abs(owed)) : "-"}</td>
					</tr>
					<tr>
						<td>Late Fee Fine</td>
						<td className="cell-center">{fee_fine > 0 ? fee_fine : "-"}</td>
					</tr>
					<tr>
						<td>Other</td>
						<td className="cell-center"></td>
					</tr>
					<tr className="bold">
						<td>Total Payable</td>
						<td className="cell-center">Rs. {owed + fee_fine}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div className="bank-info">
			<fieldset>
				<legend>Bank Information</legend>
				<div className="row info">
					<label>Bank Name:</label>
					<div>{voucher_options && voucher_options.bankInfo ? voucher_options.bankInfo.name : ""}</div>
				</div>
				<div className="row info">
					<label>Account Title:</label>
					<div>{voucher_options && voucher_options.bankInfo ? voucher_options.bankInfo.accountTitle : ""}</div>
				</div>
				<div className="row info">
					<label>Account No.:</label>
					<div>{voucher_options && voucher_options.bankInfo ? voucher_options.bankInfo.accountNo : ""}</div>
				</div>
			</fieldset>
		</div>

		<div className="fee-notice">
			<fieldset>
				<legend>Fee Notice</legend>
				<div>{voucher_options.notice}</div>
			</fieldset>
		</div>

		<div className="row info bold" style={{ marginTop: 5 }}>
			<label>Due Date</label>
			<div>{moment(`${month} ${year}`, "MMMM YYYY").add(voucher_options.dueDays, "days").format("DD/MM/YYYY")}</div>
		</div>
		<div className="row info bold" style={{ marginTop: 0 }} >
			<label>Issuance Date</label>
			<div>{moment().format("DD/MM/YYYY")}</div>
		</div>

		{ // don't show if student ledger rendered in historical fee module
			voucherNo && <div className="print-only">
				<div className="row voucher-signature" style={{ marginTop: 10 }}>
					<div>Principal Signature</div>
					<div>Accountant Signature</div>
				</div>
			</div>
		}
	</div>

}