import React from 'react'
import Headings from '../../Headings'
import Card from '../../Card'
import { RouteComponentProps } from 'react-router-dom'

interface P { }

type PropsType = P & RouteComponentProps<Params>

const DetailedQuizResult: React.FC<PropsType> = ({ match }) => {
	const { class_name, subject } = match.params as Params

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} subject={subject} lesson_name="" lesson_no="" />
			<Headings heading="Results" sub_heading="" />
		</div>
	)
}

export default DetailedQuizResult
