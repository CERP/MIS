import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom'

interface P {
    targeted_instruction: RootReducerState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const Grading: React.FC<PropsType> = (props) => {
    const [clicked, setClicked] = useState(false)

    const { class_name, subject, std_id } = props.match.params as Params

    const questions: DiagnosticTestQuestion = useMemo(() => getQuestionList(subject, props.targeted_instruction), [subject, std_id]);

    return <div className="flex flex-wrap content-between">
        <div className="container sm:px-8 bg-yellow-400 rounded m-3 h-20 mb-6">
            <div className="flex flex-row justify-start">
                <img className="h-12 rounded-full p-4" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                <div className="flex flex-col justify-center">
                    <div className="text-white text-md font-medium">Miss Humna</div>
                    <div className="flex flex-row justify-between mt-2">
                        <div className="text-white text-xs font-thin">{class_name}</div>
                        <div className="text-white text-xs font-thin">{subject}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-between w-full mx-4">
            {
                Object.values(questions)
                    .map((questObj) => (<div key={questObj.question_text} className="flex flex-row justify-between mt-3">
                        <div className="text-current text-xs">{questObj.question_text}</div>
                        <div className="rounded-lg w-30">
                            <button className={clicked ? "border-none rounded-lg text-xs text-white bg-green-500 outline-none" : "border-none rounded-lg text-xs outline-none"} onClick={() => setClicked(true)}>Incorrect</button>
                            <button className={!clicked ? "border-none rounded-lg text-xs text-white bg-green-500 outline-none" : "border-none rounded-lg text-xs outline-none"} onClick={() => setClicked(false)}>Correct</button>
                        </div>
                    </div>))
            }
        </div>
        <Link className="w-full mt-5 flex justify-center" to={'/targeted-instruction/formative-test/insert-grades/grading/test-result'}>
            <button className="bg-blue-900 text-bold text-lg border-none rounded-md text-white p-2 w-9/12">Save and Continue</button>
        </Link>
    </div>
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.targeted_instruction
}))(withRouter(Grading))

const getQuestionList = (subject: string, targeted_instruction: RootReducerState["targeted_instruction"]) => {
    return Object.values(targeted_instruction.tests)
        .reduce((agg, test) => {
            if (test.subject === subject) {
                return test.questions
            }
            return agg
        }, {})
}