import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import backIcon from './back.svg'
import './style.css'

const Layout = ({ user, children, history }) => {
	return <div className="layout">
		<Header user={user} history={history}/>
		{ children }
	</div>
}

const Header = ({user,history}) => <div className="header"> 
	{ history.location.pathname !== "/" ? <div className="back" onClick={() => history.goBack()} style={{backgroundImage: `url(${backIcon})`}}/> : false}
	<div className="left"><Link to="/">MISchool</Link></div>
	{ user ? <Link className="profile" to={`/faculty/${user.id}/profile`}>{user.Name}</Link> : false }
</div>

export const PrintHeader = ({settings}) => <div className="print-only school-header">
			<div className="title">{settings.schoolName}</div>
			<div className="address">{settings.schoolAddress}</div>
			<div className="phone-number">{settings.schoolPhoneNumber}</div>
		</div>

export default connect(state => ({ 
	user: state.db.faculty[state.auth.faculty_id]
}))(Layout)

const SpecialLayoutWrap = WrappedComponent => ({ user, ...props}) => <div className="layout">
	<Header user={user} history={props.history}/>
	<WrappedComponent {...props} />
</div>

export const LayoutWrap = WrappedComponent => connect(state => ({
	user: state.db.faculty[state.auth.faculty_id]
}))(SpecialLayoutWrap(WrappedComponent))