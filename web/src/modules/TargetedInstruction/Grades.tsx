import React, { useState, useEffect } from 'react';
import Banner from 'components/Banner'
import './style.css'

interface P {
    questions: Question
    stdId: string
    testId: string
    testType: string
    students: RootDBState["students"]

    setQuestions: (type: Question) => any
    saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport, testId: string) => void
}

interface Question {
    [questionId: string]: {
        answer: boolean
        correctAnswer: string
        slo: string
    }
}

type S = {
    banner: MISBanner
    questionsArr: Question
    result: MISDiagnosticReport
}

const StudentGrades: React.FC<P> = ({ questions, stdId, testId, students, saveReport, setQuestions }) => {

    const [state, setState] = useState<S>({
        banner: {
            active: false,
            good: true,
            text: "Saved!"
        },
        questionsArr: {},
        result: null
    })

    useEffect(() => {
        setState({
            ...state,
            questionsArr: questions
        })
    }, [questions])

    const handleChange = (e: any, questionId: string) => {
        state.questionsArr[questionId].answer = e.target.checked
        let diagnostic_res = students[stdId].diagnostic_result[testId]
        diagnostic_res[questionId].isCorrect = e.target.checked
        setState({
            ...state,
            questionsArr: state.questionsArr,
            result: diagnostic_res
        })
    }

    const onSave = () => {

        setQuestions(state.questionsArr)
        saveReport(stdId, state.result, testId)

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
        {Object.keys(state.questionsArr).length > 0 &&
            < div className="section">
                <div className="questions-container">
                    <div style={{ textAlign: 'center' }}>
                        <label className="title capitalize" >{testId}</label>
                    </div>
                    <div className="flex-view">
                        <div className="table-header capitalize" style={{ textAlign: "left" }}>Question Title</div>
                        <div className="table-header capitalize">Correct Answers</div>
                        <div className="table-header capitalize">Answers</div>
                    </div>
                    {
                        Object.keys(state.questionsArr).map(function (key) {
                            return <div key={key} className="form">
                                <div className="flex-view">
                                    <div className="capitalize" style={{ textAlign: "left" }}>{key}</div>
                                    <div className="capitalize">{(state.questionsArr[key].correctAnswer)}</div>
                                    <label className="switch">
                                        <input type="checkbox" checked={state.questionsArr[key].answer} onChange={(e) => handleChange(e, key)} />
                                        <span className="toggleSlider round"></span>
                                    </label>
                                </div>
                            </div>
                        })
                    }
                    <div className="save-btn-div">
                        <button className="button blue save-btn mobile-mode" onClick={onSave}>SAVE</button>
                    </div>
                </div>
            </div>
        }
    </>
}

export default StudentGrades