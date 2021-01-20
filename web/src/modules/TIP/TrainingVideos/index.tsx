import React, { useState } from 'react';
import ActivityVideos from './ActivityVideos'
import TrainingManuals from './TrainingManuals'
interface P {
}

const TrainingVideos: React.FC<P> = () => {

    const [type, setType] = useState(false)

    return <div className="flex flex-wrap content-between">
        <div className="w-full flex flex-row justify-around my-5">
            <button
                className={`border-none text-blue-300 bg-transparent outline-none font-bold text-lg
                   ${!type && "text-blue-900 underline"}`}
                onClick={() => setType(false)}>Training Manuals
            </button>
            <button
                className={`border-none text-blue-300 bg-transparent outline-none font-bold text-lg 
                   ${type && "text-blue-900 underline"}`}
                onClick={() => setType(true)}>Activity Videos
            </button>
        </div>
        {
            type ? <ActivityVideos /> : <TrainingManuals />
        }
    </div>
}

export default TrainingVideos
