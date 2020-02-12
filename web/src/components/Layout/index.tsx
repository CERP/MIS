import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { BackButtonIcon } from 'assets/icons'
import HelpButton from 'components/Button/help'

import './style.css'

type PropsType = {
	user?: MISTeacher
	children?: any
	history?: any
	tutorialID?: string
	settings?: RootDBState["settings"]
	logo?: string
}

const Layout = ({ user, children, history, tutorialID }: PropsType) => {
	return <div className="layout">
		{history.location.pathname === "/" ? <FrontHeader user={user} history={history} /> : <Header user={user} history={history} tutorialID={tutorialID} />}
		{children}
	</div>
}

const FrontHeader = ({ user }: PropsType) => <div className="header bg-red">
	<div className="left"><Link to="/landing">MISchool</Link></div>
	{user ? <Link className="profile" to={`/faculty/${user.id}/profile`}>{user.Name}</Link> : <Link className="profile" style={{ marginRight: "10px" }} to="/login">Login</Link>}
</div>

const Header = ({ user, history, tutorialID }: PropsType) => <div className="header" style={{ justifyContent: "space-between" }}>
	<div className="row">
		{
			(history.location.pathname !== "/landing" && history.location.pathname !== "/" && history.location.pathname !== "/login") &&
			<div className="back" onClick={() => history.goBack()} style={{ backgroundImage: `url(${BackButtonIcon})` }} />
		}
		<div className="left"><Link to="/landing">MISchool</Link></div>
	</div>
	<div style={{ marginRight: "10px" }}>
		{
			user ? <div className="row">
				<Link className="profile" to={`/faculty/${user.id}/profile`}>{user.Name}</Link>
				<HelpButton tutorialID={tutorialID} />
			</div> : <HelpButton tutorialID={tutorialID} />
		}
	</div>
</div>

export const PrintHeader = ({ settings, logo }: PropsType) => <div className="print-only school-header">
	<div className="header-body">
		<div className="logo-container" style={{ width: "20%" }}>
			{logo !== "" && <img className="header-logo" src={logo} alt="School Logo" />}
		</div>
		<div className="header-style">
			<div className="title">{settings.schoolName ? settings.schoolName.toUpperCase() : ""}</div>
			<div className="address" style={{ marginBottom: "4px" }}>{settings.schoolAddress}</div>
			<div className="phone-number">
				Tel:{settings.schoolPhoneNumber}</div>

			{settings.schoolCode && settings.schoolCode !== "" && <div className="school-code">
				School Code: {settings.schoolCode || "_______"}
			</div>}

		</div>
	</div>
</div>

export const PrintHeaderSmall = ({ settings }: PropsType) => <div className="print-only small-school-header">
	<div className="small-title">{settings.schoolName ? settings.schoolName : ""}</div>
	<div className="small-address">{settings.schoolAddress}</div>
	<div className="small-phone-number"> Tel:{settings.schoolPhoneNumber} </div>
</div>

export default connect((state: RootReducerState) => ({
	user: state.db.faculty[state.auth.faculty_id]
}))(Layout)

const SpecialLayoutWrap = (WrappedComponent: any) => ({ user, ...props }: PropsType) => <div className="layout">
	{props.history.location.pathname === "/front" ? <FrontHeader user={user} history={props.history} /> : <Header user={user} history={props.history} />}
	<WrappedComponent {...props} />
</div>

export const LayoutWrap = (WrappedComponent: any) => connect((state: RootReducerState) => ({
	user: state.db.faculty[state.auth.faculty_id],
}))(SpecialLayoutWrap(WrappedComponent))