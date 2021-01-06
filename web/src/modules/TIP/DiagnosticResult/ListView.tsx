import React from 'react';
import Card from '../Card'

interface P {
}

const ListView: React.FC<P> = () => {

    return <div className="flex flex-wrap content-between">
        <Card class_name='' />
        <div className="bg-blue-900 text-white w-full flex flex-row justify-between px-2 h-6 items-center text-xs">
            <div className="w-3/5 flex justify-center font-bold">Name</div>
            <div className="font-bold">Avg</div>
            <div className="font-bold">Correct</div>
            <div className="font-bold">Wrong</div>
        </div>
        {
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
                <div key={row} className="bg-gray-100 w-full flex flex-row justify-between items-center px-2 h-14 mb-1">
                    <div className="w-3/5 flex flex-row justify-start content-center items-center">
                        <img className="h-8 rounded-full px-3" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                        <div className="text-base">Humna</div>
                    </div>
                    {
                        [4, 3, 5].map((num) => {
                            return <div key={num} className="bg-white rounded-full h-8 w-8 flex justify-center items-center text-base shadow-lg">{num}</div>
                        })
                    }
                </div>
            ))
        }
    </div>
}

export default ListView
