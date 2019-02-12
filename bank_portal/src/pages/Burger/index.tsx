import React from 'react'
import { Route, Link } from 'react-router-dom'

import Home from '../Home'
import New from '../New'
import Settings from '../Settings'

import './style.css'

export default class Burger extends React.Component {

	render() {

		return <div className="root-page">

			<div className="header">EdMarkaz</div>

			<div className="burger">
				<div className="divider">Menu</div>
				<Link to="/">Home</Link>
				<Link to="/new">New</Link>
				<Link to="/todo">To-Do</Link>
				<Link to="/progress">In Progress</Link>
				<Link to="/history">History</Link>
				<Link to="/settings">Settings</Link>
			</div>

			<div className="burger-stub" style={{ border: "1px solid black"}}>
				<Route exact path="/" component={Home} />
				<Route path="/new" component={New} />
				<Route path="/settings" component={Settings} />
			</div>
		</div>
	}
}