import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import Footer from '../../Footer'
import Headings from '../../Headings'
import SingleStdResultCard from './SingleStdResultCard'
import ClassResultCard from './ClassResultCard'

interface P {
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <Headings heading="Formative Test Result" sub_heading="" />
        <div className="flex flex-row justify-around w-full my-3 mx-6">
            <button className="border-none rounded-3xl text-white bg-blue-900 py-1 px-6">Skill View</button>
            <button className="rounded-3xl text-blue-900 broder border-solid border-blue-900 py-1 px-6 bg-white">Child View</button>
        </div>
        <div className="flex flex-row justify-around h-7 items-center text-white px-4 text-xs bg-blue-900 w-full mb-2">
            <div>skill</div>
            <div>Class Average</div>
        </div>
        <SingleStdResultCard />
        <ClassResultCard />
        <Footer />
    </div>
}

export default Result
