import React from 'react';
import { RouteComponentProps } from 'react-router-dom'

interface P {
}

type PropsType = P & RouteComponentProps

const TrainingVideos: React.FC<PropsType> = () => {

    return <div className="flex flex-wrap content-between">
        <div className="text-blue-900 text-2xl flex justify-center w-full my-5">Training Materials</div>
        {
            [1, 2, 3, 4, 5, 6].map((row) => (
                <div key={row} className="container flex flex-row justify-start bg-gray-100 rounded-xl mx-3 h-28 mb-3">
                    <img className="h-20 p-4 rounded-xl" src="https://www.wivb.com/wp-content/uploads/sites/97/2020/04/youtubelogo_38150283_ver1.0.jpg?w=719" alt="img" />
                    <div className="flex flex-col content-between justify-center">
                        <div className="text-blue-900 text-lg">How to use TIP?</div>
                        <div className="text-blue-900 text-xs">We can add small details about the videos here ...</div>
                        <div className="text-blue-900 text-xs font-bold">7:50</div>
                    </div>
                </div>
            ))
        }
    </div>
}

export default TrainingVideos
