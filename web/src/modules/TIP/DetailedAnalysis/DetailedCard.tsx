import React from 'react';

interface P {
    roll_no: string
    class_name: string
    name: string
}

const DetailedCard: React.FC<P> = ({ roll_no, class_name, name }) => {

    return <div className="h-10 items-center text-xs w-full mt-4 flex flex-row justify-around shadow-lg">
        <div className="w-6/12 flex flex-row justify-between px-3 items-center m-2">
            <div className="font-bold text-center">{name}</div>
        </div>
        <div className="flex flex-row justify-between w-6/12 text-xs m-4">
            <div className="font-bold">{roll_no}</div>
            <div className="font-bold">{class_name}</div>
        </div>
    </div>
}

export default DetailedCard
