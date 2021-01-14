import React from 'react';

interface P {
    slo: string
    percentage: string
    score: number
}

const SingleStdView: React.FC<P> = ({ slo, percentage, score }) => {

    return <div className="bg-blue-200 text-blue-900 rounded-md flex flex-row justify-between items-center px-3 my-2 h-11 shadow-lg w-full">
        <div className="flex flex-row justify-between w-full">
            <div className="w-full flex flex-row justify-between px-3 items-center text-left">
                <div className="font-bold">{slo}</div>
                <div className="flex flex-row justify-between w-2/12 text-xs">
                    <div>{score}</div>
                    <div>{percentage}</div>
                </div>
            </div>
        </div>
    </div>
}

export default SingleStdView
