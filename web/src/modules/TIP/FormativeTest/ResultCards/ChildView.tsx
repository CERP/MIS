import React, { useState } from 'react';
import { ArrowBack } from 'assets/icons'
import SingleStdView from './SingleStdView'

interface P {
    name: string
    obtain: number
    total: number
    slo_obj: {}
}

const ChildView: React.FC<P> = ({ name, obtain, total, slo_obj }) => {
    const [type, setType] = useState(false)
    //@ts-ignore
    const percentage = parseInt((obtain / total) * 100)
    return <>{!type && <div className={`${percentage >= 60 ? "bg-green-primary text-white" :
        percentage >= 50 ? "bg-orange-primary text-white" : "bg-red-primary text-white"} 
    flex flex-row justify-between items-center px-3 my-2 h-11 shadow-lg w-full`} onClick={() => setType(true)}>
        <div className="flex flex-row justify-between items-center w-full">
            <div className="w-3/5 flex flex-row justify-start content-center items-center">
                <img className="h-6 rounded-full p-3" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                <div>{name}</div>
            </div>
            <div className="flex flex-row justify-between w-3/12 text-xs">
                <div>{`${obtain}/${total}`}</div>
                <div>{`${percentage}%`}</div>
            </div>
            <div className="bg-white rounded-full h-7 w-7 flex justify-center items-center">
                <img className="h-3" src={ArrowBack} />
            </div>
        </div>
    </div>}
        <>{type && Object.entries(slo_obj || {}).map(([slo, obj]) => {
            //@ts-ignore
            return <SingleStdView key={slo} slo={slo} obtain={obj.obtain} total={obj.total} />
        })
        }</>
    </>
}

export default ChildView
