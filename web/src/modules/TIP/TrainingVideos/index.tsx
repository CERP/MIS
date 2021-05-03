import React from 'react'
import Headings from '../Headings'
// import ActivityVideos from './ActivityVideos'
// import TrainingManuals from './TrainingManuals'
interface P { }

const TrainingVideos: React.FC<P> = () => {
    return (
        <div className="flex flex-wrap content-between bg-white mt-20">
            <div className="w-full flex flex-col justify-around my-5 px-3">
                <Headings heading="This page is not available right now." />
                {/* <button
                className="border-none text-blue-900 bg-transparent outline-none font-bold text-lg">Training Manuals
            </button>
            <TrainingManuals />
            <button
                className="border-none text-blue-900 bg-transparent outline-none font-bold text-lg">Activity Videos
            </button>
            <ActivityVideos /> */}
            </div>
        </div>
    )
}

export default TrainingVideos
