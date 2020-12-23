import React from 'react';
import { RouteComponentProps } from 'react-router-dom'

interface P {
}

type PropsType = P & RouteComponentProps

const Subjects: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <div className="container sm:px-8 bg-blue-500 rounded m-3 h-20 mb-6">
            <div className="flex flex-row justify-start">
                <img className="h-12 rounded-full p-4" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                <div className="flex flex-col justify-center">
                    <div className="text-white text-base font-medium">Miss Humna</div>
                    <div className="text-white text-xs font-thin">The Educator School</div>
                </div>
                <div className="text-white text-extrabold flex items-center justify-center m-5 bg-blue-300 rounded-full h-10 w-10">1</div>
            </div>
        </div>
        <div className="w-full">
            <div className="text-blue-900 text-lg font-medium text-center">Formative Test</div>
            <div className="text-blue-900 text-sm font-thin text-center">Select the subject you want to evaluate</div>
        </div>
        <div className="flex flex-row justify-around w-full mx-4">
            <div className="container w-full sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg">
                <div className="text-blue-400 text-bold flex items-center justify-center m-5 text-3xl h-10 w-full">+ - x /</div>
                <div className="text-blue-900 tracking-wider">Math</div>
            </div>
        </div>
        <div className="flex flex-row justify-around w-full mx-4">
            <div className="container w-full sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg">
                <div className="text-blue-400 text-bold flex items-center justify-center m-5 text-3xl h-10 w-full">ا ب پ</div>
                <div className="text-blue-900 tracking-wider">Urdu</div>
            </div>
        </div>
        <div className="flex flex-row justify-around w-full mx-4">
            <div className="container w-full sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg">
                <div className="text-blue-400 text-bold flex items-center justify-center m-5 text-3xl h-10 w-full tracking-wide">A B C</div>
                <div className="text-blue-900 tracking-wider">English</div>
            </div>
        </div>
    </div>
}

export default Subjects
