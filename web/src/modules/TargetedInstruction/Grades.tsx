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

                report[category].percentage = (report[category].correct / report[category].possible) * 100

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

        props.students[props.stdId]['report'] = {
            [props.testType]: {
                ...props.students[props.stdId].report[props.testType],
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
                    <div className="flex-view">
                        <div className="table-header" style={{ textAlign: "left" }}>Question Title</div>
                        <div className="table-header">Answers</div>
                        <div className="table-header">Correct Answers</div>
                    </div>
                    {props.questions && props.questions.map((obj: any) => {
                        return <div key={obj.question} className="form">
                            <div className="flex-view">
                                <div className="question-name" style={{ textAlign: "left" }}>{(obj.question)}</div>
                                <div className="question-name tale-data">{(obj.correctAnswer)}</div>
                                <div className="question-name">  <Switch
                                    height={25}
                                    width={50}
                                    onChange={(e) => handleChange(e, obj.question)}
                                    checked={obj.answer}
                                    id="normal-switch"
                                /></div>
                            </div>
                        </div>
                    })}
                    {props.questions.length > 0 &&
                        <div className="save-btn-div">
                            <button className="button green save-btn mobile-mode" onClick={onSave}>SAVE</button>
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