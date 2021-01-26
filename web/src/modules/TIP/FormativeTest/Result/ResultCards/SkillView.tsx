import React from 'react';
import { ArrowBack } from 'assets/icons'

interface P {
    slo: string
    obtain: number
    total: number
}

const SkillView: React.FC<P> = ({ slo, obtain, total }) => {

    const percentage = Math.trunc((obtain / total) * 100)

    return <div className={`${percentage >= 60 ? "bg-green-250" :
        percentage >= 50 ? "bg-yellow-250" : "bg-red-250"} flex flex-row justify-between items-center px-3 my-1 h-14 shadow-lg w-full`}>
        < div className="flex flex-row justify-between w-full" >
            <div className="w-full flex flex-row justify-between px-3 items-center text-left">
                <div className="font-bold">{slo}</div>
                <div className="text-xs">{`${percentage}%`}</div>
            </div>
            <div className="bg-white rounded-full h-7 w-9 flex justify-center items-center">
                <img className="h-3" src={ArrowBack} />
            </div>
        </div >
    </div >
}

export default SkillView
