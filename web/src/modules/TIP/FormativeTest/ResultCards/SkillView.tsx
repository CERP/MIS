import React from 'react';
import { ArrowBack } from 'assets/icons'

interface P {
    slo: string
    percentage: string
}

const SkillView: React.FC<P> = ({ slo, percentage }) => {

    return <div className="bg-blue-200 text-blue-900 rounded-md flex flex-row justify-between items-center px-3 my-2 h-11 shadow-lg w-full">
        <div className="flex flex-row justify-between w-full">
            <div className="w-full flex flex-row justify-between px-3 items-center text-left">
                <div className="font-bold">{slo}</div>
                <div>{percentage}</div>
            </div>
            <div className="bg-white rounded-full h-7 w-7 flex justify-center items-center">
                <img className="h-3" src={ArrowBack} />
            </div>
        </div>
    </div>
}

export default SkillView