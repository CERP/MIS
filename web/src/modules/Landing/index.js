import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

import { createLogout } from 'actions'
import Layout from 'components/Layout'

import attendanceIcon from './icons/attendance/checklist_1.svg'            //
import teacherAttendanceIcon from './icons/attendance/Attendance.svg'    //
import feesIcon from './icons/attendance/checklist_1.svg'          //no-icon
import marksIcon from './icons/Marks/exam.svg'                     //
import analyticsIcon from './icons/Analytics/increasing-stocks-graphic-of-bars.svg'   //
import resultIcon from './icons/result_card/exam-a-plus.svg'
import smsIcon from './icons/SMS/sms_1.svg'                       //
import teachersIcon from './icons/Teacher/teacher_1.svg'          //
import studentsIcon from './icons/Student/student_profile_1.svg'  //
import classesIcon from './icons/Classes/classes_1.svg'           //
import settingsIcon from './icons/Settings/settings-gears.svg'    //
import switchUserIcon from './icons/attendance/checklist_1.svg'    //no-icon



import './style.css'

class Landing extends Component {

	constructor(props) {
		super(props);

		this.state = {
			scroll: 0
		}
	}


	componentDidMount() {
		const container = document.querySelector(".landing .horizontal-scroll-container");

		container.onscroll = () => this.setState({ scroll: container.scrollLeft })
		container.scrollTo(window.innerWidth, 0)


		this.setState({
			scroll: container.scrollLeft
		})
	}

	componentWillUnmount() {
		window.onscroll = {}
	}

	render() {

		const { logout, user, students, faculty, lastSnapshot } = this.props;

		const current_page = Math.floor(this.state.scroll / window.innerWidth);

		const today_date = moment().format("YYYY-MM-DD");

		let today_attendance = { PRESENT: 0, LEAVE: 0, ABSENT: 0}
		let today_payment = 0;
		let today_payment_students = 0;
		let today_teacher_attendance = { PRESENT: 0, LEAVE: 0, ABSENT: 0 }

		for(let student of Object.values(students)) {

			const record = student.attendance[today_date];
			if(record) {
				today_attendance[record.status] += 1;
			}

			const additional_payment = Object.values(student.payments)
				.filter(x => moment(x.date).format("YYYY-MM-DD") === today_date)
				.reduce((agg, curr) => agg + curr.amount, 0);

			if(additional_payment > 0) {
				today_payment_students += 1
			}

			today_payment += additional_payment;
		}

		for(let teacher of Object.values(faculty)) {
			const record = teacher.attendance[today_date];

			if(record === undefined) {
				continue;
			}

			if(record.check_in) {
				today_teacher_attendance.PRESENT += 1
			}
			else if(record.absent) {
				today_teacher_attendance.ABSENT += 1;
			}
			else if(record.leave) {
				today_teacher_attendance.LEAVE += 1;
			}
		}

		return <Layout>
			<div className="landing">
				<div className="horizontal-scroll-container">

					<div className="page">
						<div className="title">Management</div>
						<div className="row">
							<Link to="/teacher" className="button green-shadow" style={{backgroundImage: `url(${teachersIcon})` }}>Teachers</Link>
							<Link to="/student" className="button blue-shadow" style={{backgroundImage: `url(${studentsIcon})` }}>Students</Link>
						</div>
						
						<div className="row">
							<Link to="/class" className="button purple-shadow" style={{backgroundImage: `url(${classesIcon})` }}>Classes</Link>
							<Link to="/settings" className="button red-shadow" style={{backgroundImage: `url(${settingsIcon})` }}>Settings</Link>
						</div>
						<div className="row">
							<div className="button yellow-shadow" onClick={logout} style={{backgroundImage: `url(${switchUserIcon})` }}>Switch User</div>
						</div>
					</div>

					<div className="page">
						<div className="title">Actions</div>
						<div className="row">
							<Link to="/attendance" className="button green-shadow" style={{backgroundImage: `url(${attendanceIcon})` }}>Attendance</Link>
							{ user.Admin ? <Link to="/teacher-attendance" className="button red-shadow" style={{backgroundImage: `url(${teacherAttendanceIcon})` }}>Teacher Attendance</Link> : false }
						</div>
						<div className="row">
							<Link to="/student?forwardTo=payment" className="button blue-shadow" style={{backgroundImage: `url(${feesIcon})` }}>Fees</Link>
							<Link to="/reports" className="button yellow-shadow" style={{backgroundImage: `url(${marksIcon})` }}>Marks</Link>
						</div>
						<div className="row">
							<Link to="/analytics/fees" className="button purple-shadow" style={{backgroundImage: `url(${analyticsIcon})` }}>Analytics</Link>
							<Link to="/reports-menu" className="button green-shadow" style={{backgroundImage: `url(${resultIcon})` }}>Result Card</Link>
						</div>
						<div className="row">
							<Link to="/sms" className="button red-shadow" style={{backgroundImage: `url(${smsIcon})` }}>SMS</Link>
						</div>
					</div>

					<div className="page">
						<div className="title">Daily Statistics</div>
						<div className="divider">Attendance</div>
						<div className="row">
							<div className="box bg-green">
								<div>{today_attendance.PRESENT}</div>
								<div>Present</div>
							</div>

							<div className="box bg-red">
								<div>{today_attendance.ABSENT}</div>
								<div>Absent</div>
							</div>

							<div className="box bg-grey">
								<div>{today_attendance.LEAVE}</div>
								<div>Leave</div>
							</div>
						</div>

						<div className="divider">Teacher Attendance</div>
						<div className="row">
							<div className="box bg-green">
								<div>{today_teacher_attendance.PRESENT}</div>
								<div>Present</div>
							</div>

							<div className="box bg-red">
								<div>{today_teacher_attendance.ABSENT}</div>
								<div>Absent</div>
							</div>

							<div className="box bg-grey">
								<div>{today_teacher_attendance.LEAVE}</div>
								<div>Leave</div>
							</div>
						</div>

						<div className="divider">Fee Collection</div>

						<div className="row">
							<div className="box bg-blue">
								<div>{today_payment}</div>
								<div>Rupees</div>
							</div>

							<div className="box bg-green">
								<div>{today_payment_students}</div>
								<div>Students</div>
							</div>
						</div>

						<div className="divider">Last Backup</div>
						<div className="row">
							<div className="box bg-purple">
								<div>{moment(lastSnapshot).format("HH:mm")}</div>
								<div>{moment(lastSnapshot).format("D-M-YYYY")}</div>
							</div>
						</div>

					</div>

				</div>
			</div>

			{window.innerWidth > 1200 ? false : 
			<div className="scroll-indicator-container">
				<div className={`scroll-indicator ${current_page === 0 ? "active" : ""}`} />
				<div className={`scroll-indicator ${current_page === 1 ? "active" : ""}`} />
				<div className={`scroll-indicator ${current_page === 2 ? "active" : ""}`} />
			</div> }
		</Layout>
	}
}


export default connect(state => ({ 
		user: state.db.faculty[state.auth.faculty_id],
		students: state.db.students,
		faculty: state.db.faculty,
		lastSnapshot: state.lastSnapshot
	}), 
	dispatch => ({
		logout: () => dispatch(createLogout())
	}))(Landing)