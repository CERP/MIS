import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link } from 'react-router-dom'
import { Formative, LessonPlans, TrainingMaterials, DiagnosticItalic, Summative } from 'assets/icons'
import { getLessonProgress } from 'utils/TIP'
import Headings from './Headings'
import Card from './Card'
interface P {
	faculty: RootDBState["faculty"]
	faculty_id: string
}

type PropsType = P & RouteComponentProps

const Home: React.FC<PropsType> = ({ faculty, faculty_id }) => {

	// these variable names don't make much sense
	const [count, complete] = useMemo(() => getLessonProgress(faculty[faculty_id]), [])

	// all this logic should be changed. 
	let layout = "DIAGNOSTIC"

	return <div className="flex flex-wrap content-between bg-white">
		<Card class_name='' subject='' />
		<Headings heading="Welcome to TIP" sub_heading="What would you like to do today ?" />
		{complete / 2 === count ?
			<Link className="container sm:px-8 bg-white rounded-2xl m-3 h-44 flex flex-col content-center items-center shadow-lg no-underline"
				to={'/targeted-instruction/summative-test'}>
				<img className="h-24 py-4 pr-4 w-28" src={Summative} alt="img" />
				<div className="text-blue-900 text-lg font-bold">Summative Test</div>
			</Link> :
			count > 2 ? <Link className="container sm:px-8 bg-white rounded-2xl m-3 h-44 flex flex-col content-center items-center shadow-lg no-underline"
				to={'/targeted-instruction/formative-test'}>
				<img className="h-24 py-4 pr-4 w-28" src={Formative} alt="img" />
				<div className="text-blue-900 text-lg font-bold">Formative Test</div>
			</Link> :
				<Link className="container sm:px-8 bg-white rounded-2xl m-3 h-44 flex flex-col content-center items-center shadow-lg no-underline"
					to={'/targeted-instruction/diagnostic-test'}>
					<img className="h-24 py-4 w-24" src={DiagnosticItalic} alt="img" />
					<div className="text-blue-900 text-lg font-bold">Diagnostic Test</div>
				</Link>}
		<div className="flex flex-row content-center items-center justify-center w-full">
			<Link className="container sm:px-8 bg-white rounded-xl m-3 h-40 flex flex-col content-center items-center shadow-lg no-underline"
				to={"/targeted-instruction/training-videos"}>
				<img className="h-20 py-4" src={TrainingMaterials} alt="img" />
				<div className="text-base text-blue-900 font-bold">Training Videos</div>
			</Link>
			<Link className="container sm:px-8 bg-white rounded-xl m-3 h-40 flex flex-col content-center items-center shadow-lg no-underline"
				to={"/targeted-instruction/lesson-plans"}>
				<img className="h-20 p-4" src={LessonPlans} alt="img" />
				<div className="text-base text-blue-900 font-bold">Lesson Plans</div>
			</Link>
		</div>
		{count > 2 && complete / 2 !== count && <Link className="container sm:px-8 bg-white rounded-xl m-3 h-28 flex flex-row justify-around w-full items-center shadow-lg no-underline"
			to={"/targeted-instruction/diagnostic-result"}>
			<img className="h-12 py-4 pl-4" src={DiagnosticItalic} alt="img" />
			<div className="text-blue-900 text-lg font-bold">Diagnostic Test Results</div>
		</Link>}
		{complete / 2 === count && <div className="flex flex-row content-center items-center justify-center w-full">
			<Link className="container sm:px-8 bg-white rounded-xl m-3 h-40 flex flex-col content-center items-center shadow-lg no-underline"
				to={"/targeted-instruction/diagnostic-result"}>
				<img className="h-12 py-6" src={DiagnosticItalic} alt="img" />
				<div className="text-base text-blue-900 font-bold text-center">Diagnostic Test Results</div>
			</Link>
			<Link className="container sm:px-8 bg-white rounded-xl m-3 h-40 flex flex-col content-center items-center shadow-lg no-underline"
				to={"/targeted-instruction/formative-result"}>
				<img className="h-16 p-4" src={Formative} alt="img" />
				<div className="text-base text-blue-900 font-bold text-center">Formative Test Results</div>
			</Link>
		</div>}
	</div>
}

export default connect((state: RootReducerState) => ({
	faculty: state.db.faculty,
	faculty_id: state.auth.faculty_id
}))(Home)