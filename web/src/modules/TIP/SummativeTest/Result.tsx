//@ts-nocheck
import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getStudentsByGroup, getResult, getClassResult } from 'utils/TIP'
import Footer from '../../Footer'
import Headings from '../../Headings'

interface P {
    students: RootDBState["students"]
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = (props) => {

    const { class_name, subject, test_id } = props.match.params as Params
    const [sub, setSub] = useState(subject)
    const [type, setType] = useState('skill_view')

    const group = class_name === "1" ? "blue" : class_name === "2" ? "yellow" : class_name === "3" ? "green" : "orange"
    const group_students = useMemo(() => getStudentsByGroup(props.students, group, subject), [subject])
    const result = useMemo(() => getResult(group_students, test_id), [subject])
    const class_result = useMemo(() => getClassResult(result), [])

    return <div className="flex flex-wrap content-between">
        <Headings heading="Formative Test Result" sub_heading="" />

        <div className="flex flex-row justify-around w-full my-3 mx-6">
            <button className={type === 'skill_view' ? "border-none rounded-3xl text-white bg-blue-900 py-1 px-6 outline-none" :
                "rounded-3xl text-blue-900 broder border-solid border-blue-900 py-1 px-6 bg-white outline-none"}
                onClick={() => setType('skill_view')}>Skill View</button>
            <button className={type === 'child_view' ? "border-none rounded-3xl text-white bg-blue-900 py-1 px-6 outline-none" :
                "rounded-3xl text-blue-900 broder border-solid border-blue-900 py-1 px-6 bg-white outline-none"}
                onClick={() => setType('child_view')}>Child View</button>
        </div>

        <div className={`flex flex-row ${type === 'child_view' ? "justify-around" : "justify-between px-8"} h-7 items-center text-white text-xs bg-blue-900 w-full mb-21`}>
            {type === 'skill_view' && <>
                <div>skill</div>
                <div>Class Average</div>
            </>}
        </div>
        {type === 'skill_view' && <>
            <SkillView slo="2 digits Multiplication" percentage={70} />
            <SkillView slo="2 digits Addition" percentage={50} />
            <SkillView slo="2 digits Division" percentage={30} />
        </>}
        <Footer type={sub} setSub={setSub} />
    </div >
}

export default connect((state: RootReducerState) => ({
    students: state.db.students
}))(withRouter(Result))