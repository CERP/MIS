import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import former from 'utils/former'
import { connect } from 'react-redux'
import Layout from 'components/Layout'

import './style.css'
import moment from 'moment'
import getSectionsFromClasses from '../../../utils/getSectionsFromClasses'
import { addHistoricalPayment } from '../../../actions'
import { StudentLedgerPage } from '../../Student/Single/Fees/StudentLedgerPage'
import getFilteredPayments from '../../../utils/getFilteredPayments'
import { sortYearMonths } from '../../../utils/sortUtils'
import Banner from '../../../components/Banner'


export type historicalPayment = {
	date: number
	name: string
	amount_owed: number
	amount_paid: number
	amount_forgiven: number
}

interface P {
	students: RootDBState["students"]
	classes: RootDBState["classes"]
	settings: RootDBState["settings"]
	addHistoricalPayment: (payments: historicalPayment, student_id: string) => any
}

interface S {
	banner: {
		active: boolean
		good?: boolean
		text?: string
	}
	fee: {
		date: number
		name: string
		amount_owed: string
		amount_paid: string
		amount_forgiven: string
	}
	selected_section_id: string
	selected_student_id: string
	month_filter: string
	year_filter: string
}


type propTypes = RouteComponentProps & P

class HistoricalFee extends Component<propTypes, S> {

	former: former
	constructor(props: propTypes) {
		super(props)

		this.state = {
			banner: {
				active: false,
				good: true,
				text: "Saved!"
			},
			fee: {
				date: moment.now(),
				name: "Monthly",
				amount_owed: "0",
				amount_paid: "0",
				amount_forgiven: "0"
			},
			selected_section_id: "",
			selected_student_id: "",
			month_filter: "",
			year_filter: ""
		}
		this.former = new former(this, [])
	}

	save = () => {

		const { fee, selected_student_id } = this.state

		const amount_owed = parseFloat(fee.amount_owed) || 0
		const amount_paid = parseFloat(fee.amount_paid) || 0
		const amount_forgiven = parseFloat(fee.amount_forgiven) || 0

		if (amount_owed === 0) {
			setTimeout(() => { this.setState({ banner: { active: false } }) }, 3000)
			return this.setState({
				banner: {
					active: true,
					good: false,
					text: "Please add Owed Amount!"
				}
			})
		}

		const payment = {
			...fee,
			name: fee.name.trim(),
			amount_owed: amount_owed,
			amount_paid: amount_paid,
			amount_forgiven: amount_forgiven
		}

		if (window.confirm("Are you sure you want to Add Historical Fee?")) {

			this.setState({
				banner: {
					active: true,
					good: true,
					text: "Entry Added!"
				}
			})

			this.props.addHistoricalPayment(payment, selected_student_id)

			setTimeout(() => { this.setState({ banner: { active: false } }) }, 3000)
		}
	}

	getSelectedSectionStudents = () => {
		return Object.values(this.props.students)
			.filter(s => s.Name && s.Active && this.state.selected_section_id && s.section_id === this.state.selected_section_id)
			.sort((a, b) => a.Name.localeCompare(b.Name))
	}

	mergedPaymentsForStudent = (student: MISStudent) => {
		if (student.FamilyID) {
			const siblings = Object.values(this.props.students)
				.filter(s => s.Name && s.FamilyID && s.FamilyID === student.FamilyID)

			const merged_payments = siblings.reduce((agg, curr) => ({
				...agg,
				...curr.payments
			}), {} as { [id: string]: MISStudentPayment })

			return merged_payments
		}

		return student.payments
	}

	render() {

		const { selected_section_id, selected_student_id, year_filter, month_filter, banner, fee } = this.state
		const { students, classes, settings } = this.props

		const sorted_sections = getSectionsFromClasses(classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0))

		const selected_student = students[selected_student_id]

		// get payments against the selected student
		const filteredPayments = selected_student && selected_student.Name ?
			getFilteredPayments(this.mergedPaymentsForStudent(selected_student), year_filter, month_filter) : []

		const Months = new Set<string>()
		const Years = new Set<string>()

		if (selected_student && selected_student.Name) {

			Object.entries(selected_student.payments || {})
				.sort(([, a_payment], [, b_payment]) => a_payment.date - b_payment.date)
				.forEach(([, payment]) => {
					Months.add(moment(payment.date).format("MMMM"))
					Years.add(moment(payment.date).format("YYYY"))
				}
				)
		}

		return <Layout history={this.props.history}>
			<div className="historical-fees form">
				{banner.active ? <Banner isGood={banner.good} text={banner.text} /> : false}
				<div className="title"> Historical Fee </div>

				<div className="section section-container">
					<div className="row">
						<label> Class</label>
						<select {...this.former.super_handle(["selected_section_id"])}>
							<option value="">Select Class</option>
							{
								sorted_sections.map(c => <option value={c.id} key={c.id}>{c.namespaced_name}</option>)
							}
						</select>
					</div>
					<div className="row">
						<label> Student</label>
						<select {...this.former.super_handle(["selected_student_id"])}>
							<option value="">Select Student</option>
							{
								this.getSelectedSectionStudents()
									.map(s => <option key={s.id} value={s.id}>{s.Name}</option>)
							}
						</select>
					</div>
				</div>

				{selected_student_id && selected_section_id && <div className="section section-container" style={{ marginTop: 10 }}>
					<div className="row">
						<label> Date </label>
						<input
							type="date"
							value={moment(fee.date).format("YYYY-MM-DD")}
							onChange={this.former.handle(["fee", "date"])}
						/>
					</div>
					<div className="row">
						<label> Name </label>
						<input type="text" {...this.former.super_handle(["fee", "name"])} />
					</div>
					<div className="row">
						<label> Amount Owed </label>
						<input type="number" {...this.former.super_handle(["fee", "amount_owed"])} />
					</div>
					<div className="row">
						<label> Amount Paid </label>
						<input type="number" {...this.former.super_handle(["fee", "amount_paid"])} />
					</div>
					<div className="row">
						<label> Amount Forgiven </label>
						<input type="number" {...this.former.super_handle(["fee", "amount_forgiven"])} />
					</div>
					<div className="button blue" onClick={() => this.save()}> Add Historical Fee</div>
				</div>}
				{selected_student && selected_student.Name && selected_section_id && <div className="section section-container" style={{ marginTop: 10 }}>
					<div className="row" style={{ marginBottom: 10 }}>
						<select {...this.former.super_handle(["month_filter"])}>
							<option value=""> Select Month</option>
							{
								sortYearMonths(Months)
									.map(m => <option key={m} value={m}>{m}</option>)
							}
						</select>
						<select {...this.former.super_handle(["year_filter"])}>
							<option value=""> Year</option>
							{
								Array.from(Years)
									.map(y => <option key={y} value={y}>{y}</option>)
							}
						</select>
					</div>
					{
						filteredPayments && selected_section_id && selected_student_id &&
						<StudentLedgerPage
							payments={filteredPayments}
							settings={settings}
							student={selected_student}
						/>
					}
				</div>}
			</div>

		</Layout>
	}
}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	classes: state.db.classes,
	settings: state.db.settings
}), (dispatch: Function) => ({
	addHistoricalPayment: (payment: historicalPayment, student_id: string) => dispatch(addHistoricalPayment(payment, student_id))
}))(HistoricalFee)