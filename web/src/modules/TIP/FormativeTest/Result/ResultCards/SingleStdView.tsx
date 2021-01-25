import React from 'react';

interface P {
    slo: string
    obtain: number
    total: number
}

const SingleStdView: React.FC<P> = ({ slo, obtain, total }) => {

    const percentage = Math.trunc((obtain / total) * 100)

    return <div className={`${percentage >= 60 ? "bg-green-primary text-white" :
        percentage >= 50 ? "bg-orange-primary text-white" : "bg-red-primary text-white"}
     flex flex-row justify-between items-center px-3 my-2 h-11 shadow-lg w-full`}>
        <div className="flex flex-row justify-between w-full">
            <div className="w-full flex flex-row justify-between px-3 items-center text-left">
                <div className="">{slo.replace("$", ",")}</div>
                <div className="flex flex-row justify-between w-3/12 text-xs">
                    <div>{`${obtain}/${total}`}</div>
                    <div>{`${percentage}%`}</div>
                </div>
            </div>
        </div>
    </div>
}

export default SingleStdView
