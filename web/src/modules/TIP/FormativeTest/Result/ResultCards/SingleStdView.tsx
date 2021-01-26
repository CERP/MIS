import React from 'react';

interface P {
    slo: string
    obtain: number
    total: number
}

const SingleStdView: React.FC<P> = ({ slo, obtain, total }) => {

    const percentage = Math.trunc((obtain / total) * 100)

    return <div className={`${percentage >= 60 ? "bg-green-250" :
        percentage >= 50 ? "bg-yellow-250" : "bg-red-250"}
     flex flex-row justify-between items-center px-3 my-1 h-14 shadow-lg w-full`}>
        <div className="flex flex-row justify-between w-full">
            <div className="w-full flex flex-row justify-between px-3 items-center text-left">
                <div className="font-bold">{slo.replace("$", ",")}</div>
                <div className="flex flex-row justify-between w-3/12 text-xs">
                    <div>{`${obtain}/${total}`}</div>
                    <div>{`${percentage}%`}</div>
                </div>
            </div>
        </div>
    </div>
}

export default SingleStdView
