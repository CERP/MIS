import React from 'react'
import {Route} from 'react-router-dom'

import Create from './Create'
import Reports from './Reports'

import './style.css'

export default (props) => {

	return <div className="single-class-container">
		<Route path="/class/new" component={Create} />
		<Route path="/class/:id/profile" component={Create} />
		<Route path="/class/:id/reports/:start/:end" component={Reports} />
	</div>
}