import React, { useState, useEffect } from 'react';
import Banner from 'components/Banner'
import './style.css'

interface P {
    questions: string[]
    stdId: string
    testId: string
    testType: string
    students: RootDBState["students"]

    setQuestions: (type: string[]) => any
    saveReport: (stdId: string, diagnostic_result: MISStudent['diagnostic_result'], testId: string) => void
}

const StudentGrades: React.FC<P> = ({ questions, stdId, testId, students, saveReport, setQuestions }) => {

    const [state, setState] = useState({
        banner: {
            active: false,
            good: true,
            text: "Saved!"
        },
        questionsArr: [],
        result: null
    })

    useEffect(() => {
        setState({
            ...state,
            questionsArr: questions
        })
    }, [questions])

    const handleChange = (e: any, questionId: string) => {
        const index = state.questionsArr.findIndex((obj) => { return obj.question === questionId })
        state.questionsArr[index].answer = e.target.checked
        let diagnostic_res = students[stdId].diagnostic_result[testId]
        diagnostic_res[questionId].isCorrect = e.target.checked
        setState({
            ...state,
            questionsArr: state.questionsArr,
            result: diagnostic_res
        })
    }

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1, 5);
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
        {state.questionsArr && state.questionsArr.length > 0 &&
            < div className="section">
                <div className="questions-container">
                    <div style={{ textAlign: 'center' }}>
                        <label className="title" >{capitalize(testId)}</label>
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
                                    <span className="toggleSlider round"></span>
                                </label>
                            </div>
                        </div>
                    })}
                    {state.questionsArr.length > 0 &&
                        <div className="save-btn-div">
                            <button className="button blue save-btn mobile-mode" onClick={onSave}>SAVE</button>
                        </div>}
                </div>
            </div>
        }
    </>
}

export default StudentGrades