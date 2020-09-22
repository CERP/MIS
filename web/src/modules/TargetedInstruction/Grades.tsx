import React from 'react';
import { connect } from 'react-redux'
import Switch from "react-switch";
import './style.css'

interface P {
    questions: any
    stdId: any
    testId: any
    stdObj: any
    students: RootDBState["students"]
    targeted_instruction: RootDBState["targeted_instruction"]
}

const StudentGrades: React.FC<P> = (props: any) => {

    const handleChange = (checked: any, questionId: any, stdId: any, testId: any) => {
        const tests = props.stdObj.diagnostic[testId]
        tests[questionId].isCorrect = checked
    }

    return <div className="questions-container">
        {props.questions && props.questions.map((question: any) => {
            return <div key={question.key} className="form">
                <div className="row">
                    <div>{(question.key)}</div>
                    <Switch
                        onChange={(e) => handleChange(e, question.key, props.stdId, props.testId)}
                        checked={question.value}
                        id="normal-switch"
                    />
                </div>
            </div>
        })}
    </div>
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.db.targeted_instruction,
    students: state.db.students
}))(StudentGrades)