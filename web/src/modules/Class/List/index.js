import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Layout from 'components/Layout'
import List from 'components/List'



const ClassItem = (C) => 
	<Link key={C.id} to={`/class/${C.id}/profile`} >
		{C.name}
	</Link>

class ClassModule extends Component {
 
	render() {

		const items = Object.values(this.props.classes)
		.sort((a, b) => (b.classYear || 0) - (a.classYear || 0));
		
		return <Layout>
			<div className="class-module">
				<div className="title">Classes</div>
				
				<List 
					items={items}
					Component={ClassItem}
					create={'/class/new'} 
					createText={"Add new Class"} 
					toLabel={C => C.name} 
					/>
			</div>
		</Layout>
	}
}

export default connect(state => ({
	classes: state.db.classes
}))(ClassModule)