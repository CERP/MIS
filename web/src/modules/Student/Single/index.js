import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

import Layout from 'components/Layout'

import Create from './Create'
import Attendance from './Attendance'
import Fees from './Fees'
import Marks from './Marks'

import './style.css'

export default class StudentPage extends Component {

	render() {
		// three buttons, 

		// if student is new, just render the profile. when they hit save, redirect to the right page.
		
		const loc = this.props.location.pathname.split('/').slice(-1).pop();

		return <Layout>
			<div className="single-student">
				{ loc === "new" ? false : 
				<div className="row tabs">
					<Link className={`button ${loc === "profile" ? "selected" : false}`} to="profile" replace={true}>Profile</Link>
					<Link className={`button ${loc === "payment" ? "selected": false}`} to="payment" replace={true}>Payment</Link>
					<Link className={`button ${loc === "attendance" ? "selected" : false}`} to="attendance" replace={true}>Attendance</Link>
					<Link className={`button ${loc === "marks" ? "selected" : false}`} to="marks" replace={true}>Marks</Link>
				</div>
				}

				<Route path="/student/new" component={Create} />
				<Route path="/student/:id/profile" component={Create} />
				<Route path="/student/:id/payment" component={Fees} />
				<Route path="/student/:id/attendance" component={Attendance} />
				<Route path="/student/:id/marks" component={Marks} />
			</div>
		</Layout>
	}
}