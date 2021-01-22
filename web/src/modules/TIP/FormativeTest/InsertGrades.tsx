import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom'
import { Tick } from 'assets/icons'
import { getStudentsBySectionId, getStudentsByGroup } from 'utils/TIP'
interface P {
    students: RootDBState["students"]
}

type PropsType = P & RouteComponentProps

const InsertGrades: React.FC<PropsType> = (props) => {

    const url = props.match.url.split('/')
    const { class_name, subject, section_id, test_id } = props.match.params as Params

    const group = class_name === "1" ? "blue" : class_name === "2" ? "yellow" : class_name === "3" ? "green" : "orange"
    const students = section_id && useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id])
    const group_students = useMemo(() => getStudentsByGroup(props.students, group, subject), [subject])

    return <div className="flex flex-wrap content-between">
        <div className={`container sm:px-8 rounded m-3 h-24 mb-4 
        ${class_name === "1" ? "bg-blue-primary" :
                class_name === "2" ? "bg-orange-primary" :
                    class_name === "3" ? "bg-green-primary" : "bg-yellow-600"}`}>
            <div className="flex flex-col justify-center items-center content-center h-full">
                <div className="text-white text-3xl font-medium">{url[2] === 'formative-test' || url[2] === 'summative-test' ?
                    class_name === "1" ? "Blue Group" :
                        class_name === "2" ? "Yellow Group" :
                            class_name === "3" ? "Green Group" :
                                "Orange Group" : class_name}</div>
                <div className="text-white text-lg font-thin">{subject}</div>
            </div>
        </div>
        {
            <div className="m-3 flex flex-wrap w-full justify-start">
                {
                    Object.values(url[2] === "diagnostic-test" ? students : group_students || {})
                        .sort((a, b) => a.Name.localeCompare(b.Name))
                        .map((std) => {
                            return <Link key={std.id} className="relative no-underline h-24 flex flex-col flex items-center justify-center"
                                to={url[2] === "diagnostic-test" ? `/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades/${std.id}/grading` :
                                    `/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades/${std.id}/grading`}>
                                <img className="border border-solid border-green-primary rounded-full h-14 w-14" src="https://www.atmeplay.com/images/users/avtar/avtar_nouser.png" alt="img" />
                                {std.targeted_instruction[url[2].replace("-test", "_result")][test_id] &&
                                    std.targeted_instruction[url[2].replace("-test", "_result")][test_id].checked
                                    && <img src={Tick} className="absolute h-5 right-3" />}
                                <div className="text-xs flex items-center justify-center w-24 md:w-28 truncate">{std.Name}</div>
                            </Link>
                        })
                }
            </div>
        }
        <div className="w-full my-2">
            <Link
                className="w-full no-underline flex justify-center items-center"
                to={url[2] === "diagnostic-test" ? `/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades/test-result` :
                    `/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades/test-result`}>
                <button className="bg-blue-900 h-11 font-bold text-lg border-none rounded text-white p-2 w-6/12">Finish</button>
            </Link>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students
}))(withRouter(InsertGrades))
