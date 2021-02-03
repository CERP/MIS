import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import Card from '../Card'
import { Check, WhiteTick } from 'assets/icons'
import { lessonPlanTaken } from 'actions'
import Dynamic from '@cerp/dynamic';
import Headings from '../Headings';

interface P {
	faculty: RootDBState["faculty"]
	faculty_id: RootReducerState["auth"]["faculty_id"]
	curriculum: TIPCurriculum

	lessonPlanTaken: (faculty_id: string, learning_level_id: string, subject: string, lesson_number: string, value: boolean) => void
}

/**
 * Generates a new TIPTeacherLessonPlans for teaches who do not yet have a lesson plan for this learning level and subject in their object.
 * By default, all "taken" values are set to false
 * @param lesson_plans 
 */
const blankLessonPlan = (lesson_plans: TIPLessonPlans): TIPTeacherLessonPlans => {

	const res = Object.entries(lesson_plans)
		.reduce<TIPTeacherLessonPlans>((agg, [lesson_id, lesson]) => ({
			...agg,
			[lesson_id]: {
				...lesson,
				taken: false
			}
		}), {})

	return res
}


type PropsType = P & RouteComponentProps

const List: React.FC<PropsType> = ({ match, faculty, faculty_id, history, curriculum, lessonPlanTaken }) => {

	const { class_name, subject } = match.params as Params
	const url = match.url.split('/')

	//const parsed_class = parseInt(class_name)

	const teacher = faculty[faculty_id]

	const lesson_plans = curriculum[class_name as TIPLevels][subject]


	const existing_teacher_record = Dynamic.get<TIPTeacherLessonPlans>(teacher, ["targeted_instruction", "curriculum", class_name, subject])
	const teacher_lesson_record = existing_teacher_record || blankLessonPlan(lesson_plans)

	const done = (e: any, level: string, subject: string, lesson_number: string, value: boolean) => {
		e.stopPropagation()
		lessonPlanTaken(faculty_id, level, subject, lesson_number, value)
	}

	const redirect = (e: any, lesson_number: string) => {
		e.stopPropagation();
		history.push(`/${url[1]}/${url[2]}/${class_name}/${subject}/${lesson_number}/list/pdf`)
	}

	return <div className="flex flex-wrap content-between">
		<Card class_name={class_name} subject={subject} />

		<Headings heading={'Lesson Plan Library'} sub_heading={'Click on a plan to view'} />

		{
			Object.values(lesson_plans)
				.sort((a, b) => parseInt(a.lesson_number) - parseInt(b.lesson_number))
				.map((curr) => {

					const teacher_record = teacher_lesson_record[curr.lesson_number] || { taken: false }

					return <div key={curr.lesson_number}
						className="no-underline bg-blue-100 h-20 w-full mx-3 rounded-md mb-3 flex flex-row justify-between items-center px-2"
						onClick={(e) => redirect(e, curr.lesson_number)}>

						<div className="flex flex-col justify-between items-center w-5/6 h-15 pl-4">
							<div className="text-white text-lg font-bold mb-1">{curr.lesson_title}</div>
							<div className="text-xs text-white">{`Lesson number ${curr.lesson_number}`}</div>
						</div>

						{
							teacher_record.taken ?
								<img src={Check} className="h-6 w-6 bg-white rounded-full flex items-center justify-center"
									onClick={(e) => done(e, class_name, curr.subject, curr.lesson_number, false)} /> :
								<div className="h-6 w-6 bg-white rounded-full flex items-center justify-center"
									onClick={(e) => done(e, class_name, curr.subject, curr.lesson_number, true)}>
									<img className="h-3 w-3" src={WhiteTick} />
								</div>
						}
					</div>
				})}
		<div className="w-full flex justify-center items-center">
			<button className="border-none bg-green-primary rounded-md text-white text-lg p-2 w-3/6 my-3">Print All</button>
		</div>
	</div>
}

export default connect((state: RootReducerState) => ({
	faculty: state.db.faculty,
	faculty_id: state.auth.faculty_id,
	curriculum: state.targeted_instruction.curriculum
}), (dispatch: Function) => ({
	lessonPlanTaken: (faculty_id: string, learning_level_id: string, subject: string, lesson_number: string, value: boolean) => dispatch(lessonPlanTaken(faculty_id, learning_level_id, subject, lesson_number, value)),
}))(withRouter(List))