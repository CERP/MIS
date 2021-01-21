import React from 'react';

interface P {
    slo: string
    obtain: number
    total: number
}

const SingleStdView: React.FC<P> = ({ slo, obtain, total }) => {
    //@ts-ignore
    const percentage = parseInt((obtain / total) * 100)
    return <div className={`${percentage < 33 ? "bg-red-primary text-white" : "bg-blue-200 text-blue-900"} flex flex-row justify-between items-center px-3 my-2 h-11 shadow-lg w-full`}>
        <div className="flex flex-row justify-between w-full">
            <div className="w-full flex flex-row justify-between px-3 items-center text-left">
                <div className="">{slo.replace("$", ",")}</div>
                <div className="flex flex-row justify-between w-4/12 text-xs">
                    <div>{`${obtain}/${total}`}</div>
                    <div>{`${percentage}%`}</div>
                </div>
            </div>
        </div>
    </div>
}

export default SingleStdView
