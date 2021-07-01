import React from 'react'
import { PrintHeaderSmall } from 'components/Layout'
import numberWithCommas from 'utils/numberWithCommas'
import toTitleCase from 'utils/toTitleCase'

import moment from 'moment'

interface StudentLedgerPageProp {
	payments: [string, MISStudentPayment][]
	student?: MISStudent
	family?: AugmentedMISFamily
	section?: AugmentedSection
	settings: RootDBState['settings']
	logo?: string
	voucherNo?: number
	css_style?: 'print-only' | 'no-print' | ''
	month?: string
	year?: string
}

const DefaultOptions: RootDBState['settings']['classes']['feeVoucher']['options'] = {
	showDueDays: false,
	showFine: false,
	showNotice: false,
	showBankInfo: false
}

export const StudentLedgerPage: React.FC<StudentLedgerPageProp> = ({
	payments,
	student,
	settings,
	section,
	voucherNo,
	css_style,
	family,
	logo,
	month,
	year
}) => {
	const siblingsCount = family?.ID ? family.children.length : 1 // 1 in case of single student fee voucher
	const voucherFor = family?.ID ? 'Family' : 'Student'

	const voucherSettings = settings?.classes?.feeVoucher ?? undefined

	const { showDueDays, showFine, showNotice, showBankInfo } =
		voucherSettings?.options ?? DefaultOptions

	// get the due days and curr month days till current date
	const dueDays = parseInt(voucherSettings?.dueDays ?? '0')
	const currMonthDays = moment().days()

	let totalFeeFine = 0

	if (showFine && currMonthDays >= dueDays) {
		const fee_late_days = currMonthDays - dueDays
		const fee_fine = parseInt(voucherSettings?.feeFine ?? '0') // fee fine per day

		totalFeeFine = fee_late_days * fee_fine * siblingsCount
	}

	let fees = getMergedFees(family, student, settings) as {
		[id: string]: MISStudentFee | MISClassFee
	}

	// merge class and student fees
	if (voucherFor === 'Student') {
		// get default class fee
		const classFee = settings?.classes?.defaultFee?.[section.class_id]

		// get class additional fees
		const classAdditionals = settings?.classes?.additionalFees?.[section.class_id]

		fees = {
			...fees,
			[student.id]: classFee,
			...classAdditionals
		}
	}

	// agg + (amount < 0 ? Math.abs(amount) : 0) this scholarship amount which is entered negative but as OWED type
	const scholarship = payments.reduce((agg, [, curr]) => {
		const amount = getParsedAmount(curr.amount)
		return curr.type === 'FORGIVEN'
			? agg + amount
			: curr.type === 'OWED'
				? agg + (amount < 0 ? Math.abs(amount) : 0)
				: agg
	}, 0)

	const owed =
		payments.reduce((agg, [, curr]) => {
			const amount = getParsedAmount(curr.amount)
			return curr.type === 'OWED'
				? agg + (amount > 0 ? amount : 0)
				: curr.type === 'SUBMITTED'
					? agg - amount
					: agg
		}, 0) - scholarship

	const totalMonthlyFees = Object.values(fees ?? {}).reduce(
		(agg, curr) =>
			curr.type === 'FEE' && curr.period === 'MONTHLY'
				? agg + getParsedAmount(curr.amount)
				: agg,
		0
	)
	const totalOneTimeFees = Object.values(fees ?? {}).reduce(
		(agg, curr) =>
			curr.type === 'FEE' && curr.period === 'SINGLE'
				? agg + getParsedAmount(curr.amount)
				: agg,
		0
	)

	return (
		<div className={`payment-history section print-page ${css_style}`}>
			<PrintHeaderSmall settings={settings} logo={logo} />

			<div className="voucher-heading text-uppercase text-center bold">
				Fee Receipt - {month} {year}
			</div>
			{voucherFor === 'Student' ? (
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
						<div>{section ? section.namespaced_name : ''}</div>
					</div>
					<div className="row info">
						<label>Admission No:</label>
						<div>{student.AdmissionNumber}</div>
					</div>
					<div className="row info">
						<label>Voucher No:</label>
						<div>{voucherNo}</div>
					</div>
				</>
			) : (
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
						<label>Total Siblings</label>
						<div>{siblingsCount}</div>
					</div>
					<div className="row info">
						<label>Voucher No:</label>
						<div>{voucherNo}</div>
					</div>
				</>
			)}

			<div className="voucher-heading text-uppercase text-center bold">
				PAYMENT INFORMATION
			</div>

			<div className="print-table">
				<table style={{ width: '100%' }}>
					<thead>
						<tr>
							<th style={{ width: voucherFor === 'Student' ? '70%' : '50%' }}>
								Description
							</th>
							<th className="text-center">Amount</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Total Monthly Fee</td>
							<td className="text-center">{totalMonthlyFees}</td>
						</tr>
						<tr>
							<td>Total One-Time Fee</td>
							<td className="text-center">{totalOneTimeFees}</td>
						</tr>
						<tr>
							<td className={owed > 0 ? 'pending-amount' : ''}>Balance/Arrears</td>
							<td className="bold text-center">
								{owed > 0 ? numberWithCommas(owed) : '-'}
							</td>
						</tr>
						<tr>
							<td>Total Scholarship</td>
							<td className="text-center">
								{scholarship > 0 ? numberWithCommas(scholarship) : '-'}
							</td>
						</tr>
						<tr>
							<td className={owed <= 0 ? 'advance-amount' : ''}>Advance</td>
							<td className="bold text-center">
								{owed <= 0 ? numberWithCommas(Math.abs(owed)) : '-'}
							</td>
						</tr>
						<tr>
							<td>Late Fee Fine</td>
							<td className="text-center">{totalFeeFine > 0 ? totalFeeFine : '-'}</td>
						</tr>
						<tr className="bold">
							<td>Total Payable</td>
							<td className="text-center">
								Rs. {numberWithCommas(owed + totalFeeFine)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="bank-info">
				{showBankInfo && (
					<fieldset>
						<legend>Bank Information</legend>
						<div className="row info">
							<label>Bank Name:</label>
							<div>
								{voucherSettings && voucherSettings.bankInfo
									? voucherSettings.bankInfo.name
									: ''}
							</div>
						</div>
						<div className="row info">
							<label>Account Title:</label>
							<div>
								{voucherSettings && voucherSettings.bankInfo
									? voucherSettings.bankInfo.accountTitle
									: ''}
							</div>
						</div>
						<div className="row info">
							<label>Account No:</label>
							<div>
								{voucherSettings && voucherSettings.bankInfo
									? voucherSettings.bankInfo.accountNo
									: ''}
							</div>
						</div>
					</fieldset>
				)}
			</div>

			<div className="fee-notice">
				{showNotice && (
					<fieldset>
						<legend>Fee Notice</legend>
						<div>{voucherSettings ? voucherSettings.notice : ''}</div>
					</fieldset>
				)}
			</div>
			<div className="row info bold">
				{showDueDays && (
					<>
						<label>Due Date</label>
						<div>
							{moment(`${month} ${year}`, 'MMMM YYYY')
								.add(dueDays, 'days')
								.format('DD/MM/YYYY')}
						</div>
					</>
				)}
			</div>

			<div className="row info bold" style={{ marginTop: 0 }}>
				<label>Date of Issue</label>
				<div>{moment().format('DD/MM/YYYY')}</div>
			</div>

			{voucherNo && (
				<div className="print-only">
					<div className="row voucher-signature" style={{ marginTop: 10 }}>
						<div>Principal Signature</div>
						<div>Accountant Signature</div>
					</div>
				</div>
			)}
		</div>
	)
}

export const getMergedFees = (
	family: AugmentedMISFamily,
	single_student: MISStudent,
	settings?: RootDBState['settings']
) => {
	const siblings = family?.children

	if (!siblings || siblings.length === 0) {
		// Date: 30-06-2021
		// make sure don't include fee of type FEE with period MONTHLY, because we're moving
		// towards class fee as student monthly fee
		return Object.entries(single_student.fees ?? {}).reduce((agg, [id, fee]) => {
			if (fee.type === 'FEE' && fee.period === 'MONTHLY') {
				return agg
			}

			return {
				...agg,
				[id]: fee
			}
		}, {} as { [id: string]: MISStudentFee })
	}

	return siblings.reduce((agg, student) => {
		// get default class fee
		const classFee =
			settings?.classes?.defaultFee?.[student.section?.class_id] ?? ({} as MISClassFee)

		// get class additional fees
		const classAdditionals =
			settings?.classes?.additionalFees?.[student.section?.class_id] ?? {}

		return {
			...agg,
			...Object.entries(student.fees ?? {}).reduce((agg, [id, fee]) => {
				// Date: 30-06-2021
				// make sure don't include fee of type FEE with period MONTHLY, because we're moving
				// towards class fee as student monthly fee
				if (fee.type === 'FEE' && fee.period === 'MONTHLY') {
					return agg
				}

				return {
					...agg,
					[id]: {
						...fee
					}
				}
			}, {} as MISStudent['fees']),
			// Date: 30-06-2021
			// to make sure a distinct, temporary storing against student id
			// merge class and student fees altogether
			[student.id]: classFee,
			...classAdditionals
		}
	}, {} as { [id: string]: MISStudentFee | MISClassFee })
}

const getParsedAmount = (amount: number | string) => {
	const parsed_amount = typeof amount === 'string' ? parseFloat(amount) : amount
	return !isNaN(parsed_amount) ? parsed_amount : 0
}
