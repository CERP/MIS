import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import List from 'components/List'
import Layout from 'components/Layout'

const ExamItem = (exam) => 
	<div className="table row" key={exam.id}>
		<Link to={`/reports/${exam.class_id}/${exam.section_id}/exam/${exam.id}`}>
			{examLabel(exam)}
		</Link>

		<div>{new Date(exam.date).toLocaleDateString()}</div>
	</div>

const examLabel = (exam) => `${exam.subject}: ${exam.name}`;

class ReportList extends Component {

	render() {

		const section_id = this.props.match.params.section_id;
		const class_id = this.props.match.params.class_id;

		const curr_class_name = this.props.classes[class_id].name || ""
		const curr_section_name = this.props.classes[class_id].sections[section_id].name || ""

		const items = Object.entries(this.props.exams)
			.filter(([id, exam]) => exam.class_id === class_id && exam.section_id === section_id)
			.sort(([, a], [, b]) => `${a.subject}: ${a.name}`.localeCompare(`${b.subject}: ${b.name}`))
			.map(([id, exam]) => ({ ...exam, id }))
		

		return <Layout history={this.props.history}>
			<div className="reports-list">
				<div className="title">{`Exams - ${ curr_class_name } (${curr_section_name})`}</div>

				<List 
					items={items}
					Component={ExamItem} 
					create={`/reports/${class_id}/${section_id}/new`} 
					createText="New Exam" 
					toLabel={examLabel}
					/>

			</div>
		</Layout>

	}
}

export default connect(state => ({
	exams: state.db.exams,
	classes: state.db.classes
}))(ReportList);