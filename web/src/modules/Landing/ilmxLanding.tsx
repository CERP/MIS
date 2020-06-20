import React from 'react'
import { Link } from 'react-router-dom'

import smsIcon from './icons/SMS/sms_1.svg'
import teachersIcon from './icons/Teacher/teacher_1.svg'
import studentsIcon from './icons/Student/student_profile_1.svg'
import classesIcon from './icons/Classes/classes_1.svg'
import settingsIcon from './icons/Settings/settings-gears.svg'
import switchUserIcon from './icons/switch_user/logout.svg'
import analyticsIcon from './icons/Analytics/increasing-stocks-graphic-of-bars.svg'   //


import Help from './icons/Help/help.svg'
import diary from './icons/Diary/diary.svg'
import { IlmxLogo } from 'assets/icons'

import './style.css'


interface P {
	faculty?: MISTeacher
	onLogout: () => void
	onRedirectToIlmx: () => void
}


const IlmxLanding: React.FC<P> = ({ onLogout, onRedirectToIlmx, faculty }) => {

	return <>
		<div className="ilmx page ">
			<div className="title">Setup</div>
			<div className="row">
				<Link to="/class" className="button purple-shadow" style={{ backgroundImage: `url(${classesIcon})` }}>Classes</Link>
				<p className="guide-steps"><strong>Step 1</strong>: Create Class</p>
			</div>
			<div className="row">
				<Link to="/student" className="button blue-shadow" style={{ backgroundImage: `url(${studentsIcon})` }}>Students</Link>
				<p className="guide-steps"><strong>Step 2</strong>: Student Profile</p>
			</div>
			<div className="row">
				<Link to="/teacher" className="button green-shadow" style={{ backgroundImage: `url(${teachersIcon})` }}>Teachers</Link>
				<p className="guide-steps"><strong>Step 3</strong>: Teaher Profile</p>
			</div>
			{
				faculty.Admin && <div className="row">
					<Link to="/settings" className="button red-shadow" style={{ backgroundImage: `url(${settingsIcon})` }}>Settings</Link>
					<p className="guide-steps"><strong>Step 4</strong>: MIS Settings</p>
				</div>
			}
		</div>

		<div className="ilmx page">
			<div className="title">Actions</div>
			<div className="row">
				<Link to="/sms" className="button red-shadow" style={{ backgroundImage: `url(${smsIcon})` }}> SMS </Link>
				<Link to="/diary" className="button purple-shadow" style={{ backgroundImage: `url(${diary})` }}> Diary </Link>
			</div>
			{
				faculty.Admin && <div className="row">
					<Link to="/analytics/ilmexchange" className="button purple-shadow" style={{ backgroundImage: `url(${analyticsIcon})` }}>Analytics</Link>
					<div className="button green-shadow" onClick={() => onRedirectToIlmx()} style={{ backgroundImage: `url(${IlmxLogo})` }}> IlmExchange </div>
				</div>
			}
			<div className="row">
				<Link to="/help" className="button grey-shadow" style={{ backgroundImage: `url(${Help})` }}>Help</Link>
				<div className="button yellow-shadow" onClick={onLogout} style={{ backgroundImage: `url(${switchUserIcon})` }}>Logout</div>
			</div>
		</div>

	</>
}


export default IlmxLanding
