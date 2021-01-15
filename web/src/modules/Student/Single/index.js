import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Layout from 'components/Layout'

import Create from './Create'
import Attendance from './Attendance'
import StudentFees from './Fees'
import Marks from './Marks'
import StudentCertificates from './Certificates'
import PrintPreview from './Fees/printPreview'
import DiagnosticGrades from './Grades/index'
import { getIlmxUser } from 'utils/helpers'

import './style.css'

class StudentPage extends Component {

	render() {

		const loc = this.props.location.pathname.split('/').slice(-1).pop();
		const { Admin: admin, permissions } = this.props.user;

		return <Layout history={this.props.history}>
			<div className="single-student">
				{loc === "new" || loc === "prospective-student" ? false :
					<div className="row tabs">
						{
							!this.props.ilmxUser && <><Link className={`button ${loc === "profile" ? "red" : false}`} to="profile" replace={true}>Profile</Link>
								{admin || (permissions ? permissions.fee : false) ?
									<Link className={`button ${loc === "payment" ? "green" : false}`} to="payment" replace={true}>
										Payment
									</Link> : false}
								<Link className={`button ${loc === "attendance" ? "purple" : false}`} to="attendance" replace={true}>Attendance</Link>
								<Link className={`button ${loc === "marks" ? "blue" : false}`} to="marks" replace={true}>Marks</Link>
								<Link className={`button ${loc === "certificates" ? "yellow" : false}`} to="certificates" replace={true}>Certificates</Link>
								{ this.props.tp_access && <Link className={`button ${loc === "grades" ? "grey" : false}`} to="grades" replace={true}>Diagnostic Grades</Link>}
							</>
						}
					</div>
				}
				<Route path="/student/new" component={Create} />
				<Route path="/student/:id/profile" component={Create} />
				{
					!this.props.ilmxUser && <>
						<Route path="/student/:id/payment" component={StudentFees} />
						<Route path="/student/:id/fee-print-preview" component={PrintPreview} />
						<Route path="/student/:id/attendance" component={Attendance} />
						<Route path="/student/:id/marks" component={Marks} />

						<Route path="/student/:id/prospective-student" component={Create} />
						<Route path="/student/prospective-student/new" component={Create} />
						<Route path="/student/:id/certificates" component={StudentCertificates} />
						<Route path="/student/:id/grades" component={DiagnosticGrades} />
					</>
				}
			</div>
		</Layout>
	}
}
export default connect(state => ({
	user: state.db.faculty[state.auth.faculty_id],
	tp_access: state.db.target_instruction_access,
	ilmxUser: getIlmxUser()
}))(StudentPage)