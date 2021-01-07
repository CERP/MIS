
import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { addReport } from 'actions'

interface P {
    targeted_instruction: RootReducerState["targeted_instruction"]
    students: RootDBState["students"]

    saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport['questions'], selectedSubject: string) => void
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

    const { class_name, subject, std_id, section_id } = props.match.params as Params
    const test_id = `${subject.toLowerCase()}-${class_name.substring(6)}`

    const selectedTest: MISDiagnosticReport = useMemo(() => getQuestionList(props.students[std_id].diagnostic_result, test_id), []);
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
        let diagnostic_res = props.students[std_id].diagnostic_result[test_id].questions
        diagnostic_res[questionId].is_correct = val
        setState({
            ...state,
            questionsObj: state.questionsObj,
            result: diagnostic_res
        })
    }

    const onSave = () => {
        state.result && props.saveReport(std_id, state.result, test_id)
        props.history.push(`${(props.location.pathname).substring(0, 36)}/${section_id}/${class_name}/${subject}/insert-grades/${std_id}/grading/test-result`)
    }

    return <div className="flex flex-wrap content-between bg-white">
        <div className="container sm:px-8 bg-yellow-400 rounded m-3 h-24 mb-6">
            <div className="flex flex-row justify-start">
                <img className="h-14 rounded-full p-4"
                    src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300"
                    alt="img" />
                <div className="flex flex-col justify-center">
                    <div className="text-white text-xl font-bold">Miss Humna</div>
                    <div className="flex flex-row justify-between mt-2">
                        <div className="text-white text-base font-bold">{`${class_name} | ${subject}`}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-between w-full mx-4">
            {
                Object.keys(state.questionsObj).map(function (key, index) {
                    return <div key={key} className={`flex flex-row justify-between items-center border border-solid border-gray-200 px-3 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} h-12`}>
                        <div className="text-xs">{state.questionsObj[key].question_text}</div>
                        <div className="rounded-xl w-30 h-6 bg-white border border-solid border-gray-100">
                            <button className={!state.questionsObj[key].is_correct ? "border-none h-full rounded-xl text-xs outline-none text-white bg-incorrect-red" : "border-none bg-white h-full rounded-xl text-xs outline-non"} onClick={() => handleChange(false, key)}>Incorrect</button>
                            <button className={state.questionsObj[key].is_correct ? "border-none h-full rounded-xl text-xs text-white bg-correct-green outline-none" : "border-none bg-white h-full rounded-xl text-xs outline-none"} onClick={() => handleChange(true, key)}>Correct</button>
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
    students: state.db.students,
    targeted_instruction: state.targeted_instruction
}), (dispatch: Function) => ({
    saveReport: (stdId: string, diagnostic_report: MISDiagnosticReport['questions'], selectedSubject: string) => dispatch(addReport(stdId, diagnostic_report, selectedSubject)),
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