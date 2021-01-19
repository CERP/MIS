import React from 'react';
import { connect } from 'react-redux';

interface P {
    class_name: string
    teacher_name: string
    school_name: string
}

const Card: React.FC<P> = ({ class_name, teacher_name, school_name }) => {

    return <div className="container sm:px-8 bg-green-primary rounded-md m-3 h-20 mb-6">
        <div className="flex flex-row justify-start">
            <img className="w-12 h-12 rounded-full p-4" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col justify-center">
                    <div className="text-white text-lg">{teacher_name}</div>
                    <div className="text-white text-base">{school_name}</div>
                </div>
                {class_name && <div className={`text-white font-bold flex items-center justify-center m-5 rounded-full h-10 w-10 shadow-lg 
                ${class_name === '1' ? "bg-blue-primary" :
                        class_name === '2' ? "bg-orange-primary" :
                            class_name === '3' ? "bg-green-primary" :
                                "bg-yellow-600"}`}>{class_name}
                </div>}
            </div>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    teacher_name: state.auth.name,
    school_name: state.auth.school_id,
}))(Card)