import React from 'react';
import { TrainingManual } from 'assets/icons'

interface P {
}

const TrainingManuals: React.FC<P> = () => {

    return <>
        {
            [1].map((row) => (
                <div key={row} className="container flex flex-row justify-start bg-gray-100 rounded-xl h-28 my-3">
                    <img className="h-20 p-4 rounded-xl" src={TrainingManual} alt="img" />
                    <div className="flex flex-col content-between justify-center">
                        <div className="text-blue-900 text-lg">How to use TIP?</div>
                        <div className="text-blue-900 text-xs">We can add small details about the videos here ...</div>
                        <div className="text-blue-900 text-xs font-bold">Read Time : 7 min</div>
                    </div>
                </div>
            ))
        }
    </>
}

export default TrainingManuals
