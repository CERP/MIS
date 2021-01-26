import React, { useState, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import Card from '../Card'
import { Tick, WhiteTick } from 'assets/icons'
import { lessonPlanTaken } from 'actions'

interface P {
    faculty: RootDBState["faculty"]
    faculty_id: RootReducerState["auth"]["faculty_id"]

    lessonPlanTaken: (faculty_id: string, learning_level_id: string, subject: string, lesson_number: string, value: boolean) => void
}

type PropsType = P & RouteComponentProps

const List: React.FC<PropsType> = ({ match, faculty, faculty_id, history, lessonPlanTaken }) => {

    const [lesson_plans, setLessonPlans] = useState<LearningLevels>({})
    const { class_name, subject } = match.params as Params
    const url = match.url.split('/')

    useEffect(() => {
        getLessonPlan(faculty, faculty_id, class_name, subject)
    }, [])

    const getLessonPlan = (faculty: RootDBState["faculty"], faculty_id: string, class_name: string, subject: string) => {
        setLessonPlans(faculty[faculty_id].targeted_instruction.curriculum &&
            faculty[faculty_id].targeted_instruction.curriculum[parseInt(class_name)] &&
            faculty[faculty_id].targeted_instruction.curriculum[parseInt(class_name)][subject])
    }

    const done = (e: any, level: string, subject: string, lesson_number: string, value: boolean) => {
        e.stopPropagation()
        faculty[faculty_id].targeted_instruction.curriculum[parseInt(class_name)][subject][parseInt(lesson_number)].taken = value
        setLessonPlans(faculty[faculty_id].targeted_instruction.curriculum[parseInt(class_name)][subject])
        lessonPlanTaken(faculty_id, level, subject, lesson_number, value)
    }

    const redirect = (e: any, lesson_number: string) => {
        e.stopPropagation();
        history.push(`/${url[1]}/${url[2]}/${class_name}/${subject}/${lesson_number}/list/pdf`)
    }

    return <div className="flex flex-wrap content-between">
        <Card class_name={class_name} subject={subject} />
        {Object.values(lesson_plans || {}).map((curr) => {
            return <div key={curr.lesson_number}
                className="no-underline bg-blue-100 h-20 w-full mx-3 rounded-md mb-3 flex flex-row justify-between items-center px-2"
                onClick={(e) => redirect(e, curr.lesson_number)}>
                <div className="flex flex-col justify-between items-center w-5/6 h-15 pl-4">
                    <div className="text-white text-lg font-bold mb-1">{curr.lesson_title}</div>
                    <div className="text-xs text-white">{`Lesson number ${curr.lesson_number}`}</div>
                </div>
                {curr.taken ? <img src={Tick} className="h-6 w-6 bg-white rounded-full flex items-center justify-center"
                    onClick={(e) => done(e, class_name, curr.subject, curr.lesson_number, false)} /> :
                    <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center"
                        onClick={(e) => done(e, class_name, curr.subject, curr.lesson_number, true)}>
                        <img className="h-3 w-3" src={WhiteTick} />
                    </div>}
            </div>
        })}
        <div className="w-full flex justify-center items-center">
            <button className="border-none bg-green-primary rounded-md text-white text-lg p-2 w-3/6 fixed bottom-0 my-3">Print All</button>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    faculty: state.db.faculty,
    faculty_id: state.auth.faculty_id
}), (dispatch: Function) => ({
    lessonPlanTaken: (faculty_id: string, learning_level_id: string, subject: string, lesson_number: string, value: boolean) => dispatch(lessonPlanTaken(faculty_id, learning_level_id, subject, lesson_number, value)),
}))(withRouter(List))