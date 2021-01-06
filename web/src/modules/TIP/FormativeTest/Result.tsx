import React from 'react';
import { RouteComponentProps } from 'react-router-dom'

interface P {
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = () => {

    return <div className="flex flex-wrap content-between">
        <div className="text-blue-900 text-2xl flex justify-center w-full mt-5">Formative Test Result</div>
        <div className="flex justify-center w-full mb-4">
            <div className="bg-blue-900 rounded-3xl flex flex-row justify-center items-center my-2 h-9 shadow-lg w-9/12">
                <div className="text-white text-base">Two digits Multiplication</div>
            </div>
        </div>
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

export default Result
