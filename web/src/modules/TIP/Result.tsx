import React from 'react';
import { RouteComponentProps } from 'react-router-dom'

interface P {
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = () => {

    return <div className="flex flex-wrap content-between">
        <div className="text-blue-900 text-bold text-lg flex justify-center w-full mt-5">Formative Test Result</div>
        <div className="flex justify-center w-full mb-4">
            <div className="bg-blue-900 rounded-2xl flex flex-row justify-center p-2 my-2 shadow-lg w-6/12">
                <div className="text-white text-extrabold text-xs">Two digits Multiplication</div>
            </div>
        </div>
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
                            <div key={num} className="bg-white rounded-full h-6 w-6 flex justify-center items-center shadow-lg">{num}</div>

                        })
                    }
                </div>
            ))
        }
    </div>
}

export default Result
