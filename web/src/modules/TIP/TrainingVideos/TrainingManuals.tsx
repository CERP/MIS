import React from 'react';

interface P {
}const TrainingManuals: React.FC<P> = () => {

    return <>
        {
            [1, 2, 3, 4, 5, 6].map((row) => (
                <div key={row} className="container flex flex-row justify-start bg-gray-100 rounded-xl mx-3 h-28 mb-3">
                    <img className="h-20 p-4 rounded-xl" src="https://www.wivb.com/wp-content/uploads/sites/97/2020/04/youtubelogo_38150283_ver1.0.jpg?w=719" alt="img" />
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
