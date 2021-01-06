import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { BackButtonIcon } from 'assets/icons'
import HelpButton from 'components/Button/help'
import { History } from 'history'
import IlmxButton from 'components/Button/Ilmx'

import './style.css'

type PropsType = {
	user?: MISTeacher
	children?: React.ReactNode
	title?: string
	link?: string
	settings?: RootDBState["settings"]
	logo?: string
	history?: History
	auth?: RootReducerState["auth"]
	client_id?: string
}

const Layout = ({ user, children, history, title, link, auth, client_id }: PropsType) => {
	return <div className="layout">
		{
			history.location.pathname === "/" ? <FrontHeader user={user} /> :
				<Header
					user={user}
					history={history}
					title={title}
					link={link}
					auth={auth}
					client_id={client_id}
				/>
		}
		{children}
	</div>
}

const FrontHeader = ({ user }: PropsType) => <div className="header bg-red">
	<div className="left"><Link to="/home">MISchool</Link></div>
	{user ? <Link className="profile" to={`/faculty/${user.id}/profile`}>{user.Name}</Link> : <Link className="profile" style={{ marginRight: "10px" }} to="/school-login">Login</Link>}
</div>

const Header = ({ user, history, title, link, auth, client_id }: PropsType) => <div className="header" style={{ justifyContent: "space-between" }}>
	<div className="row header-items">
		{
			(history.location.pathname !== "/home" && history.location.pathname !== "/" && history.location.pathname !== "/school-login") &&
			<div className="back" onClick={() => history.goBack()} style={{ backgroundImage: `url(${BackButtonIcon})` }} />
		}
		<div className="left"><Link to="/home">MISchool</Link></div>
	</div>
	<div style={{ marginRight: "10px" }}>
		{
			user ? <div className="row header-items">
				<Link className="profile" to={`/faculty/${user.id}/profile`}>{user.Name}</Link>
				{user.Admin && <IlmxButton auth={auth} client_id={client_id} />}
				<HelpButton title={title} link={link} />
			</div> :
				<div className="row header-items">
					<HelpButton title={title} link={link} />
				</div>
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

			{
				settings.schoolCode && settings.schoolCode !== "" && <div className="school-code">
					School Code: {settings.schoolCode || "_______"}
				</div>
			}

		</div>
	</div>
</div>

export const PrintHeaderSmall = ({ settings, logo }: PropsType) => <div className="print-only small-school-header">
	<div className="row" style={{ alignItems: "center" }}>
		<div style={{ width: "10%" }}>
			<img src={logo} alt="logo" width={32} height={32} />
		</div>
		<div style={{ width: "90%" }} className="small-title">{settings.schoolName ? settings.schoolName : ""}</div>
	</div>
	<div className="small-address">{settings.schoolAddress}</div>
	<div className="small-phone-number"> Tel:{settings.schoolPhoneNumber} </div>
</div>

export default connect((state: RootReducerState) => ({
	auth: state.auth,
	client_id: state.client_id,
	user: state.db.faculty[state.auth.faculty_id]
}))(Layout)

const SpecialLayoutWrap = (WrappedComponent: any) => ({ user, ...props }: PropsType) => <div className="layout">
	{props.history.location.pathname === "/front" ? <FrontHeader user={user} /> : <Header user={user} history={props.history} title={props.title} link={props.link} />}
	<WrappedComponent {...props} />
</div>

export const LayoutWrap = (WrappedComponent: any) => connect((state: RootReducerState) => ({
	user: state.db.faculty[state.auth.faculty_id],
}))(SpecialLayoutWrap(WrappedComponent))