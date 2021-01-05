
import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { addReport } from 'actions'

interface P {
    targeted_instruction: RootReducerState["targeted_instruction"]
    students: RootDBState["students"]

    saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport, selectedSubject: string) => void
}

type PropsType = P & RouteComponentProps

interface Question {
    [questionId: string]: {
        question_text: string
        is_correct: boolean
        slo: string
    }
}

type S = {
    questionsObj: Question
    result: MISDiagnosticReport
}

const Grading: React.FC<PropsType> = (props) => {
    const [state, setState] = useState<S>({
        questionsObj: {},
        result: null
    })

    useEffect(() => {
        getUpdatedState()
    }, [])

    const { class_name, subject, std_id, section_id } = props.match.params as Params
    const test_id = `${subject.toLowerCase()}-${class_name.substring(6)}`

    const selectedTest: Question = useMemo(() => getQuestionList(props.students[std_id].diagnostic_result, test_id), []);

    const getUpdatedState = () => {
        const questionList = Object.entries(selectedTest).reduce<Question>((agg, [key, value]) => {
            return {
                [key]: {
                    "question_text": value.question_text,
                    "is_correct": value.is_correct,
                    "slo": value.slo
                },
                ...agg
            }
        }, {})
        setState({
            ...state,
            questionsObj: questionList
        })
    }

    const handleChange = (val: any, questionId: string) => {
        state.questionsObj[questionId].is_correct = val
        let diagnostic_res = props.students[std_id].diagnostic_result[test_id]
        diagnostic_res[questionId].is_correct = val
        setState({
            ...state,
            questionsObj: state.questionsObj,
            result: diagnostic_res
        })
    }

    const onSave = () => {
        state.result && props.saveReport(std_id, state.result, test_id)
        props.history.push(`${(props.location.pathname).substring(0, 36)}/${section_id}/${class_name}/${subject}/insert-grades`)
    }

    return <div className="flex flex-wrap content-between">
        <div className="container sm:px-8 bg-yellow-400 rounded m-3 h-20 mb-6">
            <div className="flex flex-row justify-start">
                <img className="h-12 rounded-full p-4"
                    src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300"
                    alt="img" />
                <div className="flex flex-col justify-center">
                    <div className="text-white text-md font-medium">Miss Humna</div>
                    <div className="flex flex-row justify-between mt-2">
                        <div className="text-white text-xs font-thin">{`${class_name} | ${subject}`}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-between w-full mx-4">
            {
                Object.keys(state.questionsObj).map(function (key) {
                    return <div key={key} className="flex flex-row justify-between mt-3">
                        <div className="text-current text-xs">{state.questionsObj[key].question_text}</div>
                        <div className="rounded-lg w-30 bg-white">
                            <button className={!state.questionsObj[key].is_correct ? "border-none rounded-lg text-xs outline-none text-white bg-pink-700" : "border-none rounded-lg text-xs outline-none"} onClick={() => handleChange(false, key)}>Incorrect</button>
                            <button className={state.questionsObj[key].is_correct ? "border-none rounded-lg text-xs text-white bg-green-500 outline-none" : "border-none rounded-lg text-xs outline-none"} onClick={() => handleChange(true, key)}>Correct</button>
                        </div>
                    </div>
                })
            }
        </div>
        <div className="w-full mt-5 flex justify-center">
            <button
                className="bg-blue-900 text-bold text-lg border-none rounded-md text-white p-2 w-9/12"
                onClick={onSave}>Save and Continue</button>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    targeted_instruction: state.targeted_instruction
}), (dispatch: Function) => ({
    saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport, selectedSubject: string) => dispatch(addReport(stdId, diagnostic_report, selectedSubject)),
}))(withRouter(Grading))

const getQuestionList = (diagnostic_result: MISStudent["diagnostic_result"], test_id: string) => {
    return Object.entries(diagnostic_result)
        .reduce((agg, [id, test]) => {
            if (id === test_id) {
                return test
            }
            return agg
        }, {})
}