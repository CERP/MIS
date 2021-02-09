import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import { getSubjectsFromTests } from 'utils/TIP'
import { English, Urdu, Maths } from 'assets/icons'

interface P {
	class_name: string
	section_id: string
	targeted_instruction: RootReducerState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const Subjects: React.FC<PropsType> = ({ match, targeted_instruction, class_name, section_id }) => {

	const url = match.url.split('/')
	const subjects: string[] = useMemo(() => getSubjectsFromTests(targeted_instruction), [])

	return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
		{subjects.map((sub) => (
			<Link key={sub} className="container w-full sm:px-8 bg-white rounded-lg m-3 h-36 flex items-center justify-start flex-col shadow-lg no-underline"
				to={url[2] === 'diagnostic-result' ?
					`/${url[1]}/${url[2]}/${section_id}/${class_name}/${sub}/result` :
					url[2] === 'formative-result' ?
						`/${url[1]}/${url[2]}/${class_name}/${sub}/result` :
						url[2] === "lesson-plans" ?
							`/${url[1]}/${url[2]}/${class_name}/${sub}/list` :
							url[2] === "diagnostic-test" ?
								`/${url[1]}/${url[2]}/${section_id}/${class_name}/${sub}/pdf` :
								url[2] === "oral-test" ?
									`/${url[1]}/${url[2]}/${sub}/pdf` :
									`/${url[1]}/${url[2]}/${class_name}/${sub}/pdf`}>
				<img className="flex items-center justify-center h-20 p-2" src={sub === 'English' ? English : sub === 'Urdu' ? Urdu : Maths} />
				<div className="text-blue-900 font-thin text-3xl">{sub}</div>
			</Link>
		))}
	</div>
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(withRouter(Subjects))