import React, { Component } from 'react'
import { connect } from 'react-redux'

import { StudentList } from 'pages/students/list'
import { ClassListModule } from 'modules/Class/List'

import former from 'utils/former'
import { RouteComponentProps } from 'react-router'
import { AppLayout } from 'components/Layout/appLayout'

// give option to select student list or class list, with forwardTo ---> reports.
// need to give this a route

interface P {
	students: RootDBState['students']
	classes: RootDBState['classes']
	settings: RootDBState['settings']
}

interface S {
	report_for: string
}

interface RouteInfo {
	id: string
}

type propTypes = RouteComponentProps<RouteInfo> & P

class ReportsMenu extends Component<propTypes, S> {
	Former: former
	constructor(props: propTypes) {
		super(props)

		this.state = {
			report_for: 'CLASS' // enum CLASS | STUDENT
		}

		this.Former = new former(this, [])
	}

	render() {
		return (
			<AppLayout title="Result Card Menu" showHeaderTitle>
				<div className="p-5 pb-0 md:p-10 md:pt-5 md:pb-0 reports-menu">
					<div className="row justify-between">
						<label>View Result Cards For</label>
						<select className="tw-select" {...this.Former.super_handle(['report_for'])}>
							<option value="CLASS">Class</option>
							<option value="STUDENT">Student</option>
						</select>
					</div>
				</div>
				{this.state.report_for === 'CLASS' ? (
					<ClassListModule {...this.props} forwardTo="report-menu" />
				) : (
					<StudentList {...this.props} forwardTo="marks" excludeNavHeader />
				)}
			</AppLayout>
		)
	}
}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	classes: state.db.classes,
	settings: state.db.settings
}))(ReportsMenu)
