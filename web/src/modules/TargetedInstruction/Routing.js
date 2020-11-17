import React from 'react'
import { Route, Link } from 'react-router-dom'
import Layout from 'components/Layout'

import Tests from './Diagnostic'
import Grades from './Grades'
import Report from './Report'
import targetedInstruction from './index'
import './style.css'

const TargetedInstruction = (props) => {

		const loc = props.location.pathname.split('/').slice(-1).pop();
		return <Layout history={props.history}>
			<div className="single-student">
                <div className="row tabs">
                    <Link className={`button ${loc === "test" ? "orange" : ''}`} to="test" replace={true}>Test</Link>
                    <Link className={`button ${loc === "grades" ? "blue" : ''}`} to="grades" replace={true}>Grades</Link>
                    <Link className={`button ${loc === "report" ? "green" : ''}`} to="report" replace={true}>Report</Link>
                </div>
                <Route path="/targeted-instruction" component={targetedInstruction} />
                <Route path="/targeted-instruction/test" component={Tests} />
                <Route path="/targeted-instruction/grades" component={Grades} />
                <Route path="/targeted-instruction/report" component={Report} />
			</div>
		</Layout>
	}

export default TargetedInstruction