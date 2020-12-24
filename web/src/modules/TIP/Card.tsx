import React from 'react';
import { RouteComponentProps } from 'react-router-dom'

interface P {
}

type PropsType = P & RouteComponentProps

const Card: React.FC<PropsType> = () => {

    return <div className="container sm:px-8 bg-blue-500 rounded m-3 h-20 mb-6">
        <div className="flex flex-row justify-start">
            <img className="h-12 rounded-full p-4" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
            <div className="flex flex-col justify-center">
                <div className="text-white text-lg font-medium">Miss Humna</div>
                <div className="text-white text-xs font-thin">The Educator School</div>
            </div>
        </div>
    </div>
}

export default Card
