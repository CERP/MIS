import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import chunkify from 'utils/chunkify'
import getFilteredPayments from 'utils/getFilteredPayments'
import getSectionFromId from 'utils/getSectionFromId'
import { StudentLedgerPage } from 'modules/Student/Single/Fees/StudentLedgerPage'
import { isValidStudent } from 'utils'

import './style.css'

const PrintPreview = () => {
	const params = new URLSearchParams(useLocation().search)
	const type = params.get('type')
	const id = params.get('id')
	const month = params.get('month')
	const year = params.get('year')

	const { settings, classes, students, assets } = useSelector(
		(state: RootReducerState) => state.db
	)

	const currClass = type === 'CLASS' ? classes[id] : undefined
	const vouchersPerPage = parseInt(settings.vouchersPerPage || '3')
	const schoolLogo = assets.schoolLogo || ''

	const siblings = (): AugmentedSibling[] => {
		return Object.values(students)
			.filter(s => s && s.Name && s.FamilyID && s.FamilyID === id)
			.reduce((agg, curr) => {
				const section_id = curr.section_id
				return [
					...agg,
					{
						...curr,
						section: getSectionFromId(section_id, classes)
					}
				]
			}, [])
	}

	const getCurrStudent = (): MISStudent => {
		if (type === 'FAMILY') {
			return siblings()[0]
		}
		return students[id]
	}

	const getRelevantStudents = (): MISStudent[] => {
		// don't include family students while
		// printing classvise vouchers because we have
		// separate logic to print
		if (type === 'CLASS') {
			return Object.values(students)
				.filter(
					s =>
						isValidStudent(s) &&
						currClass.sections[s.section_id] !== undefined &&
						!s.FamilyID
				)
				.sort((a, b) => parseInt(a.RollNumber || '0') - parseInt(b.RollNumber || '0'))
		}

		return [getCurrStudent()]
	}

	const relevantStudents = getRelevantStudents()

	const getMergedPaymentsForStudents = (student: MISStudent) => {
		return student.payments
	}

	const getFamily = (): AugmentedMISFamily => {
		const student = getCurrStudent()
		const family = {
			ID: student.FamilyID,
			ManName: student.ManName,
			ManCNIC: student.ManCNIC,
			Phone: student.Phone,
			children: siblings()
		}
		return family
	}

	const generateVoucherNumber = (): number => Math.floor(100000 + Math.random() * 900000)

	let voucherContainer = []

	if (vouchersPerPage === 1) {
		voucherContainer = chunkify(relevantStudents, 3).map(
			(items: MISStudent[], index: number) => {
				let vouchers = []

				for (const student of items) {
					if (type === 'FAMILY') {
						vouchers.push(
							<StudentLedgerPage
								key={student.id}
								payments={getFilteredPayments(
									getMergedPaymentsForStudents(student),
									'',
									''
								)}
								settings={settings}
								family={getFamily()}
								voucherNo={generateVoucherNumber()}
								css_style={''}
								logo={schoolLogo}
								month={month}
								year={year}
							/>
						)
					} else {
						vouchers.push(
							<StudentLedgerPage
								key={student.id}
								payments={getFilteredPayments(
									getMergedPaymentsForStudents(student),
									'',
									''
								)}
								settings={settings}
								student={student}
								section={getSectionFromId(student.section_id, classes)}
								voucherNo={generateVoucherNumber()}
								css_style={''}
								logo={schoolLogo}
								month={month}
								year={year}
							/>
						)
					}
				}

				return (
					<div key={index} className="voucher-row">
						{vouchers}
					</div>
				)
			}
		)
	} else {
		voucherContainer = relevantStudents.map((student: MISStudent, index: number) => {
			let vouchers = []
			const voucher_no = generateVoucherNumber()

			for (let i = 0; i < vouchersPerPage; i++) {
				if (type === 'FAMILY') {
					vouchers.push(
						<StudentLedgerPage
							key={student.id + i} // adding i to avoid key duplicaiton
							payments={getFilteredPayments(
								getMergedPaymentsForStudents(student),
								'',
								''
							)}
							settings={settings}
							family={getFamily()}
							voucherNo={voucher_no}
							css_style={i === 0 ? '' : 'print-only'}
							logo={schoolLogo}
							month={month}
							year={year}
						/>
					)
				} else {
					vouchers.push(
						<StudentLedgerPage
							key={student.id + i} // adding i to avoid key duplicaiton
							payments={getFilteredPayments(
								getMergedPaymentsForStudents(student),
								'',
								''
							)}
							settings={settings}
							student={student}
							section={getSectionFromId(student.section_id, classes)}
							voucherNo={voucher_no}
							css_style={i === 0 ? '' : 'print-only'}
							logo={schoolLogo}
							month={month}
							year={year}
						/>
					)
				}
			}

			return (
				<div key={index} className="voucher-row" style={{ marginBottom: '30mm' }}>
					{vouchers}
				</div>
			)
		})
	}

	const onPrint = () => window.print()

	return (
		<AppLayout title={'Print Preview'}>
			<div className="text-2xl font-bold mt-4 mb-4 text-center print:hidden"> Preview </div>
			<div className="student-fees-ledger">
				<div
					className="tw-btn-blue w-full font-semibold text-center mb-2 print:hidden"
					onClick={onPrint}>
					Print
				</div>
				<div className="voucher-row">{voucherContainer}</div>
			</div>
		</AppLayout>
	)
}

export default PrintPreview
