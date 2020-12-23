import React from 'react';
import { RouteComponentProps } from 'react-router-dom'

interface P {
}

type PropsType = P & RouteComponentProps

const Grading: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <div className="container sm:px-8 bg-yellow-400 rounded m-3 h-20 mb-6">
            <div className="flex flex-row justify-start">
                <img className="h-12 rounded-full p-4" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                <div className="flex flex-col justify-center">
                    <div className="text-white text-md font-medium">Miss Humna</div>
                    <div className="flex flex-row justify-between mt-2">
                        <div className="text-white text-xs font-thin">Grade : 2</div>
                        <div className="text-white text-xs font-thin">Math</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-between w-full mx-4">
            {
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
                    <div key={row} className="flex flex-row justify-between mt-3">
                        <div className="text-current text-xs">what is the color of sky ?</div>
                        <div className="rounded-lg w-30">
                            <button className="border-none rounded-lg text-xs">Incorrect</button>
                            <button className="border-none rounded-lg text-xs text-white bg-green-500">Correct</button>
                        </div>
                    </div>
                ))
            }
        </div>
        <div className="w-full mt-5 flex justify-center">
            <button className="bg-blue-900 text-bold text-lg border-none rounded-md text-white p-2 w-9/12">Save and Continue</button>
        </div>
    </div>
}

export default (Grading)
