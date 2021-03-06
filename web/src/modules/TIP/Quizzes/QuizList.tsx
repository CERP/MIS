import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Check, QuizMark } from 'assets/icons'
import { connect } from 'react-redux'
import Headings from '../Headings'
import Card from '../Card'
import Dynamic from '@cerp/dynamic'
import { quizTaken } from 'actions'

interface P {
	faculty: RootDBState['faculty']
	faculty_id: RootReducerState['auth']['faculty_id']
	quizzes: TIPQuizzes

	quizTaken: (faculty_id: string, quiz_id: string, value: boolean) => void
}

type PropsType = P & RouteComponentProps

/**
 * Generates a new TIPTeacherQuizzes for teaches who do not yet have a quiz.
 * By default, all "taken" values are set to false
 * @param quizzes
 */
const blankQuizzes = (quizzes: TIPQuizzes): TIPTeacherQuizzes => {
	const res = Object.entries(quizzes ?? {}).reduce<TIPTeacherQuizzes>(
		(agg, [quiz_id, quiz]) => ({
			...agg,
			[quiz_id]: {
				...quiz,
				taken: false
			}
		}),
		{}
	)

	return res
}

const QuizList: React.FC<PropsType> = ({
	match,
	history,
	quizzes,
	faculty,
	faculty_id,
	quizTaken
}) => {
	const { class_name, subject } = match.params as Params
	const url = match.url.split('/')

	const filterredQuizzes: TIPQuizz = quizzes?.[class_name]?.[subject]

	const teacher = faculty[faculty_id]
	const existing_teacher_record = Dynamic.get<TIPTeacherLessonPlans>(teacher, [
		'targeted_instruction',
		'quizzes'
	])
	const teacher_lesson_record = existing_teacher_record || blankQuizzes(quizzes)

	const markQuiz = (e: any, quiz_id: string, value: boolean) => {
		e.stopPropagation()
		quizTaken(faculty_id, quiz_id, value)
	}

	const redirect = (e: any, quiz_id: string) => {
		e.stopPropagation()
		history.push(`/${url[1]}/${url[2]}/${class_name}/${subject}/${quiz_id}/pdf`)
	}

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} subject={subject} />
			<div className="mb-5 flex justify-center w-full">
				<Headings heading={'Quiz Library'} />
			</div>
			{Object.entries(filterredQuizzes || {})
				.sort(([, a], [, b]) => a.quiz_order - b.quiz_order)
				.map(([quiz_id, quiz]) => {
					const teacher_record = teacher_lesson_record[quiz_id] || {
						taken: false
					}

					return (
						<div
							key={quiz_id}
							className="no-underline bg-gray-tip h-20 w-full mx-3 rounded-md mb-3 flex flex-row justify-between items-center px-2"
							onClick={e => redirect(e, quiz_id)}>
							<div className="flex flex-col justify-between items-center w-full h-15 pl-4">
								<div className="text-white text-lg font-bold mb-1">
									{quiz.quiz_title}
								</div>
								<div className="text-xs text-white">{`Quiz ${quiz.quiz_order}`}</div>
							</div>

							{teacher_record.taken && (
								<img src={QuizMark} className="h-8 w-8 print:hidden" />
							)}
						</div>
					)
				})}
		</div>
	)
}

export default connect(
	(state: RootReducerState) => ({
		faculty: state.db.faculty,
		faculty_id: state.auth.faculty_id,
		quizzes: state.targeted_instruction.quizzes
	}),
	(dispatch: Function) => ({
		quizTaken: (faculty_id: string, quiz_id: string, value: boolean) =>
			dispatch(quizTaken(faculty_id, quiz_id, value))
	})
)(QuizList)
