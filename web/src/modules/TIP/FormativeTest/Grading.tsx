
import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getQuestionList } from 'utils/TIP'
import { addReport } from 'actions'

interface P {
    teacher_name: string
    students: RootDBState["students"]

    saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport['questions'], selectedSubject: string, subject: string, learning_level: string) => void
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

    const selectedTest: MISDiagnosticReport = useMemo(() => getQuestionList(props.students[std_id].targeted_instruction.diagnostic_result, test_id), []);

    const getUpdatedState = () => {
        const questionList: MISDiagnosticReport['questions'] = Object.entries(selectedTest.questions || {}).reduce((agg, [key, value]) => {
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
        let diagnostic_res = props.students[std_id].targeted_instruction.diagnostic_result[test_id].questions
        diagnostic_res[questionId].is_correct = val
        setState({
            ...state,
            questionsObj: state.questionsObj,
            result: diagnostic_res
        })
    }

    type Levels = {
        [level: string]: number
    }

    const calculateLearningLevel = (result: MISDiagnosticReport['questions']) => {
        const total: Levels = {}
        const levels = Object.values(result || {}).reduce((agg, question) => {
            const val = question.is_correct ? 1 : 0
            if (agg[question.level]) {
                total[question.level] = total[question.level] + 1
                return {
                    ...agg,
                    [question.level]: agg[question.level] + val
                }
            }
            total[question.level] = 1
            return {
                ...agg,
                [question.level]: val,

            }
        }, {} as Levels)
        const percentages = Object.entries(levels).reduce((agg, [level, value]) => {
            const percentage = value / total[level] * 100
            if (percentage < 80) {
                return {
                    ...agg,
                    [level]: percentage
                }
            }
            return { ...agg }
        }, {} as Levels)
        const level = Object.keys(percentages || {}).reduce(function (a, b) {
            if (percentages[a] === 0 && percentages[b] === 0) {
                return a < b ? a : b
            }
            return percentages[a] > percentages[b] ? a : b
        })
        return level === "1" ? "Blue" : level === "2" ? "Yellow" : level === "3" ? "Green" : "Pink"
    }

    const onSave = () => {
        const group = state.result && calculateLearningLevel(state.result)
        state.result && props.saveReport(std_id, state.result, test_id, subject, group)
        props.history.push(`${(props.location.pathname).substring(0, 36)}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades`)
    }

    return <div className="flex flex-wrap content-between bg-white">
        <div className="container sm:px-8 bg-yellow-400 rounded m-3 h-24 mb-6">
            <div className="flex flex-row justify-start">
                <img className="h-14 rounded-full p-4"
                    src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300"
                    alt="img" />
                <div className="flex flex-col justify-center">
                    <div className="text-white text-xl font-bold">{props.teacher_name}</div>
                    <div className="flex flex-row justify-between mt-2">
                        <div className="text-white text-base font-bold">{`${class_name} | ${subject}`}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-between w-full mx-4">
            {
                Object.keys(state.questionsObj)
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
                    })
            }
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
    saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport['questions'], selectedSubject: string, subject: string, learning_level: string) => dispatch(addReport(stdId, diagnostic_report, selectedSubject, subject, learning_level)),
}))(withRouter(Grading))
