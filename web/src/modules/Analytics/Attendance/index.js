import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import { PrintHeader } from 'components/Layout'
import Former from "utils/former"
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

import { ResponsiveContainer, Line, XAxis, YAxis, LineChart, Tooltip } from 'recharts'

import './style.css'

const MonthlyAttendanceChart = ({monthly_attendance, filter}) => {		
		return <ResponsiveContainer width="100%" height={200}>
					<LineChart 
						data={Object.entries(monthly_attendance)
						.sort(([month, ], [m2, ]) => month.localeCompare(m2))
						.map(([month, { student, PRESENT, LEAVE, ABSENT }]) => ({
							month, PRESENT, LEAVE, ABSENT, percent: (1 - ABSENT / (PRESENT + LEAVE)) * 100
						}))}>

						<XAxis dataKey="month"/>
						<YAxis />

						<Tooltip />
						
						{ filter.present && <Line dataKey="PRESENT" stackId="a" stroke="#93d0c5" strokeWidth={3} name="Present"/> }
						{ filter.absent && <Line dataKey="ABSENT" stackId="a" stroke="#ff6b68" strokeWidth={3} name="Absent" />}
						{ filter.leave && <Line dataKey="LEAVE" stackId="a" stroke="#807f7f" strokeWidth={3} name="Leave" />}
						{ filter.percentage && <Line dataKey="percent" stroke="#74aced" strokeWidth={3} name="Percentage" />}
					</LineChart>
			</ResponsiveContainer>
}
const MonthlyAttendanceTable = ({monthly_attendance, totals}) =>{
	return <div className="section table line" style={{margin: "20px 0", backgroundColor:"#c2bbbb21" }}>
				<div className="table row heading">
					<label style={{ backgroundColor: "#efecec"}}><b>Date</b></label>
					<label style={{ backgroundColor: "#93d0c5"}}><b>Present</b></label>
					<label style={{ backgroundColor: "#fc6171"}}><b>Absent</b></label>
					<label style={{ backgroundColor: "#e0e0e0"}}><b>Leave</b></label>
					<label style={{ backgroundColor: "#bedcff"}}><b>Absentee(%)</b></label>
				</div>
				{
					[...Object.entries(monthly_attendance)
						.sort(([month, ], [m2, ]) => month.localeCompare(m2))
						.map(([month, {student ,PRESENT, LEAVE, ABSENT} ]) =>
						
							<div className="table row">
								<div style={{ backgroundColor: "#efecec"}}>{month }</div>
								<div style={{ backgroundColor: "#93d0c5"}}>{PRESENT}</div>
								<div style={{ backgroundColor: "#fc6171"}}>{ABSENT}</div>
								<div style={{ backgroundColor: "#e0e0e0"}}>{LEAVE}</div>
								<div style={{ backgroundColor: "#bedcff"}}>{ Math.round((ABSENT / (PRESENT + LEAVE)) * 100)}%</div>
							</div>
						),
						<div className="table row footing" style={{borderTop: '1.5px solid #333'}} key={Math.random()}>   
							<label style={{ backgroundColor: "#efecec"}}><b>Total</b></label>
							<label style={{ backgroundColor: "#93d0c5"}}><b>{totals.PRESENT}</b></label>
							<label style={{ backgroundColor: "#fc6171"}}><b>{totals.ABSENT}</b></label>
							<label style={{ backgroundColor: "#e0e0e0"}}><b>{totals.LEAVE}</b></label>
							<label style={{ backgroundColor: "#bedcff"}}><b>{Math.round((1 - totals.ABSENT / (totals.PRESENT + totals.LEAVE)) * 100)}%</b></label>
						</div>
					]
				}
			</div> 
}

class AttendanceAnalytics extends Component {

	constructor(props) {
	  super(props)
	
	  this.state = {
		 filterText: "",
		 chartFilter: {
			 present: true,
			 absent: true,
			 leave: true,
			 percentage: true
		 },
		 classFilter: ""
	  }
	  this.former = new Former(this, [])
	}
	
	render()
	{
		const { students, classes, settings, schoolLogo } = this.props

		let totals = { PRESENT: 0, LEAVE: 0, ABSENT: 0 };
		let monthly_attendance = { } // [mm/yyyy]: { present / absent / leave }
		let student_attendance = { } // [id]: { absents, presents, leaves }

		for(let [sid, student] of Object.entries(students)) {
	
			if(student.Name === undefined || student.attendance === undefined) {
				continue;
			}

			let s_record = { PRESENT: 0, LEAVE: 0, ABSENT: 0 }

			for(let [date, record] of Object.entries(student.attendance)) {

				totals[record.status] += 1;
				s_record[record.status] += 1;

				const month_key = moment(date).format('MM/YYYY');
				const m_status = monthly_attendance[month_key] || { PRESENT: 0, LEAVE: 0, ABSENT: 0}
				m_status[record.status] += 1;
				monthly_attendance[month_key] = m_status;
			}
			student_attendance[sid] = {student, ...s_record}
		}

		const sections = getSectionsFromClasses(classes)
		const items = Object.entries(student_attendance)
			.filter(([ sid, { student } ]) => 
				( (student.tags === undefined || !student.tags["PROSPECTIVE"]) && 
				(this.state.classFilter === "" || student.section_id === this.state.classFilter)) && 
				(student.Name.toUpperCase().includes(this.state.filterText.toUpperCase()))
			)
			.sort(([, { ABSENT: a1 }], [, {ABSENT: a2}]) => a2 - a1)

		return <div className="attendance-analytics">

		<PrintHeader 
			settings={settings} 
			logo={schoolLogo}
		/>
		
		<div className="table row">
			<label>Total Present</label>
			<div>{totals.PRESENT}</div>
		</div>
		<div className="table row">
			<label>Total Absent</label>
			<div>{totals.ABSENT}</div>
		</div>
		<div className="table row">
			<label>Total Present</label>
			<div>{totals.LEAVE}</div>
		</div>
		<div className="table row">
			<label>Absentee Percent</label>
			<div>{(totals.ABSENT/totals.PRESENT * 100).toFixed(2)}%</div>
		</div>

		<div className="divider">Monthly Attendance</div>
		
		<div className="no-print">
			<MonthlyAttendanceChart
				monthly_attendance = { monthly_attendance }
				filter = { this.state.chartFilter }
			/>
		</div>

		<div className="no-print checkbox-container">
			<div className="chart-checkbox" style={{ color:"#93d0c5" }}>
				<input
					type="checkbox"
					{...this.former.super_handle(["chartFilter", "present"])}
				/>
				Present
			</div>

			<div className="chart-checkbox" style={{ color:"#fc6171" }}>
				<input
					type="checkbox"
					{...this.former.super_handle(["chartFilter", "absent"])}
				/>
				Absent
			</div>

			<div className="chart-checkbox" style={{ color:"#656565" }}>
				<input
					type="checkbox"
					{...this.former.super_handle(["chartFilter", "leave"])}
				/>
				Leave
			</div>
			
			<div className="chart-checkbox" style={{ color:"#74aced" }}>
				<input
					type="checkbox"
					{...this.former.super_handle(["chartFilter", "percentage"])}
				/>
				Absentee (%)
			</div>
		</div>
		
		<MonthlyAttendanceTable
			monthly_attendance={monthly_attendance}
			totals={totals}
		/>

		<div className="divider">Student Attendance</div>
		<div className="section">
			<div className="row no-print">
				<input 
					className="search-bar"
					type="text"
					{...this.former.super_handle(["filterText"])}
					placeholder="search"
				/>
				<select {...this.former.super_handle(["classFilter"])}>
					<option value="">Select Class</option>
					{
						sections
							.map(s => {
								return <option value={s.id} key={s.id}>{s.namespaced_name}</option>
							})
					}
				</select>
			</div>

			<div className="table row">
				<label><b>Name</b></label>
				<label><b>Days Absent</b></label>
			</div>
			{
				items
					.map(([ sid, { student, PRESENT, ABSENT, LEAVE } ]) => <div className="table row">
						<Link to={`/student/${sid}/attendance`}>{student.Name}</Link>
						<div style={{color:"#fc6171"}}>{ABSENT}</div>
					</div>)
			}
			<div className="print button" onClick={() => window.print()} style={{ marginTop: "10px" }}>Print</div>

		</div>
	</div>
	}
}
export default connect(state =>({
	students: state.db.students,
	classes: state.db.classes,
	settings: state.db.settings,
	schoolLogo: state.db.assets ? state.db.assets.schoolLogo || "" : ""
}))(AttendanceAnalytics)
