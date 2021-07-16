import React from 'react'
import Card from '../Card'
import Headings from '../Headings'
import { RouteComponentProps, Link } from 'react-router-dom'
import { DiagnosticItalic, Formative, Summative, WhiteQuiz } from 'assets/icons'
import { ChevronRightIcon } from '@heroicons/react/outline'

interface P {
	students: RootDBState['students']
}

type PropsType = P & RouteComponentProps

const Results: React.FC<PropsType> = () => {
	return (
		<div className="bg-white flex flex-wrap content-between mt-20">
			<Card />
			<Headings heading="Test Results" sub_heading="Select the result you want to see" />
			<div className="flex flex-row justify-around w-full mt-5 p-3 space-x-2">
				<Link
					className="text-center bg-white px-2 rounded-lg h-48 w-48 flex flex-col justify-center items-center border border-gray-100 shadow-md no-underline space-y-2"
					to={'/targeted-instruction/diagnostic-result'}>
					<img className="w-14 h-14" src={DiagnosticItalic} />
					<div className="text-blue-tip-brand">Starting Test</div>
				</Link>
				<Link
					className="text-center bg-white px-2 rounded-lg h-48 w-48 flex flex-col justify-center items-center border border-gray-100 shadow-md no-underline space-y-2"
					to={'/targeted-instruction/formative-result'}>
					<img className="w-14 h-14" src={Formative} />
					<div className="text-blue-tip-brand">Midpoint Test</div>
				</Link>
				<Link
					className="text-center bg-white px-2 rounded-lg h-48 w-48 flex flex-col justify-center items-center border border-gray-100 shadow-md no-underline space-y-2"
					to={'/targeted-instruction/summative-result'}>
					<img className="w-14 h-14" src={Summative} />
					<div className="text-blue-tip-brand">Final Test</div>
				</Link>
			</div>
			<div className="w-full px-4 py-5">
				<Link
					className="bg-gray-tip opacity-100 rounded-lg flex flex-row justify-around items-center w-full no-underline border border-gray-100 shadow-md py-4"
					to={'/targeted-instruction/quiz-result'}>
					<img className="h-12 w-12" src={WhiteQuiz} />
					<div className="text-white text-lg">Quizzes</div>
					<ChevronRightIcon className="bg-white w-10 h-10 p-2 rounded-full text-gray-tip-brand" />
				</Link>
			</div>
		</div>
	)
}

export default Results
