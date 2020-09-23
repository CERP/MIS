import React, { useState } from 'react';
import { connect } from 'react-redux'
import Switch from "react-switch";
import Banner from 'components/Banner'
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
    const [state, setState] = useState({
        banner: {
            active: false,
            good: true,
            text: "Saved!"
        }
    })
    const handleChange = (checked: any, questionId: any, stdId: any, testId: any) => {
        const tests = props.stdObj.diagnostic_result[testId]
        tests[questionId].isCorrect = checked
    }

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1, 5);
    }

    const onSave = () => {
        setState({
            banner: {
                active: true,
                good: true,
                text: "Saved!"
            }
        })

        setTimeout(() => {
            setState({
                banner: {
                    active: false,
                    good: true,
                    text: "Saved!"
                },
            })
        }, 1000)
    }

    return <>
        {state.banner.active ? <Banner isGood={state.banner.good} text={state.banner.text} /> : false}
        {props.questions.length > 0 &&
            < div className="section">
                <div className="questions-container">
                    <div style={{ textAlign: 'center' }}>
                        <label className="title" >{capitalize(props.testId)}</label>
                    </div>
                    {props.questions && props.questions.map((question: any) => {
                        return <div key={question.key} className="form">
                            <div className="row">
                                <div className="questionName">{(question.key)}</div>
                                <Switch
                                    onChange={(e) => handleChange(e, question.key, props.stdId, props.testId)}
                                    checked={question.value}
                                    id="normal-switch"
                                />
                            </div>
                        </div>
                    })}
                    {props.questions.length > 0 &&
                        <div className="row saveBtnDiv">
                            <button className="button green saveBtn" onClick={onSave}>SAVE</button>
                        </div>}
                </div>
            </div>
        }
    </>
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.db.targeted_instruction,
    students: state.db.students
}))(StudentGrades)