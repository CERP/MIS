import React from 'react';
import { ArrowBack } from 'assets/icons'

interface P {
}

const SingleStdResultCard: React.FC<P> = (props) => {

    return <div className="bg-blue-200 text-blue-900 rounded-md flex flex-row justify-between items-center px-3 my-2 h-11 shadow-lg w-full">
        <div className="flex flex-row justify-between items-center w-full">
            <div className="w-3/5 flex flex-row justify-start content-center items-center">
                <img className="h-6 rounded-full p-3" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                <div>Humna</div>
            </div>
            <div className="bg-white rounded-full h-7 w-7 flex justify-center items-center">
                <img className="h-3" src={ArrowBack} />
            </div>
        </div>
    </div>
}

export default SingleStdResultCard
