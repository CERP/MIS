import { TrainingMaterials, LessonPlans, DiagnosticItalic, BlueQuiz, Results } from 'assets/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../Card'
import Headings from '../Headings'

const HTDashboard: React.FC = () => {
	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card />
			<Headings heading="Head Teacher Dashboard" />
			<div className="flex flex-row justify-center items-center w-full mt-4">
				<div className="flex flex-row justify-center items-center w-full">
					<Link
						className="container sm:px-8 bg-white rounded-xl m-3 h-36 flex flex-col justify-center items-center border border-gray-100 shadow-md space-y-2"
						to="#">
						<img className="w-20 h-20" src={DiagnosticItalic} alt="img" />
						<div className="text-xs text-blue-900 font-bold sm:text-md">Tests</div>
					</Link>
					<Link
						className="container sm:px-8 bg-white rounded-xl m-3 h-36 flex flex-col justify-center items-center border border-gray-100 shadow-md space-y-2"
						to="#">
						<img className="w-20 h-20" src={LessonPlans} alt="img" />
						<div className="text-xs text-blue-900 font-bold sm:text-md">
							Lesson Plans
						</div>
					</Link>
				</div>
			</div>
			<div className="flex flex-row justify-center items-center w-full mt-4">
				<div className="flex flex-row justify-center items-center w-full">
					<Link
						className="container sm:px-8 bg-white rounded-xl m-3 h-36 flex flex-col justify-center items-center border border-gray-100 shadow-md space-y-2"
						to="#">
						<img className="w-20 h-20" src={BlueQuiz} alt="img" />
						<div className="text-xs text-blue-900 font-bold sm:text-md">Quizzes</div>
					</Link>
					<Link
						className="container sm:px-8 bg-white rounded-xl m-3 h-36 flex flex-col justify-center items-center border border-gray-100 shadow-md space-y-2"
						to="#">
						<img className="w-20 h-20" src={TrainingMaterials} alt="img" />
						<div className="text-xs text-blue-900 font-bold sm:text-md">Training</div>
					</Link>
				</div>
			</div>
			<div className="w-full flex justify-center m-3">
				<Link
					className="w-full bg-white rounded-2xl h-44 flex flex-col justify-center items-center border border-gray-100 shadow-md no-underline"
					to="#">
					<img className="h-24 w-28" src={Results} alt="img" />
					<div className="text-xs text-blue-900 font-bold sm:text-md">
						Sorting Results
					</div>
				</Link>
			</div>
		</div>
	)
}

export default HTDashboard
