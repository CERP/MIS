import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { logSms, addReport } from 'actions'

interface P {
}

type PropsType = P & RouteComponentProps

const Classes: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <div className="container sm:px-8 bg-blue-500 rounded m-3 h-20 mb-6">
            <div className="flex flex-row justify-start">
                <img className="h-12 rounded-full p-4" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                <div className="flex flex-col justify-center">
                    <div className="text-white text-lg font-medium">Miss Humna</div>
                    <div className="text-white text-xs font-thin">The Educator School</div>
                </div>
            </div>
        </div>
        <div className="w-full">
            <div className="text-blue-900 text-lg font-medium text-center">Formative Test</div>
            <div className="text-blue-900 text-sm font-thin text-center">Select the class you want to evaluate</div>
        </div>
        <div className="flex flex-row justify-around w-full mx-4">
            <div className="container w-6/12 sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg">
                <div className="text-white text-bold flex items-center justify-center m-5 bg-blue-300 rounded-full h-10 w-10">1</div>
                <div className="text-blue-900">Class</div>
            </div>
            <div className="container w-6/12 sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg">
                <div className="text-white text-bold flex items-center justify-center m-5 bg-yellow-500 rounded-full h-10 w-10">2</div>
                <div className="text-blue-900">Class</div>
            </div>
        </div>
        <div className="flex flex-row justify-around w-full mx-4">
            <div className="container w-6/12 sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg">
                <div className="text-white text-bold flex items-center justify-center m-5 bg-gray-400 rounded-full h-10 w-10">3</div>
                <div className="text-blue-900">Class</div>
            </div>
            <div className="container w-6/12 sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg">
                <div className="text-white text-bold flex items-center justify-center m-5 bg-blue-900 rounded-full h-10 w-10">4</div>
                <div className="text-blue-900">Class</div>
            </div>
        </div>
        <div className="flex flex-row justify-center w-full mx-4">
            <div className="container w-5/12 sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg">
                <div className="text-white text-bold flex items-center justify-center m-5 bg-pink-500 rounded-full h-10 w-10">5</div>
                <div className="text-blue-900">Class</div>
            </div>
        </div>
    </div>
}

export default Classes
