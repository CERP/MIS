import React, { useState, useEffect } from 'react';
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { connect } from 'react-redux'
// import Switch from "react-switch";
import './style.css'

interface P {
    students: RootDBState["students"]
    targeted_instruction: RootDBState["targeted_instruction"]
    sections: AugmentedSection[]
    classes: RootDBState["classes"]
}

const DiagnosticGrades: React.FC<P> = (props: any) => {
    const [id,] = useState(props.match.params.id)
    const [selectedTest, setSelectedTest] = useState('')
    const [selectedTestType, setSelectedTestType] = useState('')
    const [tests, setTests] = useState([])
    const [stdObj, setStdObj] = useState(props.students[id])
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        const sections = getSectionsFromClasses(props.classes)
            .sort((a, b) => (a.classYear || 0) - (b.classYear || 0))

        const getClassNameFromSections = (): string => {
            const section = sections.find(section => section.id === props.students[id].section_id)
            return section ? section.className : undefined
        }

        const className = getClassNameFromSections()
        const testArr = []
        for (let [id, obj] of Object.entries(props.targeted_instruction.tests)) {
            //@ts-ignore
            if (obj.class === className && className) {
                //@ts-ignore
                testArr.push(obj.name)
            }
        }
        setTests(testArr)
    }, [])

    const getSelectedTestType = (e: any) => {
        setSelectedTestType(e.target.value)
        getQuestionList(selectedTest)
    }

    const getSelectedTest = (e: any) => {
        setSelectedTest(e.target.value)
        getQuestionList(e.target.value)
    }

    const getQuestionList = (selectedTest: any) => {
        let questionArr = []
        //@ts-ignore
        const res = stdObj.diagnostic_result[selectedTest]
        if (res && selectedTestType === 'Diagnostic') {
            for (let obj of Object.entries(res && res)) {
                questionArr.push({
                    "key": obj[0],
                    //@ts-ignore
                    "value": obj[1].isCorrect
                })

            }
            setQuestions(questionArr)
        }
    }

    const handleChange = () => {

    }

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1, 8) + ' ' + str.slice(8);
    }

    return <div className="section form">
        <div className="table">
            <div className="row">
                <label>Test Type</label>
                <select onClick={getSelectedTestType}>
                    <option value="">Select Test Type</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Monthly">Monthly</option>
                </select>
            </div>
            <div className="row">
                <label>Test</label>
                <select onClick={getSelectedTest}>
                    <option value="">Select Test</option>
                    {
                        tests && tests.map((c) => <option key={c} value={c}>{c}</option>)
                    }
                </select>
            </div>
        </div>
        <div className="questions-container">
            {questions && questions.map((question) => {
                return <div key={question.key} className="row question-row">
                    <div style={{ width: "95%" }}>{capitalize(question.key)}</div>
                    {/* <Switch
                        onChange={handleChange}
                        checked={question.value}
                        id="normal-switch"
                    /> */}
                </div>
            })}
        </div>
    </div >

}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    classes: state.db.classes,
    targeted_instruction: state.db.targeted_instruction
}))(DiagnosticGrades)