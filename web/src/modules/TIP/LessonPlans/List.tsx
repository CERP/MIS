import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import Card from '../Card'
import { Check, WhiteTick, Formative, Summative, QuizMark } from 'assets/icons'
import { lessonPlanTaken, clearLessonPlans, quizTaken } from 'actions'
import Dynamic from '@cerp/dynamic'
import Headings from '../Headings'
import { getLessonProgress } from 'utils/TIP'
import { Link } from 'react-router-dom'

interface P {
	faculty: RootDBState['faculty']
	faculty_id: RootReducerState['auth']['faculty_id']
	targeted_instruction: RootReducerState['targeted_instruction']
	curriculum: TIPCurriculum

	lessonPlanTaken: (
		faculty_id: string,
		learning_level_id: string,
		subject: string,
		lesson_number: string,
		value: boolean
	) => void
	clearLessonPlans: (faculty_id: string, learning_level_id: string, subject: string) => void
	quizTaken: (faculty_id: string, quiz_id: string, value: boolean) => void
}

type AugmentedTIPQuiz = TIPQuiz & {
	quiz_id: string
}

/**
 * Generates a new TIPTeacherLessonPlans for teaches who do not yet have a lesson plan for this learning level and subject in their object.
 * By default, all "taken" values are set to false
 * @param lesson_plans
 */
const blankLessonPlan = (lesson_plans: TIPLessonPlans): TIPTeacherLessonPlans => {
	const res = Object.entries(lesson_plans).reduce<TIPTeacherLessonPlans>(
		(agg, [lesson_id, lesson]) => ({
			...agg,
			[lesson_id]: {
				...lesson,
				taken: false
			}
		}),
		{}
	)

	return res
}

type PropsType = P & RouteComponentProps

const List: React.FC<PropsType> = ({
	match,
	faculty,
	faculty_id,
	history,
	curriculum,
	quizTaken,
	targeted_instruction,
	lessonPlanTaken,
	clearLessonPlans
}) => {
	const { class_name, subject } = match.params as Params
	const url = match.url.split('/')

	const teacher = faculty[faculty_id]

	const lesson_plans = curriculum[class_name as TIPLevels][subject]

	const blankQuizzes = (quizzes: TIPQuizzes): TIPTeacherQuizzes => {
		const res = Object.entries(quizzes).reduce<TIPTeacherQuizzes>(
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

	const lessonPlansQuizzes = () => {
		const categorizedLessonPlan = Object.entries(lesson_plans).reduce(
			(agg, [lesson_no, lesson_plan]) => {
				let quiz_id = Dynamic.get<string>(targeted_instruction, [
					'curriculum',
					class_name,
					subject,
					lesson_plan.lesson_number,
					'quiz_id'
				])

				return {
					...agg,
					[quiz_id]: {
						...agg[quiz_id],
						[lesson_no]: lesson_plan
					}
				}
			},
			{} as { [id: string]: TIPLessonPlans }
		)

		return Object.entries(categorizedLessonPlan).reduce<
			Array<[TIPLessonPlans, AugmentedTIPQuiz]>
		>((agg, [quiz_id, lessonPlans]) => {
			const quiz = targeted_instruction?.quizzes?.[class_name]?.[subject]?.[quiz_id]

			return [...agg, [lessonPlans, { quiz_id, ...quiz }]]
		}, [])
	}

	const existing_teacher_record = Dynamic.get<TIPTeacherLessonPlans>(teacher, [
		'targeted_instruction',
		'curriculum',
		class_name,
		subject
	])
	const teacher_lesson_record = existing_teacher_record ?? blankLessonPlan(lesson_plans)
	const existing_teacher_quiz_record = Dynamic.get<TIPTeacherLessonPlans>(teacher, [
		'targeted_instruction',
		'quizzes'
	])
	const teacher_quiz_record =
		existing_teacher_quiz_record ?? blankQuizzes(targeted_instruction.quizzes)

	const markLessonPlan = (
		event: any,
		level: string,
		subject: string,
		lesson_number: string,
		value: boolean
	) => {
		event.stopPropagation()
		lessonPlanTaken(faculty_id, level, subject, lesson_number, value)
	}

	const redirect = (event: any, lesson_number: string) => {
		event.stopPropagation()
		history.push(`/${url[1]}/${url[2]}/${class_name}/${subject}/${lesson_number}/list/pdf`)
	}

	const onClearAll = () => {
		clearLessonPlans(faculty_id, class_name, subject)
	}

	const markQuiz = (event: any, quiz_id: string, value: boolean) => {
		event.stopPropagation()
		quizTaken(faculty_id, quiz_id, value)
	}

	const redirectToQuiz = (event: any, quiz_id: string) => {
		event.stopPropagation()
		history.push(`/${url[1]}/quizzes/${class_name}/${subject}/${quiz_id}/pdf`)
	}

	// const getTakenLessonPlansCount = (lesson_numbers: TIPLessonPlans) => {
	// 	return Object.values(lesson_numbers).reduce((agg, lesson_plan) => {
	// 		const answer = Dynamic.get<TIPTeacherLessonPlans>(teacher, [
	// 			'targeted_instruction',
	// 			'curriculum',
	// 			class_name,
	// 			subject,
	// 			lesson_plan.lesson_number
	// 		])
	// 		if (answer?.taken) {
	// 			agg = agg + 1
	// 		}
	// 		return agg
	// 	}, 0)
	// }

	const lesson_progress = getLessonProgress(faculty[faculty_id])

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} subject={subject} />

			<Headings heading="Lesson Plan Library" sub_heading="Click on a plan to view" />

			{lessonPlansQuizzes()
				.sort(
					([, a], [, b]) =>
						(a.quiz_order ?? Number.MAX_SAFE_INTEGER) -
						(b.quiz_order ?? Number.MAX_SAFE_INTEGER)
				)
				.map(([lessonPlans, quiz]) => {
					//const count = getTakenLessonPlansCount(lessonPlans)
					const teacher_quizzes_record = teacher_quiz_record[quiz.quiz_id] ?? {
						taken: false
					}
					return (
						<>
							{Object.entries(lessonPlans)
								.sort(
									([, a], [, b]) =>
										parseInt(a.lesson_number) - parseInt(b.lesson_number)
								)
								.map(([lpId, lessonPlan]) => {
									const teacher_record = teacher_lesson_record[
										lessonPlan.lesson_number
									] ?? {
										taken: false
									}

									return (
										<>
											<div
												key={lpId}
												className="no-underline bg-blue-50 pb-1 h-20 w-full mx-3 rounded-md mb-3 flex flex-row justify-between items-center px-2 shadow-lg"
												onClick={e =>
													redirect(e, lessonPlan.lesson_number)
												}>
												<div className="flex flex-col justify-between items-center w-full h-15 pl-4">
													<div className="text-white text-center text-lg font-bold mb-1">
														{lessonPlan.lesson_title}
													</div>
													<div className="text-xs text-white">{`Lesson number ${lessonPlan.lesson_number}`}</div>
												</div>
												{teacher_record.taken ? (
													<img
														src={Check}
														className="h-8 w-8 bg-white rounded-full flex items-center justify-center print:hidden cursor-pointer"
														onClick={e =>
															markLessonPlan(
																e,
																class_name,
																lessonPlan.subject,
																lessonPlan.lesson_number,
																false
															)
														}
													/>
												) : (
													<div
														className="h-8 w-9 md:w-8 bg-white rounded-full flex items-center justify-center print:hidden cursor-pointer"
														onClick={e =>
															markLessonPlan(
																e,
																class_name,
																lessonPlan.subject,
																lessonPlan.lesson_number,
																true
															)
														}>
														<img className="h-3 w-3" src={WhiteTick} />
													</div>
												)}
											</div>
											{lesson_progress >= 17 &&
												parseInt(lessonPlan.lesson_number) === 17 && (
													<Link
														className="w-full mx-3 mb-3 bg-white rounded-md h-40 flex flex-col justify-center items-center shadow-lg no-underline"
														to={'/targeted-instruction/formative-test'}>
														<img
															className="h-24 w-28"
															src={Formative}
															alt="img"
														/>
														<div className="text-blue-900 text-lg font-bold">
															Midpoint Test
														</div>
													</Link>
												)}
											{lesson_progress >= 35 &&
												parseInt(lessonPlan.lesson_number) === 35 && (
													<Link
														className="w-full mx-3 mb-3 bg-white rounded-md h-40 flex flex-col justify-center items-center shadow-lg no-underline"
														to={'/targeted-instruction/summative-test'}>
														<img
															className="h-24 w-28"
															src={Summative}
															alt="img"
														/>
														<div className="text-blue-900 text-lg font-bold">
															Final Test
														</div>
													</Link>
												)}
										</>
									)
								})}
							{quiz && quiz.quiz_id && (
								<div
									className="no-underline bg-gray-tip h-20 w-full mx-3 rounded-md mb-3 flex flex-row justify-between items-center px-2"
									onClick={e => redirectToQuiz(e, quiz.quiz_id)}>
									<div className="flex flex-col justify-between items-center w-full h-15 pl-4">
										<div className="text-white text-lg font-bold mb-1">
											{quiz.quiz_title}
										</div>
										<div className="text-xs text-white">
											Quiz Number {quiz.quiz_order}
										</div>
									</div>
									{teacher_quizzes_record.taken && (
										<img
											src={QuizMark}
											className="h-8 w-8 flex items-center justify-center print:hidden cursor-pointer"
										/>
									)}
								</div>
							)}
						</>
					)
				})}
			<div className="w-full flex justify-around print:hidden">
				<button
					className="border-none bg-green-tip-brand rounded-md text-white text-lg p-2 w-5/12 my-3"
					onClick={onClearAll}>
					Clear All
				</button>
				<button
					className="border-none bg-green-tip-brand rounded-md text-white text-lg p-2 w-5/12 my-3"
					onClick={() => window.print()}>
					Print All
				</button>
			</div>
		</div>
	)
}

export default connect(
	(state: RootReducerState) => ({
		faculty: state.db.faculty,
		faculty_id: state.auth.faculty_id,
		curriculum: state.targeted_instruction.curriculum,
		targeted_instruction: state.targeted_instruction
	}),
	(dispatch: Function) => ({
		lessonPlanTaken: (
			faculty_id: string,
			learning_level_id: string,
			subject: string,
			lesson_number: string,
			value: boolean
		) =>
			dispatch(lessonPlanTaken(faculty_id, learning_level_id, subject, lesson_number, value)),
		clearLessonPlans: (faculty_id: string, learning_level_id: string, subject: string) =>
			dispatch(clearLessonPlans(faculty_id, learning_level_id, subject)),
		quizTaken: (faculty_id: string, quiz_id: string, value: boolean) =>
			dispatch(quizTaken(faculty_id, quiz_id, value))
	})
)(List)
