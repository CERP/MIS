import React, { Component } from 'react'
import moment from 'moment'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import Former from 'utils/former'
import chunkify from 'utils/chunkify'
import getSectionFromId from 'utils/getSectionFromId'
import { PaidFeeStudentsPrintableList } from 'components/Printable/Fee/paidList'
import { AppLayout } from 'components/Layout/appLayout'
import { isValidStudent } from 'utils'

import './style.css'

interface P {
	classes: RootDBState['classes']
	students: RootDBState['students']
}

type PropsType = P & RouteComponentProps

type S = {
	statsType: string
	statsDate: number
}

type AugmentedStudent = MISStudent & {
	amount_paid: number
	balance: number
	section: AugmentedSection
}

class DailyStats extends Component<PropsType, S> {
	former: Former
	constructor(props: PropsType) {
		super(props)

		const parsed_query = queryString.parse(this.props.location.search)

		const type = parsed_query.type ? parsed_query.type.toString() : ''

		this.state = {
			statsType: type,
			statsDate: moment.now()
		}

		this.former = new Former(this, [])
	}

	getSiblings = (student: MISStudent): MISStudent[] => {
		const famId = student?.FamilyID

		return Object.values(this.props.students).filter(
			s => isValidStudent(s) && s.Active && s.FamilyID === famId
		)
	}

	mergedPayments = (student: MISStudent) => {
		const siblings = this.getSiblings(student)
		if (siblings.length > 0) {
			const merged_payments = siblings.reduce(
				(agg, curr) => ({
					...agg,
					...Object.entries(curr.payments ?? {}).reduce((agg, [pid, p]) => {
						return {
							...agg,
							[pid]: {
								...p,
								fee_name: p.fee_name && `${curr.Name}-${p.fee_name}`,
								student_id: curr.id
							}
						}
					}, {})
				}),
				{} as AugmentedMISPaymentMap
			)

			return merged_payments
		}

		return Object.entries(student.payments ?? {}).reduce(
			(agg, [pid, curr]) => ({
				...agg,
				[pid]: {
					...curr,
					student_id: student.id
				}
			}),
			{} as AugmentedMISPaymentMap
		)
	}

	getStudentBalance = (student: MISStudent) => {
		const balance = Object.values(this.mergedPayments(student)).reduce(
			(agg, curr) =>
				agg -
				(curr.type === 'SUBMITTED' || curr.type === 'FORGIVEN' ? 1 : -1) * curr.amount,
			0
		)

		return balance
	}

	getFeeStats = () => {
		const { classes, students } = this.props
		const { statsDate } = this.state

		const todayDate = moment(statsDate).format('YYYY-MM-DD')
		const chunkSize = 22

		let totalAmountReceived = 0
		let totalStudentsWhoPaid = 0
		let paidStudents = [] as AugmentedStudent[]

		for (const student of Object.values(students)) {
			if (isValidStudent(student) && student.Active) {
				const amount_paid_today = Object.values(student.payments ?? {})
					.filter(
						payment =>
							moment(payment.date).format('YYYY-MM-DD') === todayDate &&
							payment.type === 'SUBMITTED'
					)
					.reduce((agg, curr) => agg + curr.amount, 0)

				if (amount_paid_today > 0) {
					paidStudents.push({
						...student,
						amount_paid: amount_paid_today,
						balance: this.getStudentBalance(student),
						section: getSectionFromId(student.section_id, classes)
					})
					totalStudentsWhoPaid += 1
				}
				totalAmountReceived += amount_paid_today
			}
		}

		return (
			<>
				<div className="section no-print">
					<div className="text-center text-2xl">Students Fee</div>
					<div className="mis-table row">
						<label>Total Amount Received: </label>
						<div className="number">Rs. {totalAmountReceived}</div>
					</div>
					<div className="mis-table row student-count">
						<label>Total Students Paid: </label>
						<div className="number">{totalStudentsWhoPaid}</div>
					</div>
					<div style={{ border: '1px solid grey', borderRadius: '4px', padding: '5px' }}>
						<div className="mis-table row">
							<label>
								<b>Name</b>
							</label>
							<label>
								<b>Class</b>
							</label>
							<label>
								<b>Amount Paid</b>
							</label>
							<label>
								<b>Balance</b>
							</label>
						</div>
						{paidStudents
							.sort(
								(a, b) => (a.section?.classYear ?? 0) - (b.section?.classYear ?? 0)
							)
							.map(student => (
								<div className="mis-table row" key={student.id}>
									{student.FamilyID && student.FamilyID !== '' ? (
										<Link
											className="underline text-blue-brand"
											to={`/families/${student.FamilyID}/payments`}>
											{student.FamilyID}(F)
										</Link>
									) : (
										<Link
											className="underline text-blue-brand"
											to={`/students/${student.id}/payments`}>
											{student.Name}
										</Link>
									)}
									<div>{student.section?.namespaced_name ?? ''}</div>
									<div>{student.amount_paid}</div>
									<div
										className={
											student.balance > 0
												? 'pending-amount'
												: 'advance-amount'
										}>
										{student.balance}
									</div>
								</div>
							))}
					</div>
					<div className="row print-button">
						<button className="tw-btn bg-gray-brand" onClick={() => window.print()}>
							Print Paid Students List
						</button>
					</div>
				</div>
				{chunkify(paidStudents, chunkSize).map(
					(itemsChunk: AugmentedStudent[], index: number) => (
						<PaidFeeStudentsPrintableList
							key={index}
							students={itemsChunk}
							chunkSize={index === 0 ? 0 : chunkSize * index}
							totalAmount={totalAmountReceived}
							totalStudents={totalStudentsWhoPaid}
							paidDate={moment(statsDate).format('DD/MM/YYYY')}
						/>
					)
				)}
			</>
		)
	}

	renderSection = () => {
		const type = this.state.statsType

		if (type === 'paid_students') {
			return this.getFeeStats()
		}
	}

	render() {
		const { statsDate } = this.state

		return (
			<AppLayout title="Daily Statistics" showHeaderTitle>
				<div className="daily-stats p-5 md:p-10 md:pt-5">
					<div className="flex text-center justify-center no-print mb-4">
						<input
							className="tw-input"
							type="date"
							onChange={this.former.handle(['statsDate'])}
							value={moment(statsDate).format('YYYY-MM-DD')}
							placeholder="Current Date"
						/>
					</div>
					{this.renderSection()}
				</div>
			</AppLayout>
		)
	}
}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	classes: state.db.classes
}))(DailyStats)
