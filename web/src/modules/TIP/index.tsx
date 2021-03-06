import React, { useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps, Link } from 'react-router-dom'
import {
	Formative,
	LessonPlans,
	TrainingMaterials,
	DiagnosticItalic,
	Summative,
	BlueQuiz,
	Results
} from 'assets/icons'
import { getLessonProgress } from 'utils/TIP'
import Headings from './Headings'
import Card from './Card'
import { fetchTargetedInstruction } from 'actions'

interface P {
	faculty: RootDBState['faculty']
	faculty_id: string
}

enum Layouts {
	DIAGNOSTIC,
	FORMATIVE,
	SUMMATIVE
}

type PropsType = P & RouteComponentProps

const Home: React.FC<PropsType> = ({ faculty, faculty_id }) => {
	const max_progress = getLessonProgress(faculty[faculty_id])
	const tip_access = useSelector(
		(state: RootReducerState) => state.db.targeted_instruction_access
	)
	const dispatch = useDispatch()

	// here we decide which layout to show based on our max_progress on the lessons
	let layout = Layouts.DIAGNOSTIC
	if (max_progress >= 17) {
		layout = Layouts.FORMATIVE
	}
	if (max_progress >= 35) {
		layout = Layouts.SUMMATIVE
	}

	useEffect(() => {
		if (tip_access) {
			dispatch(fetchTargetedInstruction())
		}
	}, [])
	return (
		<div className="flex flex-wrap content-between bg-white mt-20">
			<Card />
			<Headings heading="Welcome to TIP" sub_heading="What would you like to do today ?" />
			{
				<Link
					className={`flex justify-center w-full my-2 no-underline`}
					to={'/targeted-instruction/detailed-analysis'}>
					<button className="border-none bg-sea-green-tip-brand text-white shadow-lg py-2 px-4 rounded-2xl outline-none cursor-pointer">
						View Class / Groups
					</button>
				</Link>
			}
			{layout === Layouts.DIAGNOSTIC && (
				<div className="w-full flex justify-center mx-3">
					<Link
						className="w-full bg-white rounded-2xl h-44 flex flex-col justify-center items-center shadow-lg no-underline"
						to={'/targeted-instruction/diagnostic-test'}>
						<img className="h-24 w-24" src={DiagnosticItalic} alt="img" />
						<div className="text-blue-900 text-lg font-bold">Starting Test</div>
					</Link>
				</div>
			)}
			{layout === Layouts.FORMATIVE && (
				<div className="w-full flex justify-center mx-3">
					<Link
						className="w-full bg-white rounded-2xl h-44 flex flex-col justify-center items-center shadow-lg no-underline"
						to={'/targeted-instruction/formative-test'}>
						<img className="h-24 w-28" src={Formative} alt="img" />
						<div className="text-blue-900 text-lg font-bold">Midpoint Test</div>
					</Link>
				</div>
			)}
			{layout === Layouts.SUMMATIVE && (
				<div className="w-full flex justify-center mx-3">
					<Link
						className="w-full bg-white rounded-2xl h-44 flex flex-col justify-center items-center shadow-lg no-underline"
						to={'/targeted-instruction/summative-test'}>
						<img className="h-24 w-28" src={Summative} alt="img" />
						<div className="text-blue-900 text-lg font-bold">Final Test</div>
					</Link>
				</div>
			)}

			<div className="flex flex-row justify-center items-center w-full mt-4">
				<div className="flex flex-row justify-center items-center w-full">
					<Link
						className="container sm:px-8 bg-white rounded-xl m-3 h-36 flex flex-col justify-center items-center shadow-lg space-y-2"
						to={'/targeted-instruction/quizzes'}>
						<img className="w-20 h-20" src={BlueQuiz} alt="img" />
						<div className="text-xs text-blue-900 font-bold">Quizzes</div>
					</Link>
					<Link
						className="container sm:px-8 bg-white rounded-xl m-3 h-36 flex flex-col justify-center items-center shadow-lg space-y-2"
						to={'/targeted-instruction/results'}>
						<img className="w-20 h-20" src={Results} alt="img" />
						<div className="text-xs text-blue-900 font-bold">Results</div>
					</Link>
				</div>
			</div>

			<div className="flex flex-row justify-center items-center w-full">
				<div className="flex flex-row justify-center items-center w-full">
					<Link
						className="container sm:px-8 bg-white rounded-xl m-3 h-36 flex flex-col justify-center items-center shadow-lg space-y-2"
						to={'/targeted-instruction/training-videos'}>
						<img className="w-20 h-20" src={TrainingMaterials} alt="img" />
						<div className="text-xs text-blue-900 font-bold">Training Materials</div>
					</Link>
					<Link
						className="container sm:px-8 bg-white rounded-xl m-3 h-36 flex flex-col justify-center items-center shadow-lg space-y-2"
						to={'/targeted-instruction/lesson-plans'}>
						<img className="w-20 h-20" src={LessonPlans} alt="img" />
						<div className="text-xs text-blue-900 font-bold">Lesson Plans</div>
					</Link>
				</div>
			</div>

			{false && layout === Layouts.DIAGNOSTIC && (
				<div className="flex flex-row justify-center items-center w-full opacity-50">
					<div className="flex flex-row justify-center items-center w-full md:w-full lg:w-11/12 2xl:w-8/12">
						<Link
							className="container sm:px-8 bg-white rounded-xl m-3 h-28 flex flex-col justify-center items-center shadow-lg no-underline"
							to={'/targeted-instruction/formative-test'}>
							<img className="h-12 p-4" src={Formative} alt="img" />
							<div className="text-xs text-blue-900 font-bold text-center">
								Midpoint Test
							</div>
						</Link>
						<Link
							className="container sm:px-8 bg-white rounded-xl m-3 h-28 flex flex-col justify-center items-center shadow-lg no-underline"
							to={'/targeted-instruction/summative-test'}>
							<img className="h-12 p-4 pr-5" src={Summative} alt="img" />
							<div className="text-xs text-blue-900 font-bold text-center">
								Final Test
							</div>
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	faculty: state.db.faculty,
	faculty_id: state.auth.faculty_id
}))(Home)
