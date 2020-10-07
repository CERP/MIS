//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
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
        },
        questionsArr: []
    })

    useEffect(() => {
        setState({
            ...state,
            questionsArr: props.questions
        })
    }, [props.questions])

    const handleChange = (e: any, questionId: any) => {
        const index = state.questionsArr.findIndex((obj) => { return obj.question === questionId })
        state.questionsArr[index].answer = e.target.checked
        setState({
            ...state,
            questionsArr: state.questionsArr
        })
    }

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1, 5);
    }

    const createReport = () => {

        let slo_keys = []
        state.questionsArr.forEach(function (item) {
            slo_keys.push({
                slo: item.slo,
                answer: item.answer
            })
        });

        let report = {}
        for (let [, sloObj] of Object.entries(slo_keys)) {
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
                report[category].link = props.targeted_instruction.SLO_Mapping[sloObj.slo].link
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
        return report
    }

    const onSave = () => {

        props.students[props.stdId]['report'] = {
            [props.testType]: {
                ...props.students[props.stdId].report[props.testType],
                [props.testId]: createReport()
            }
        }

        setState({
            ...state,
            banner: {
                active: true,
                good: true,
                text: "Saved!"
            }
        })

        setTimeout(() => {
            setState({
                ...state,
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
        {state.questionsArr && state.questionsArr.length > 0 &&
            < div className="section">
                <div className="questions-container">
                    <div style={{ textAlign: 'center' }}>
                        <label className="title" >{capitalize(props.testId)}</label>
                    </div>
                    <div className="flex-view">
                        <div className="table-header" style={{ textAlign: "left" }}>Question Title</div>
                        <div className="table-header">Correct Answers</div>
                        <div className="table-header">Answers</div>
                    </div>
                    {state.questionsArr && state.questionsArr.map((obj: any) => {
                        return <div key={obj.question} className="form">
                            <div className="flex-view">
                                <div className="question-name" style={{ textAlign: "left" }}>{(obj.question)}</div>
                                <div className="question-name tale-data">{(obj.correctAnswer)}</div>
                                <label className="switch">
                                    <input type="checkbox" checked={obj.answer} onChange={(e) => handleChange(e, obj.question)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    })}
                    {state.questionsArr.length > 0 &&
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