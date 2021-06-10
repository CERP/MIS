import React from 'react'
import Card from '../Card'
import Headings from '../Headings'
import { RouteComponentProps, Link } from 'react-router-dom'
import { DiagnosticItalic, Formative, Summative, WhiteQuiz } from 'assets/icons'

interface P {
	students: RootDBState['students']
}

type PropsType = P & RouteComponentProps

const Results: React.FC<PropsType> = () => {
	return (
		<div className="bg-white flex flex-wrap content-between mt-20">
			<Card />
			<Headings heading="Test Results" sub_heading="Select the result you wanna see" />
			<div className="flex flex-row justify-around w-full mt-5 p-3">
				<Link
					className="bg-white px-2 rounded-lg h-48 flex flex-col justify-center items-center shadow-lg no-underline"
					to={'/targeted-instruction/diagnostic-result'}>
					<img className="py-11 h-14" src={DiagnosticItalic} />
					<div className="text-blue-tip-brand">Starting Test</div>
				</Link>
				<Link
					className="bg-white px-2 rounded-lg h-48 flex flex-col justify-center items-center shadow-lg no-underline"
					to={'/targeted-instruction/formative-result'}>
					<img className="py-11 pl-2 h-14" src={Formative} />
					<div className="text-blue-tip-brand">Midpoint Test</div>
				</Link>
				<Link
					className="bg-white px-2 rounded-lg h-48 flex flex-col justify-center items-center shadow-lg no-underline"
					to={'/targeted-instruction/summative-result'}>
					<img className="py-11 h-14 px-3" src={Summative} />
					<div className="text-blue-tip-brand">Final Test</div>
				</Link>
			</div>
			<div className="w-full px-4 py-5">
				<Link
					className="bg-gray-tip opacity-100 rounded-lg flex flex-row justify-around items-center w-full no-underline shadow-lg"
					to={'/targeted-instruction/quiz-result'}>
					<img className="py-3 h-12 w-12" src={WhiteQuiz} />
					<div className="text-white text-lg">Quizzes</div>
					<div className="bg-white rounded-full h-7 w-7"></div>
				</Link>
			</div>
		</div>
	)
}

export default Results
