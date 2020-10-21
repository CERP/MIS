import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import { RouteComponentProps } from 'react-router-dom'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import getSubjectsFromClasses from 'utils/getSubjectsFromClasses'
import { customStyles, singleStdColumns } from 'constants/targetedInstruction'
import { getSingleStdData, createReport, getTestList, redirectToIlmx } from 'utils/targetedInstruction'

interface P extends RouteComponentProps<RouteInfo> {
    classes: RootDBState["classes"]
    students: RootDBState["students"]
    targeted_instruction: RootDBState["targeted_instruction"]
}

interface RouteInfo {
    id: string
}

const DiagnosticGrades: React.FC<P> = ({ students, classes, targeted_instruction, match }) => {

    const [testType, setTestType] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [testId, setTestId] = useState('')

    let stdId = match.params.id

    const getClassNameFromSections = (sections: AugmentedSection[]): string => {
        const section = sections.find(section => section.id === students[stdId].section_id)
        return section ? section.className : undefined
    }

    const sections = getSectionsFromClasses(classes)
        .sort((a, b) => (a.classYear || 0) - (b.classYear || 0))
    const className = useMemo(() => getClassNameFromSections(sections), [sections]);
    const allSubjects: Subjects = useMemo(() => getSubjectsFromClasses(classes), [classes])
    const stdReport: Report = useMemo(() => createReport(students, targeted_instruction, testId), [testId]);
    const singleStd = useMemo(() => getSingleStdData(stdId, stdReport), [stdId, stdReport]);
    const tests = useMemo(() => getTestList(testType, selectedSubject, targeted_instruction, className), [testType, selectedSubject])

    return <div className="section form">
        <div className="table">
            <div className="row">
                <label className="no-print">Subject</label>
                <select className="no-print" onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">Select Subject</option>
                    {
                        (allSubjects[className] || []).map((sub: any) => <option key={sub} value={sub}>{sub}</option>)
                    }
                </select>
            </div>
            <div className="row no-print">
                <label>Test Type</label>
                <select onChange={(e) => setTestType(e.target.value)}>
                    <option value="">Select Test Type</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Monthly">Monthly</option>
                </select>
            </div>
            <div className="row no-print">
                <label>Test</label>
                <select onChange={(e) => { setTestId(e.target.value) }}>
                    <option value="">Select Test</option>
                    {
                        tests && tests.map((test) => <option key={test} value={test}>{test}</option>)
                    }
                </select>
            </div>
        </div>
        {testId && <div className="section">
            <DataTable
                columns={singleStdColumns}
                customStyles={customStyles}
                data={singleStd && singleStd}
                pagination={true}
                noHeader={true}
                highlightOnHover={true}
                responsive={true}
                onRowClicked={(e) => redirectToIlmx(e.id)}
            />
        </div>}
    </div >
}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    classes: state.db.classes,
    targeted_instruction: state.db.targeted_instruction
}))(DiagnosticGrades)