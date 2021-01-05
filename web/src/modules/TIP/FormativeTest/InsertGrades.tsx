import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom'
import { getStudentsBySectionId } from 'utils/targetedInstruction'
interface P {
    students: RootDBState["students"]
}


type PropsType = P & RouteComponentProps

const InsertGrades: React.FC<PropsType> = (props) => {

    const { class_name, subject, section_id } = props.match.params as Params
    const test_id = `${subject.toLowerCase()}-${class_name.substring(6)}`
    const students = useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id])

    return <div className="flex flex-wrap content-between">
        <div className="container sm:px-8 bg-orange-primary rounded m-3 h-24 mb-6">
            <div className="flex flex-col justify-center items-center content-center h-full">
                <div className="text-white text-3xl font-medium">{class_name}</div>
                <div className="text-white text-lg font-thin">{subject}</div>
            </div>
        </div>
        {
            <div className="m-3 flex flex-wrap w-full h-20 justify-between">
                {
                    Object.values(students)
                        .sort((a, b) => a.Name.localeCompare(b.Name))
                        .map((std) => (<Link key={name} className="no-underline h-28 flex flex-col flex items-center justify-center" to={`${(props.location.pathname).substring(0, 36)}/${section_id}/${class_name}/${subject}/insert-grades/${std.id}/grading`}>
                            <img className={std.diagnostic_result[test_id].checked ? "rounded-full h-16 p-1 border-2 border-solid border-blue-300" : "rounded-full h-14 w-14 p-2"} src="https://www.atmeplay.com/images/users/avtar/avtar_nouser.png" alt="img" />
                            <div className="text-base flex items-center justify-center w-24 md:w-28 truncate">{std.Name}</div>
                        </Link>))
                }
            </div>
        }
    </div>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students
}))(withRouter(InsertGrades))
