import React from 'react';
import { ArrowBack } from 'assets/icons'

interface P {
}

const ClassResultCard: React.FC<P> = (props) => {

    return <div className="bg-blue-200 text-blue-900 rounded-md flex flex-row justify-between items-center px-3 my-2 h-11 shadow-lg w-full">
        <div className="flex flex-row justify-between items-center w-full">
            <div className="w-full flex flex-row justify-around items-center">
                <div>2 digits Addition</div>
                <div>70%</div>
            </div>
            <div className="bg-white rounded-full h-7 w-7 flex justify-center items-center">
                <img className="h-3" src={ArrowBack} />
            </div>
        </div>
    </div>
}

export default ClassResultCard
