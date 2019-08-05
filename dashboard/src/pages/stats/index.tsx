import React, { Component } from 'react'
import { connect } from 'react-redux';
import moment from 'moment'
import Former from 'former';
import StudentAttendance from './StudentAttendance'
import TeacherAttendance from './TeacherAttendance';
import Fees from './Fees';
import Exams from './Exams';
import { RouteComponentProps } from 'react-router';

import './style.css'
import { schoolInfo } from '../../actions';
import Expense from './Expense';
import SMS from './SMS';
import Diary from './Diary';

interface P {
	school_list: RootReducerState["school_Info"]["school_list"]
	schoolInfo: () => any
}

interface S {
	selected_school: string
	start_date: number
	end_date: number
}

interface RouteInfo {
	id: string
}

type propTypes = RouteComponentProps<RouteInfo> & P

class Stats extends Component <propTypes, S> {

	former: Former
	constructor(props: propTypes) {
		super(props)
	
		this.state = {
			selected_school: "",
			start_date: moment().subtract(12, "month").unix() * 1000,
			end_date: moment.now()
		}

		this.former = new Former(this,[])
	}

	componentDidMount () {
		this.props.schoolInfo()
	}
	
	render() {

		const { school_list } = this.props

		const start_date = moment(this.state.start_date).format("YYYY-MM-DD")
		const end_date = moment(this.state.end_date).format("YYYY-DD-MM")

		return <div className="page stats">

			<div className="title">Stats</div>
			<div className="section form">
				<div className="row">
					<label>School</label>
					<select {...this.former.super_handle(["selected_school"])}>
					<option value="">Select</option>
					{
						school_list.map(s => <option value={s} key={s}> {s} </option>)
					}
					</select>
				</div>
				<div className="row">
					<label>Start Date</label>
					<input type="date" onChange={this.former.handle(["start_date"])} value={moment(this.state.start_date).format("YYYY-MM-DD")} />
				</div>
				<div className="row">
					<label>End Date</label>
					<input type="date" onChange={this.former.handle(["end_date"])} value={moment(this.state.end_date).format("YYYY-MM-DD")}/>
				</div>
			</div>
			
			{ this.state.selected_school && <div className="stat-card-container">
				<div className="divider">Student Attendance</div>
				<StudentAttendance school_id={this.state.selected_school} start_date={start_date} end_date={end_date}/>

				<div className="divider">Teacher Attendance</div>
				<TeacherAttendance school_id={this.state.selected_school} start_date={start_date} end_date={end_date}/>
				
				<div className="divider">Student Fee</div>
				<Fees school_id={this.state.selected_school} start_date={start_date} end_date={end_date}/>
				
				<div className="divider">Student Exams</div>
				<Exams school_id={this.state.selected_school} start_date={start_date} end_date={end_date}/>

				<div className="divider"> Expense </div>
				<Expense school_id={this.state.selected_school} start_date={start_date} end_date={end_date}/>

				<div className="divider"> SMS </div>
				<SMS school_id={this.state.selected_school} start_date={start_date} end_date={end_date}/>

				<div className="divider"> Diary </div>
				<Diary school_id={this.state.selected_school} start_date={start_date} end_date={end_date}/>

			</div>}

		</div>
	}
}

export default connect((state : RootReducerState) => ({
	school_list: state.school_Info.school_list
}), ( dispatch: Function )  => ({
	schoolInfo: () => dispatch(schoolInfo())
}))(Stats)
