import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getStudentsBySectionId } from 'utils/TIP'
import Footer from '../Footer'
import Groups from './Groups'
import Card from '../Card'

interface P {
    students: RootDBState["students"]
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = (props) => {

    const { section_id } = props.match.params as Params
    const students = useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id])

    return <div className="flex flex-wrap content-between">
        <Card class_name="" />
        <Groups color="bg-orange-primary" level="1" students={students} />
        <Groups color="bg-blue-primary" level="2" students={students} />
        <Groups color="bg-red-primary" level="3" students={students} />
        <Groups color="bg-green-primary" level="4" students={students} />
        <Groups color="bg-blue-900" level="5" students={students} />
        <Footer />
    </div>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students
}))(withRouter(Result))
