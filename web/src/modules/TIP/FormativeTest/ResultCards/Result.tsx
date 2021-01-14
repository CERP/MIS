import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom'
import Footer from '../../Footer'
import Headings from '../../Headings'
import ChildView from './ChildView'
import SkillView from './SkillView'
import SingleStdView from './SingleStdView'

interface P {
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = (props) => {
    const { subject } = props.match.params as Params
    const [sub, setSub] = useState(subject)
    const [type, setType] = useState('skill_view')

    return <div className="flex flex-wrap content-between">
        <Headings heading="Formative Test Result" sub_heading="" />
        {type === 'single_std_view' ? <div className="flex flex-row justify-center w-full" onClick={() => setType('child_view')}>
            <div className="bg-blue-900 h-5 my-3 w-3/4 rounded-3xl py-1 px-3">
                <img className="h-7 w-8 rounded-full pl-0 absolute left-7 top-11" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                <div className="text-white flex justify-center">Child View - Humna</div>
            </div>
        </div> :
            <div className="flex flex-row justify-around w-full my-3 mx-6">
                <button className={type === 'skill_view' ? "border-none rounded-3xl text-white bg-blue-900 py-1 px-6 outline-none" :
                    "rounded-3xl text-blue-900 broder border-solid border-blue-900 py-1 px-6 bg-white outline-none"}
                    onClick={() => setType('skill_view')}>Skill View</button>
                <button className={type === 'child_view' ? "border-none rounded-3xl text-white bg-blue-900 py-1 px-6 outline-none" :
                    "rounded-3xl text-blue-900 broder border-solid border-blue-900 py-1 px-6 bg-white outline-none"}
                    onClick={() => setType('child_view')}>Child View</button>
            </div>
        }
        <div className={`flex flex-row ${type === 'child_view' ? "justify-around" : "justify-between px-8"} h-7 items-center text-white text-xs bg-blue-900 w-full mb-21`}>
            {type === 'skill_view' && <>
                <div>skill</div>
                <div>Class Average</div>
            </>}
            {type === 'child_view' && <>
                <div>Name</div>
                <div className="flex flex-row justify-between w-3/12">
                    <div>Score</div>
                    <div>%</div>
                </div>
            </>}
            {type === 'single_std_view' && <>
                <div>skill</div>
                <div className="flex flex-row justify-between w-3/12">
                    <div>Score</div>
                    <div>%</div>
                </div>
            </>}
        </div>
        {type === 'skill_view' && <>
            <SkillView slo="2 digits Multiplication" percentage={70} />
            <SkillView slo="2 digits Addition" percentage={50} />
            <SkillView slo="2 digits Division" percentage={30} />
        </>}
        {type === 'child_view' && <>
            <ChildView name="Humna" score={4} percentage={70} setType={setType} />
            <ChildView name="Rehan" score={4} percentage={50} setType={setType} />
            <ChildView name="Ali" score={4} percentage={30} setType={setType} />
        </>}
        {type === 'single_std_view' && <>
            <SingleStdView slo="2 digits Multiplication" score={4} percentage={70} />
            <SingleStdView slo="2 digits Addition" score={4} percentage={50} />
            <SingleStdView slo="2 digits Division" score={4} percentage={30} />
        </>}
        <Footer setSub={setSub} />
    </div>
}

export default Result
