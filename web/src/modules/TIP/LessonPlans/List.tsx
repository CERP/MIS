import React, { useMemo } from 'react';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Card from '../Card'
import { Tick } from 'assets/icons'
import { lessonPlanTaken } from 'actions'

interface P {
    curriculum: RootReducerState["targeted_instruction"]["curriculum"]
    lessonPlanTaken: (learning_level_id: string, subject: string, lesson_number: string) => void
}

type PropsType = P & RouteComponentProps

const List: React.FC<PropsType> = ({ match, curriculum, location, history, lessonPlanTaken }) => {

    const { class_name, subject } = match.params as Params
    const done = (level: string, subject: string, lesson_number: string) => {
        lessonPlanTaken(level, subject, lesson_number)
    }
    //@ts-ignore
    const redirect = (e, lesson_number: string) => {
        e.preventDefault()
        // debugger
        // history.push(`${(location.pathname).substring(0, 34)}/${class_name}/${subject}/${lesson_number}/list/pdf`)
    }

    const lessonPlans = useMemo(() => getLessonPlan(curriculum, class_name, subject), [])

    return <div className="flex flex-wrap content-between">
        <Card class_name='' />
        {
            Object.values(lessonPlans).map((curr) => {
                return <div key={curr.lesson_number}
                    className="no-underline bg-blue-300 h-15 w-full mx-3 rounded-md mb-3 flex flex-row justify-between items-center p-3"
                    onClick={(e) => redirect(e, curr.lesson_number)}>
                    <div className="flex flex-col justify-between items-center w-5/6 h-15">
                        <div className="text-white font-bold">{curr.lesson_title}</div>
                        <div className="text-xs text-black">{`Lesson number ${curr.lesson_number}`}</div>
                    </div>
                    {curr.taken ? <img src={Tick} className="h-6 w-6 bg-white rounded-full flex items-center justify-center" /> :
                        <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center"
                            onClick={() => done(class_name, curr.subject, curr.lesson_number)}>A
                    </div>}
                </div>
            })
        }
    </div>
}

export default connect((state: RootReducerState) => ({
    curriculum: state.targeted_instruction.curriculum
}), (dispatch: Function) => ({
    lessonPlanTaken: (learning_level_id: string, subject: string, lesson_number: string) => dispatch(lessonPlanTaken(learning_level_id, subject, lesson_number)),
}))(withRouter(List))

const getLessonPlan = (curriculum: RootReducerState["targeted_instruction"]["curriculum"], class_name: string, subject: string) => {
    return curriculum[parseInt(class_name)][subject]
}