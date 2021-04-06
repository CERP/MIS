import React from 'react'
import { Route, withRouter, Switch } from 'react-router-dom'
import InsertGrades from './FormativeTest/InsertGrades'
import DiagnosticTest from './DiagnosticTest'
import DiagnosticTestResult from './DiagnosticTest/Result/index'
import FormativeTestResult from './FormativeTest/Result/index'
import Grading from './FormativeTest/Grading'
import FormativeResult from './FormativeTest/Result/ResultCards/Result'
import TrainingVideos from './TrainingVideos'
import FormativeTest from './FormativeTest'
import SummativeTest from './SummativeTest'
import Quizzes from './Quizzes'
import QuizList from './Quizzes/QuizList'
import Result from './DiagnosticTest/Result/Result'
import LessonPlans from './LessonPlans'
import HomePage from './index'
import PDF from './PDF'
import LessonPlanPDF from './LessonPlans/PDF'
import List from './LessonPlans/List'
import Header from './Header'
import DetailedAnalysis from './DetailedAnalysis'
import OralTest from './OralTest'
import AnswerSheet from './AnswerSheet'

const Routing = props => {
	const path = props.location.pathname.substring(0, 21)

	return (
		<>
			<Header />
			<Switch>
				<Route exact path={path} component={HomePage} />

				<Route
					exact
					path={`${path}/oral-test/:subject/:test_id/insert-grades/:std_id/grading`}
					component={Grading}
				/>

				<Route
					exact
					path={`${path}/oral-test/:subject/:test_id/insert-grades`}
					component={InsertGrades}
				/>

				<Route
					exact
					path={`${path}/oral-test/:subject/answer-pdf`}
					component={AnswerSheet}
				/>

				<Route exact path={`${path}/oral-test/:subject/pdf`} component={PDF} />

				<Route exact path={`${path}/oral-test`} component={OralTest} />

				<Route exact path={`${path}/detailed-analysis`} component={DetailedAnalysis} />

				<Route
					exact
					path={`${path}/diagnostic-test/:section_id/:class_name/:subject/:test_id/insert-grades/:std_id/grading`}
					component={Grading}
				/>
				<Route
					exact
					path={`${path}/diagnostic-test/:section_id/:class_name/:subject/:test_id/insert-grades/test-result`}
					component={Result}
				/>
				<Route
					exact
					path={`${path}/diagnostic-test/:section_id/:class_name/:subject/:test_id/insert-grades`}
					component={InsertGrades}
				/>
				<Route
					exact
					path={`${path}/diagnostic-test/:section_id/:class_name/:subject/answer-pdf`}
					component={AnswerSheet}
				/>
				<Route
					exact
					path={`${path}/diagnostic-test/:section_id/:class_name/:subject/pdf`}
					component={PDF}
				/>

				<Route exact path={`${path}/diagnostic-test`} component={DiagnosticTest} />

				<Route
					exact
					path={`${path}/diagnostic-result/:section_id/:class_name/:subject/result`}
					component={Result}
				/>

				<Route exact path={`${path}/diagnostic-result`} component={DiagnosticTestResult} />

				<Route
					exact
					path={`${path}/formative-test/:class_name/:subject/:test_id/insert-grades/:std_id/grading`}
					component={Grading}
				/>
				<Route
					exact
					path={`${path}/formative-test/:class_name/:subject/:test_id/insert-grades/test-result`}
					component={FormativeResult}
				/>

				<Route
					exact
					path={`${path}/formative-test/:class_name/:subject/:test_id/insert-grades`}
					component={InsertGrades}
				/>

				<Route
					exact
					path={`${path}/formative-test/:class_name/:subject/answer_pdf`}
					component={AnswerSheet}
				/>

				<Route
					exact
					path={`${path}/formative-test/:class_name/:subject/pdf`}
					component={PDF}
				/>

				<Route exact path={`${path}/formative-test`} component={FormativeTest} />

				<Route
					exact
					path={`${path}/formative-result/:class_name/:subject/result`}
					component={FormativeResult}
				/>

				<Route exact path={`${path}/formative-result`} component={FormativeTestResult} />

				<Route
					exact
					path={`${path}/summative-test/:class_name/:subject/:test_id/insert-grades/:std_id/grading`}
					component={Grading}
				/>
				<Route
					exact
					path={`${path}/summative-test/:class_name/:subject/:test_id/insert-grades/test-result`}
					component={FormativeResult}
				/>
				<Route
					exact
					path={`${path}/summative-test/:class_name/:subject/:test_id/insert-grades`}
					component={InsertGrades}
				/>

				<Route
					exact
					path={`${path}/summative-test/:class_name/:subject/answer_pdf`}
					component={AnswerSheet}
				/>

				<Route
					exact
					path={`${path}/summative-test/:class_name/:subject/pdf`}
					component={PDF}
				/>

				<Route exact path={`${path}/summative-test`} component={SummativeTest} />

				<Route
					exact
					path={`${path}/lesson-plans/:class_name/:subject/:lesson_number/list/pdf`}
					component={LessonPlanPDF}
				/>
				<Route
					exact
					path={`${path}/lesson-plans/:class_name/:subject/list`}
					component={List}
				/>

				<Route exact path={`${path}/lesson-plans`} component={LessonPlans} />

				<Route exact path={`${path}/training-videos`} component={TrainingVideos} />

				<Route
					exact
					path={`${path}/quizzes/:class_name/:subject/answer_pdf`}
					component={AnswerSheet}
				/>

				<Route
					exact
					path={`${path}/quizzes/:class_name/:subject/pdf`}
					component={QuizList}
				/>

				<Route exact path={`${path}/quizzes`} component={Quizzes} />
			</Switch>
		</>
	)
}

export default withRouter(Routing)
