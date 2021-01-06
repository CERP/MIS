import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom'
import { getStudentsBySectionId } from 'utils/targetedInstruction'

interface P {
    students: RootDBState["students"]
}

type PropsType = P & RouteComponentProps

const RemedialGroup: React.FC<PropsType> = (props) => {

    const { class_name, subject, section_id } = props.match.params as Params
    const students = useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id])

    return <div className="flex flex-wrap content-between">
        <div className="container sm:px-8 bg-yellow-400 rounded m-3 h-24 mb-4">
            <div className="flex flex-col justify-center items-center content-center h-full">
                <div className="text-white text-3xl">Remedial Group</div>
                <div className="text-white text-lg">{class_name} | {subject}</div>
            </div>
        </div>
        {
            <div className="m-3 flex flex-wrap w-full justify-between">
                {
                    Object.values(students)
                        .sort((a, b) => a.Name.localeCompare(b.Name))
                        .map((std) => (<div key={name} className="no-underline h-28 flex flex-col flex items-center justify-center" >
                            <img className="rounded-full h-14 w-14 p-2" src="https://www.atmeplay.com/images/users/avtar/avtar_nouser.png" alt="img" />
                            <div className="text-base flex items-center justify-center w-24 md:w-28 truncate">{std.Name}</div>
                        </div>))
                }
            </div>
        }
        <div className="w-full mt-6">
            <Link
                className="w-full no-underline flex justify-center items-center"
                to={`${(props.location.pathname).substring(0, 39)}/${section_id}/${class_name}/${subject}/remedial-group/list-view`}>
                <button className="bg-blue-900 h-11 font-bold text-lg border-none rounded text-white p-2 w-6/12">List View</button>
            </Link>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students
}))(withRouter(RemedialGroup))
