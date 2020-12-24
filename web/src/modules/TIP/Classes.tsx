import React from 'react';
import { RouteComponentProps } from 'react-router-dom'

interface P {
    setClassName: (className: string) => any
}

type PropsType = P & RouteComponentProps

const classes = [{ class: 1, color: "bg-blue-300" }, { class: 2, color: "bg-yellow-400" }, { class: 3, color: "bg-gray-400" }, { class: 4, color: "bg-blue-900" }, { class: 5, color: "bg-pink-500" }]
const Classes: React.FC<PropsType> = ({ setClassName }) => {

    const test = (e: any) => {
        setClassName(e.target.id)
    }

    return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
        {classes.map((classObj) => (
            <div key={classObj.class} className="flex-wrap container w-2/5 sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg" id={`${classObj.class}`} onClick={test}>
                <div className={`text-white text-bold flex items-center justify-center m-5 rounded-full h-10 w-10 ${classObj.color}`}>{classObj.class}</div>
                <div className="text-blue-900">Class</div>
            </div>
        ))}
    </div >
}

export default Classes
