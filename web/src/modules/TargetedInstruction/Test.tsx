import React from 'react';
import Layout from 'components/Layout'
import { RouteComponentProps } from 'react-router-dom'
import { Route, Link } from 'react-router-dom'
import Monthly from './Monthly'
import Diagnostic from './Diagnostic'


type P = RootReducerState & RouteComponentProps


const Test: React.FC<P> = (props) => {

	const loc = props.location.pathname.split('/').slice(-1).pop();
	console.log('loc', loc)

	return <Layout history={props.history}>
		<div className="analytics">
			<div className="row tabs">
				<Link className={`button ${loc === "diagnostic" ? "orange" : ''}`} to="diagnostic" replace={true}>Diagnostic</Link>
				<Link className={`button ${loc === "monthly" ? "blue" : ''}`} to="monthly" replace={true}>Monthly</Link>
			</div>
			<Route path="/targeted-instruction/diagnostic" component={Diagnostic} />
			<Route path="/targeted-instruction/monthly" component={Monthly} />
		</div>
	</Layout>

}

export default Test