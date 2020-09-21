import React from 'react';
import Layout from 'components/Layout'
import { RouteComponentProps } from 'react-router-dom'
import { Route, Link } from 'react-router-dom'
import Grades from './Grades'
import Diagnostic from './Diagnostic'


type P = RootReducerState & RouteComponentProps


const Test: React.FC<P> = (props) => {

	const loc = props.location.pathname.split('/').slice(-1).pop();

	return <Layout history={props.history}>
		<div className="analytics">
			<div className="row tabs">
				<Link className={`button ${loc === "test" ? "orange" : ''}`} to="test" replace={true}>Test</Link>
				<Link className={`button ${loc === "grades" ? "blue" : ''}`} to="grades" replace={true}>Grades</Link>
			</div>
			<Route path="/targeted-instruction/test" component={Diagnostic} />
			<Route path="/targeted-instruction/grades" component={Grades} />
		</div>
	</Layout>

}

export default Test