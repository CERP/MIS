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

	const siblingCount = family && family.ID ? family.children.length : 1 // 1 in case of single student fee voucher

	const classID = section ? section.class_id : undefined
	const monthlyFee = settings && settings.classes && settings.classes.defaultFee[classID] ? settings.classes.defaultFee[classID].amount : ""

	const voucherSettings = settings && settings.classes && settings.classes.feeVoucher ? settings.classes.feeVoucher : undefined
	const voucherFor = family && family.ID ? "Family" : "Student"

	const dueDays = parseInt(voucherSettings.dueDays || "0")
	const currMonthDays = parseInt(moment().format("DD"))
	const feeFine = currMonthDays >= dueDays ? (currMonthDays - dueDays) * parseInt(voucherSettings.feeFine || "0") * siblingCount : 0

	const owed = payments.reduce((agg, [, curr]) => agg - (curr.type === "SUBMITTED" || curr.type === "FORGIVEN" ? 1 : -1) * curr.amount, 0)

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
						<div>{family.ManName}</div>
					</div>
					<div className="row info">
						<label>Phone</label>
						<div>{family.Phone}</div>
					</div>
					<div className="row info">
						<label>Siblings</label>
						<div>{toTitleCase(getSiblingsNameString(family), ",")}</div>
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
						<td>{family && family.ID ? getSiblingsFeeString(family, settings) : monthlyFee}</td>
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
						<td>{feeFine > 0 ? feeFine : "-"}</td>
					</tr>
					<tr>
						<td>Other</td>
						<td></td>
					</tr>
					<tr className="bold">
						<td>Total Payable</td>
						<td>Rs. {owed + feeFine}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div className="bank-info">
			<fieldset>
				<legend>Bank Information</legend>
				<div className="row info">
					<label>Bank Name:</label>
					<div>{voucherSettings && voucherSettings.bankInfo ? voucherSettings.bankInfo.name : ""}</div>
				</div>
				<div className="row info">
					<label>Account Title:</label>
					<div>{voucherSettings && voucherSettings.bankInfo ? voucherSettings.bankInfo.accountTitle : ""}</div>
				</div>
				<div className="row info">
					<label>Account No.:</label>
					<div>{voucherSettings && voucherSettings.bankInfo ? voucherSettings.bankInfo.accountNo : ""}</div>
				</div>
			</fieldset>
		</div>

		<div className="fee-notice">
			<fieldset>
				<legend>Fee Notice</legend>
				<div>{voucherSettings.notice}</div>
			</fieldset>
		</div>

		<div className="row info bold" style={{ marginTop: 5 }}>
			<label>Due Date</label>
			<div>{moment(`${month} ${year}`, "MMMM YYYY").add(voucherSettings.dueDays, "days").format("DD/MM/YYYY")}</div>
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

export const getSiblingsFeeString = (family: AugmentedMISFamily, settings: MISSettings) => {

	let fees = []

	for (const student of family.children) {

		const classID = student.section ? student.section.class_id : undefined
		const { amount } = settings
			&& settings.classes
			&& settings.classes.defaultFee
			&& settings.classes.defaultFee[classID] ?
			settings.classes.defaultFee[classID] : { amount: 0 }

		fees.push(amount)
	}

	return fees.toString()
}
export const getSiblingsNameString = (family: AugmentedMISFamily) => {

	let names = []

	for (const student of family.children) {
		const name = student.Name.split(" ").splice(-1)
		names.push(name)
	}
	return names.toString()
}