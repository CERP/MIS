import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import Card from '../Card'

interface P {
}

type PropsType = P & RouteComponentProps

const ListView: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <Card {...props} className='' />
        <div className="bg-blue-900 text-white w-full flex flex-row justify-between px-2 text-xs">
            <div className="w-3/5 flex justify-center">Name</div>
            <div>Avg</div>
            <div>Correct</div>
            <div>Wrong</div>
        </div>
        {
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
                <div key={row} className="bg-gray-100 w-full flex flex-row justify-between items-center px-2 mb-1">
                    <div className="w-3/5 flex flex-row justify-start content-center items-center">
                        <img className="h-6 rounded-full p-3" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                        <div>Humna</div>
                    </div>
                    {
                        [4, 3, 5].map((num) => {
                            return <div key={num} className="bg-white rounded-full h-6 w-6 flex justify-center items-center shadow-lg">{num}</div>
                        })
                    }
                </div>
            ))
        }
    </div>
}

export default ListView
