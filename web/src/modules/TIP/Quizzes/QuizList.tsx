import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getQuizzes } from 'utils/TIP'
import { connect } from 'react-redux'
import Headings from '../Headings'
import Card from '../Card'

interface P {
	quizzes: TIPQuizzes
}

type PropsType = P & RouteComponentProps

const QuizList: React.FC<PropsType> = ({ match, quizzes }) => {
	const { class_name, subject } = match.params as Params

	const filterredQuizzes = getQuizzes(quizzes, subject, class_name)

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} subject={subject} lesson_name="" lesson_no="" />

			<Headings heading={'Quiz Library'} sub_heading={''} />

			{Object.entries(filterredQuizzes).map(([quiz_id, quiz], index) => {
				return (
					<div
						key={quiz_id}
						className="no-underline bg-blue-50 h-20 w-full mx-3 rounded-md mb-3 flex flex-row justify-between items-center px-2">
						<div className="flex flex-col justify-between items-center w-full h-15 pl-4">
							<div className="text-white text-lg font-bold mb-1">{quiz.slo}</div>
							<div className="text-xs text-white">{`Lesson number ${index + 1}`}</div>
						</div>

						{/* {teacher_record.taken ? (
							<img
								src={Check}
								className="h-6 w-6 bg-white rounded-full flex items-center justify-center print:hidden cursor-pointer"
								onClick={e =>
									done(e, class_name, curr.subject, curr.lesson_number, false)
								}
							/>
						) : (
							<div
								className="h-6 w-6 bg-white rounded-full flex items-center justify-center print:hidden cursor-pointer"
								onClick={e =>
									done(e, class_name, curr.subject, curr.lesson_number, true)
								}>
								<img className="h-3 w-3" src={WhiteTick} />
							</div>
						)} */}
					</div>
				)
			})}
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	quizzes: state.targeted_instruction.quizzes
}))(withRouter(QuizList))
