import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom'
import { Tick } from 'assets/icons'
import { getStudentsBySectionId } from 'utils/TIP'
interface P {
    students: RootDBState["students"]
}


type PropsType = P & RouteComponentProps

const InsertGrades: React.FC<PropsType> = (props) => {

    const { class_name, subject, section_id, test_id } = props.match.params as Params
    const students = useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id])

    return <div className="flex flex-wrap content-between">
        <div className="container sm:px-8 bg-orange-primary rounded m-3 h-24 mb-4">
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
                        .map((std) => (<Link key={name} className="relative no-underline h-24 flex flex-col flex items-center justify-center"
                            to={`${(props.location.pathname).substring(0, 36)}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades/${std.id}/grading`}>
                            <img className="border border-solid border-green-primary rounded-full h-14 w-14" src="https://www.atmeplay.com/images/users/avtar/avtar_nouser.png" alt="img" />
                            {std.targeted_instruction.diagnostic_result[test_id] && std.targeted_instruction.diagnostic_result[test_id].checked && <img src={Tick} className="absolute h-5 right-3" />}
                            <div className="text-xs flex items-center justify-center w-24 md:w-28 truncate">{std.Name}</div>
                        </Link>))
                }
            </div>
        }
        <div className="w-full my-6 fixed bottom-0">
            <Link
                className="w-full no-underline flex justify-center items-center"
                to={`${(props.location.pathname).substring(0, 36)}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades/test-result`}>
                <button className="bg-blue-900 h-11 font-bold text-lg border-none rounded text-white p-2 w-6/12">Finish</button>
            </Link>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students
}))(withRouter(InsertGrades))
