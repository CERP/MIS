import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import Former from 'utils/former'
import { StudentItem } from 'modules/Student/List'
import './style.css'

interface P {
	items: Array<any>
	create: string
	createText: string
	toLabel: Function
	totalItems?: number
	onDeleteStudent?: (student_id: string) => void
	onPrintStudentIdCard?: (student_id: string) => void

}

interface S {
	filterText: string
}

interface Routeinfo {
	id: string
}

type propTypes = RouteComponentProps<Routeinfo> & P

export default class Card extends Component<propTypes, S> {

	former: Former
	constructor(props: propTypes) {
		super(props)
		this.state = {
			filterText: ""
		}
		this.former = new Former(this, [])
	}

	onChange = (e: any) => {
		this.setState({ filterText: e.target.value });
	}

	create = ({ to, text }: { to: string; text: string }) => {
		return <Link className="button blue" to={to}>{text}</Link>
	}

	render() {

		const { items, toLabel, children, totalItems, onDeleteStudent, onPrintStudentIdCard } = this.props;

		const filteredList = items
			.filter(item => {
				return toLabel(item) !== undefined && toLabel(item).toLowerCase().includes(this.state.filterText.toLowerCase())
			})
			.sort((a, b) => toLabel(b).localeCompare(this.state.filterText) - toLabel(a).localeCompare(this.state.filterText))

		return <div className="card-wrap">

			<div className="total">
				<div className="label">Total: <strong> {totalItems} </strong> </div>
				{this.props.create ? <this.create to={this.props.create} text={this.props.createText} /> : false}
			</div>
			<input className="search-bar no-print" type="text" placeholder="Search by name | class | admission # | phone #" onChange={this.onChange} />
			{children}

			<div className="card-list">
				{
					filteredList.map(item => <StudentItem
						key={item.id + "-" + item.section_id}
						student={item}
						deleteStudent={onDeleteStudent}
						printStudentIdCard={onPrintStudentIdCard} />)
				}
			</div>
		</div>
	}

}