import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getStudentsBySectionId, calculateResult } from 'utils/TIP'
import Footer from '../Footer'
import Groups from './Groups'
import Card from '../Card'

interface P {
    students: RootDBState["students"]
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = (props) => {

    const { section_id, subject } = props.match.params as Params
    const [sub, setSub] = useState(subject)
    const students = useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id])
    const result: DiagnosticRes = useMemo(() => calculateResult(students, sub), [sub])

    return <div className="flex flex-wrap content-between">
        <Card class_name="" />
        <div className="pb-16 w-full">
            {Object.entries(result)
                .map(([key, value]) => {
                    return <Groups key={key} color={`bg-${(value.group).toLowerCase()}-primary`} level={key} students={value.students} />
                })
            }
        </div>
        <Footer type={sub} setSub={setSub} />
    </div>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students
}))(withRouter(Result))
