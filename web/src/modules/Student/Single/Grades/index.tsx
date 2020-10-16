//@ts-nocheck
import React, { useState, useEffect } from 'react';
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import getSubjectsFromClasses from 'utils/getSubjectsFromClasses'
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import { customStyles, singleStdColumns } from 'constants/targetedInstruction'
import { getSingleStdData, createReport } from 'utils/targetedInstruction'

interface P {
    students: RootDBState["students"]
    sections: AugmentedSection[]
    classes: RootDBState["classes"]
    targeted_instruction: RootDBState["targeted_instruction"]
}

const DiagnosticGrades: React.FC<P> = (props) => {

    const [testType, setTestType] = useState('')
    const [allSubjects, setAllSubjects] = useState<Subjects>({})
    const [className, setClassName] = useState('')
    const [tests, setTests] = useState([])
    const [showTable, setShowTable] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState('')
    const [singleStd, setSingleStd] = useState([])

    let stdId = props.match.params.id

    const getClassNameFromSections = (sections): string => {
        const section = sections.find(section => section.id === props.students[stdId].section_id)
        return section ? section.className : undefined
    }

    useEffect(() => {
        const sections = getSectionsFromClasses(props.classes)
            .sort((a, b) => (a.classYear || 0) - (b.classYear || 0))
        setClassName(getClassNameFromSections(sections))
        setAllSubjects(getSubjectsFromClasses(props.classes))
    }, [])

    const getSubject = (e: any) => {
        setSelectedSubject(e.target.value)
        if (testType) {
            setTests(getTestList(testType, e.target.value))
        }
    }

    const getTestType = (e: any) => {
        setTestType(e.target.value)
        setTests(getTestList(e.target.value, selectedSubject))
    }

    const getTest = (e: any) => {
        setShowTable(true)
        const stdReport = createReport(props.students, props.targeted_instruction, e.target.value)
        setSingleStd(getSingleStdData(stdId, stdReport))
    }

    const getTestList = (testType: string, selectedSubject: string) => {
        const testArr = []
        const misTest: Tests = props.targeted_instruction['tests']
        for (let [, obj] of Object.entries(misTest)) {
            if (obj.class === className && obj.type === testType && obj.subject === selectedSubject) {
                testArr.push(obj.name)
            }
        }
        return testArr
    }

    const redirectToIlmx = (e: any) => {
        window.location.href = e.link
    }

    return <div className="section form">
        <div className="table">
            <div className="row">
                <label className="no-print">Subject</label>
                <select className="no-print" onChange={(e) => getSubject(e)}>
                    <option value="">Select Subject</option>
                    {
                        (allSubjects[className] || []).map((sub: any) => <option key={sub} value={sub}>{sub}</option>)
                    }
                </select>
            </div>
            <div className="row">
                <label className="no-print">Test Type</label>
                <select className="no-print" onChange={getTestType}>
                    <option value="">Select Test Type</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Monthly">Monthly</option>
                </select>
            </div>
            <div className="row">
                <label className="no-print">Test</label>
                <select className="no-print" onChange={getTest}>
                    <option value="">Select Test</option>
                    {
                        tests && tests.map((test) => <option key={test} value={test}>{test}</option>)
                    }
                </select>
            </div>
        </div>
        {showTable && <div className="section">
            <DataTable
                columns={singleStdColumns}
                customStyles={customStyles}
                data={singleStd && singleStd}
                pagination={true}
                noHeader={true}
                highlightOnHover={true}
                responsive={true}
                onRowClicked={redirectToIlmx}
            />
        </div>}
    </div >

}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    classes: state.db.classes,
    targeted_instruction: state.db.targeted_instruction
}))(DiagnosticGrades)