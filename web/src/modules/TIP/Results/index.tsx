import React from 'react'
import Card from '../Card'
import Headings from '../Headings'
import { RouteComponentProps, Link } from 'react-router-dom'
import { WhiteDiagnostic, WhiteFormative, WhiteSummative, WhiteQuiz } from 'assets/icons'

interface P {
	students: RootDBState['students']
}

type PropsType = P & RouteComponentProps

const Results: React.FC<PropsType> = () => {
	return (
		<div className="bg-white flex flex-wrap content-between mt-20">
			<Card class_name="" subject="" lesson_name="" lesson_no="" />
			<Headings heading="Results" sub_heading="Select the result you wanna see" />
			<div className="flex flex-row justify-around w-full mt-5 p-3">
				<Link
					className="bg-sea-green-tip-brand px-2 rounded-lg h-48 flex flex-col justify-center items-center shadow-lg"
					to={'/targeted-instruction/diagnostic-result'}>
					<img className="py-11 pl-2" src={WhiteDiagnostic} />
					<div className="text-white">Starting Test</div>
				</Link>
				<Link
					className="bg-sea-green-tip-brand px-2 rounded-lg h-48 flex flex-col justify-center items-center shadow-lg"
					to={'/targeted-instruction/formative-result'}>
					<img className="py-11 pl-2" src={WhiteFormative} />
					<div className="text-white">Midpoint Test</div>
				</Link>
				<Link
					className="bg-sea-green-tip-brand px-2 rounded-lg h-48 flex flex-col justify-center items-center shadow-lg"
					to={'/targeted-instruction/summative-result'}>
					<img className="py-11 pr-2" src={WhiteSummative} />
					<div className="text-white">Final Test</div>
				</Link>
			</div>
			<div className="w-full px-4 py-5">
				<Link
					className="bg-gray-50 rounded-lg flex flex-row justify-around items-center w-full no-underline shadow-lg"
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
