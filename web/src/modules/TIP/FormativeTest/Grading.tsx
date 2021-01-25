
import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getQuestionList, calculateLearningLevel } from 'utils/TIP'
import Card from '../Card'
import { addReport } from 'actions'

interface P {
    teacher_name: string
    students: RootDBState["students"]

    saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport['questions'], selectedSubject: string, subject: string, learning_level: LearningLevel, type: string) => void
}

type PropsType = P & RouteComponentProps

type S = {
    questionsObj: MISDiagnosticReport['questions']
    result: MISDiagnosticReport['questions']
}

const Grading: React.FC<PropsType> = (props) => {
    const [state, setState] = useState<S>({
        questionsObj: {},
        result: null
    })

    useEffect(() => {
        getUpdatedState()
    }, [])

    const { class_name, subject, std_id, section_id, test_id } = props.match.params as Params
    const url = props.match.url.split('/')

    const selectedTest: MISDiagnosticReport = useMemo(() => getQuestionList(url[2] === "diagnostic-test" ?
        props.students[std_id].targeted_instruction.diagnostic_result : url[2] === "formative-test" ?
            props.students[std_id].targeted_instruction.formative_result :
            props.students[std_id].targeted_instruction.summative_result, test_id), []);

    const getUpdatedState = () => {
        const questionList: MISDiagnosticReport['questions'] = Object.entries(selectedTest.questions || {}).reduce((agg, [key, value]) => {
            return {
                [key]: {
                    "question_text": value.question_text.replace(/\$/g, ','),
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
        let res
        if (url[2] === "diagnostic-test") {
            res = props.students[std_id].targeted_instruction.diagnostic_result[test_id].questions
            res[questionId].is_correct = val
        } else if (url[2] === "formative-test") {
            res = props.students[std_id].targeted_instruction.formative_result[test_id].questions
            res[questionId].is_correct = val
        } else {
            res = props.students[std_id].targeted_instruction.summative_result[test_id].questions
            res[questionId].is_correct = val
        }
        setState({
            ...state,
            questionsObj: state.questionsObj,
            result: res
        })
    }

    const onSave = () => {
        const group = url[2] === "diagnostic-test" && state.result && calculateLearningLevel(state.result)
        state.result && props.saveReport(std_id, state.result, test_id, subject, group, url[2].replace("-test", "_result"),)
        props.history.push(url[2] === "diagnostic-test" ?
            `/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades` :
            `/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades`)
    }

    return <div className="flex flex-wrap content-between bg-white">
        <Card class_name={class_name} subject={subject} />
        <div className="flex flex-col justify-between w-full mx-4">
            {Object.keys(state.questionsObj)
                .sort((a, b) => a.localeCompare(b))
                .map(function (key, index) {
                    return <div key={key} className={`flex flex-row justify-between items-center border border-solid border-gray-200 px-3 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} h-12`}>
                        <span className="text-xs font-bold">{`${key}: `}</span><div className="text-xs w-32 truncate">{state.questionsObj[key].question_text}</div>
                        <div className="rounded-xl w-30 h-6 bg-white border border-solid border-gray-100">
                            <button className={!state.questionsObj[key].is_correct ?
                                "border-none h-full rounded-xl text-xs outline-none text-white bg-incorrect-red" :
                                "border-none bg-white h-full rounded-xl text-xs outline-non"}
                                onClick={() => handleChange(false, key)}>Incorrect
                            </button>
                            <button className={state.questionsObj[key].is_correct ?
                                "border-none h-full rounded-xl text-xs text-white bg-correct-green outline-none" :
                                "border-none bg-white h-full rounded-xl text-xs outline-none"}
                                onClick={() => handleChange(true, key)}>Correct
                            </button>
                        </div>
                    </div>
                })}
        </div>
        <div className="w-full mt-5 flex justify-center">
            <button
                className="bg-blue-900 h-11 font-bold text-base border-none rounded-md text-white p-2 w-9/12 mb-4"
                onClick={onSave}>Save and Continue</button>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    teacher_name: state.auth.name,
    students: state.db.students,
}), (dispatch: Function) => ({
    saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport['questions'], selectedSubject: string, subject: string, learning_level: LearningLevel, type: string) => dispatch(addReport(stdId, diagnostic_report, selectedSubject, subject, learning_level, type)),
}))(withRouter(Grading))
