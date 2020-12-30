import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom'

interface P {
    setSectionId: (sectionId: string) => any
    sortedSections: AugmentedSection[]
}

type PropsType = P & RouteComponentProps

// const classes = [{ class: 1, color: "bg-blue-300" }, { class: 2, color: "bg-yellow-400" }, { class: 3, color: "bg-gray-400" }, { class: 4, color: "bg-blue-900" }, { class: 5, color: "bg-pink-500" }]
const Classes: React.FC<PropsType> = ({ setSectionId, sortedSections }) => {

    return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
        {
            sortedSections.map((classObj) => {
                return <div key={classObj.id} className="flex-wrap container w-2/5 sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg" id={classObj.id} onClick={(e: any) => setSectionId(e.target.id)}>
                    <div className={`text-white text-bold flex items-center justify-center m-5 rounded-full h-10 w-10 bg-blue-900`}>{(classObj.namespaced_name).substring(6)}</div>
                    <div className="text-blue-900">Class</div>
                </div>
            })
        }
    </div >
}

export default connect((state: RootReducerState) => ({
    teacher_name: state.auth.name,
    school_name: state.auth.school_id,
}))(Classes)