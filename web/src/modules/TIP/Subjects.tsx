import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getSubjectsFromTests } from 'utils/TIP'
import { English, Urdu, Maths } from 'assets/icons'

interface P {
	class_name?: string
	section_id?: string
	url: string[]

	targeted_instruction: RootReducerState['targeted_instruction']
}

const Subjects: React.FC<P> = ({ url, targeted_instruction, class_name, section_id }) => {
	const subjects: string[] = useMemo(() => getSubjectsFromTests(targeted_instruction), [])

	const getRoute = (url: string[], sub: string) => {
		if (url[2] === 'diagnostic-result') {
			return `/${url[1]}/${url[2]}/${section_id}/${class_name}/${sub}/result`
		} else if (url[2] === 'formative-result' || url[2] === 'summative-result') {
			return `/${url[1]}/${url[2]}/${class_name}/${sub}/result`
		} else if (url[2] === 'lesson-plans') {
			return `/${url[1]}/${url[2]}/${class_name}/${sub}/list`
		} else if (url[2] === 'diagnostic-test') {
			return `/${url[1]}/${url[2]}/${section_id}/${class_name}/${sub}/pdf`
		} else if (url[2] === 'oral-test') {
			return `/${url[1]}/${url[2]}/${sub}/pdf`
		} else if (url[2] === 'quizzes') {
			return `/${url[1]}/${url[2]}/${class_name}/${sub}/list`
		} else if (url[2] === 'quiz-result') {
			return `/${url[1]}/${url[2]}/${class_name}/${sub}/detailed-result`
		} else {
			return `/${url[1]}/${url[2]}/${class_name}/${sub}/pdf`
		}
	}

	return (
		<div className="flex flex-wrap flex-row justify-around w-full mx-4">
			{subjects.map(sub => (
				<Link
					key={sub}
					className="container w-full sm:px-8 bg-white rounded-lg m-3 h-36 flex items-center justify-start flex-col shadow-lg no-underline"
					to={getRoute(url, sub)}>
					<img
						className="flex items-center justify-center h-20 p-2"
						src={sub === 'English' ? English : sub === 'Urdu' ? Urdu : Maths}
					/>
					<div className="text-blue-900 font-thin text-3xl">{sub}</div>
				</Link>
			))}
		</div>
	)
}

export default Subjects
