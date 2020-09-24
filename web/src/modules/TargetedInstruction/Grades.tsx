//@ts-nocheck
import React, { useState } from 'react';
import { connect } from 'react-redux'
import Switch from "react-switch";
import Banner from 'components/Banner'
import './style.css'

interface P {
    questions: any
    stdId: any
    testId: any
    testType: any
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

    const handleChange = (checked: any, questionId: any) => {
        const tests = props.stdObj.diagnostic_result[props.testId]
        tests[questionId].isCorrect = checked
    }

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1, 5);
    }

    const onSave = () => {
        let slo_keys = []
        const tests = props.stdObj.diagnostic_result[props.testId]
        for (let [id, obj] of Object.entries(tests)) {
            slo_keys.push({
                slo: obj.slo[0],
                answer: obj.isCorrect
            })
        }
        let report = {}
        for (let [id, sloObj] of Object.entries(slo_keys)) {
            const category = props.targeted_instruction.SLO_Mapping[sloObj.slo].category
            if (report[category]) {
                if (sloObj.answer) {
                    const countCorrect = ++report[category].correct
                    const countPossible = ++report[category].possible
                    report[category] = {
                        correct: countCorrect,
                        possible: countPossible
                    }
                } else {
                    const countPossible = ++report[category].possible
                    report[category] = {
                        correct: report[category].correct,
                        possible: countPossible
                    }
                }

            } else {
                if (sloObj.answer) {
                    report[category] = {
                        correct: 1,
                        possible: 1
                    }
                } else {
                    report[category] = {
                        correct: 0,
                        possible: 1
                    }
                }
            }
        }

        for (let [key, obj] of Object.entries(report)) {
            obj.percentage = (obj.correct / obj.possible) * 100;
        }

        props.students[props.stdId].report = {
            [props.testType]: {
                [props.testId]: report
            }
        }
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
                                <div className="question-name">{(question.key)}</div>
                                <Switch
                                    onChange={(e) => handleChange(e, question.key)}
                                    checked={question.value}
                                    id="normal-switch"
                                />
                            </div>
                        </div>
                    })}
                    {props.questions.length > 0 &&
                        <div className="row save-btn-div">
                            <button className="button green save-btn" onClick={onSave}>SAVE</button>
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