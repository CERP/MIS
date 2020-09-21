import React, { useState, useEffect } from 'react';
import { data, targeted_instruction } from '../../../TargetedInstruction/dummyData';
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { connect } from 'react-redux'
import Switch from "react-switch";
import './style.css'

interface P {
    students: RootDBState["students"]
    sections: AugmentedSection[]
    classes: RootDBState["classes"]
}

const StudentGrades: React.SFC<P> = (props: any) => {
    const [id,] = useState(props.match.params.id)
    const [selectedTest, setSelectedTest] = useState('')
    const [selectedTestType, setSelectedTestType] = useState('')
    const [tests, setTests] = useState([])
    const [stdObj, setStdObj] = useState(props.students[id])
    const [questions, setQuestions] = useState([])
    console.log('stdObj', stdObj)
    useEffect(() => {

        const sections = getSectionsFromClasses(props.classes)
            .sort((a, b) => (a.classYear || 0) - (b.classYear || 0))

        const getClassNameFromSections = (): string => {
            const section = sections.find(section => section.id === props.students[id].section_id)
            return section ? section.className : undefined
        }

        const className = getClassNameFromSections()
        const testArr = []
        for (let [id, obj] of Object.entries(targeted_instruction['tests'])) {
            if (obj.class === className && className) {
                testArr.push(obj.name)
            }
        }
        setTests(testArr)
    }, [])

    const getSelectedTestType = (e: any) => {
        setSelectedTestType(e.target.value)
    }
    console.log("std obj", props.students)

    const getSelectedTest = (e: any) => {
        let questionArr = []
        //@ts-ignore
        const res = data.diagnostic_result[e.target.value]
        if (res) {
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
        debugger
        return str.charAt(0).toUpperCase() + str.slice(1, 8) + ' ' + str.slice(8);
    }

    return <div className="section section-container">
        <div className="row question-row">
            <select style={{ width: "49%" }} onClick={getSelectedTestType}>
                <option value="">Select Test Type</option>
                <option value="Diagnostic">Diagnostic</option>
                <option value="Monthly">Monthly</option>
            </select>
            <select style={{ width: "49%" }} onClick={getSelectedTest}>
                <option value="">Select Test</option>
                {
                    tests && tests.map((c) => <option key={c} value={c}>{c}</option>)
                }
            </select>
        </div>
        <div className="questions-container">
            {questions && questions.map((question) => {
                return <div key={question.key} className="row question-row">
                    <div style={{ width: "95%", textDecoration: "capitalize" }}>{capitalize(question.key)}</div>
                    <Switch
                        onChange={handleChange}
                        checked={question.value}
                        id="normal-switch"
                    />
                </div>
            })}
            {questions.length > 0 ? <button className="questionSaveBtn">Save</button> : null}
        </div>
    </div>

}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    classes: state.db.classes,
}))(StudentGrades)