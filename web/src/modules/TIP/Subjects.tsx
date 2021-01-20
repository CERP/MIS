import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import { getSubjectsFromTests } from 'utils/TIP'
import { English, Urdu, Maths } from 'assets/icons'

interface P {
    class_name: string
    section_id: string
    targeted_instruction: RootReducerState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const Subjects: React.FC<PropsType> = ({ location, targeted_instruction, class_name, section_id }) => {

    const pathname = location.pathname
    const previousComponent = pathname.substring(22)
    const subjects: string[] = useMemo(() => getSubjectsFromTests(targeted_instruction), [])

    return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
        {subjects.map((sub) => (
            <Link key={sub} className="container w-full sm:px-8 bg-white rounded-lg m-3 h-36 flex items-center justify-start flex-col shadow-lg no-underline"
                to={previousComponent === 'diagnostic-result' ?
                    `${pathname}/${section_id}/${class_name}/${sub}/result` :
                    previousComponent === "lesson-plans" ?
                        `${pathname}/${class_name}/${sub}/list` :
                        `${pathname}/${section_id}/${class_name}/${sub}/pdf`}>
                <img className="flex items-center justify-center h-20 p-2" src={sub === 'English' ? English : sub === 'Urdu' ? Urdu : Maths} />
                <div className="text-blue-900 font-thin text-3xl">{sub}</div>
            </Link>
        ))}
    </div>
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.targeted_instruction
}))(withRouter(Subjects))