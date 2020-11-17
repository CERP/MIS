import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import { RouteComponentProps } from 'react-router-dom'
import { customStyles, singleStdColumns, conditionalRowStyles } from 'constants/targetedInstruction'
import { getSingleStdData, createReport, redirectToIlmx, getSubjectsFromTests } from 'utils/targetedInstruction'

interface P extends RouteComponentProps<RouteInfo> {
    classes: RootDBState["classes"]
    students: RootDBState["students"]
    targeted_instruction: RootDBState["targeted_instruction"]
}

interface RouteInfo {
    id: string
}

const DiagnosticGrades: React.FC<P> = ({ students, targeted_instruction, match }) => {

    const [selectedSubject, setSelectedSubject] = useState('')

    let stdId = match.params.id

    const Subjects: string[] = useMemo(() => getSubjectsFromTests(targeted_instruction), [])
    const stdReport: MISReport = useMemo(() => createReport(students[stdId] && students[stdId].diagnostic_result, targeted_instruction, selectedSubject), [stdId]);
    const singleStd = useMemo(() => getSingleStdData(stdId, stdReport), [stdId, stdReport]);

    return <div className="section form">
        <div className="table">
            <div className="row">
                <label className="no-print">Subject</label>
                <select className="no-print" onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">Select Subject</option>
                    {
                        Subjects.map((sub: any) => <option key={sub} value={sub}>{sub}</option>)
                    }
                </select>
            </div>
        </div>
        {selectedSubject && <div className="section">
            <DataTable
                columns={singleStdColumns}
                customStyles={customStyles}
                data={singleStd && singleStd}
                pagination={true}
                noHeader={true}
                highlightOnHover={true}
                responsive={true}
                conditionalRowStyles={conditionalRowStyles}
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