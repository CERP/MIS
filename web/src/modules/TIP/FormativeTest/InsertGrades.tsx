import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom'

interface P {
}

type PropsType = P & RouteComponentProps

const InsertGrades: React.FC<PropsType> = () => {

    return <div className="flex flex-wrap content-between">
        <div className="container sm:px-8 bg-yellow-400 rounded m-3 h-20 mb-6">
            <div className="flex flex-col justify-center items-center content-center h-full">
                <div className="text-white text-lg font-medium">Class 2</div>
                <div className="text-white text-xs font-thin">Maths</div>
            </div>
        </div>
        {
            [1, 2, 3].map((row) => (<div key={row} className="m-3 flex flex-wrap flex-row justify-between w-full h-20">
                {
                    ["Humna", "Taimur", "Ali", "Mudasir"].map((name) => (
                        <Link key={name} className="h-10 flex flex-col content-between" to={'/targeted-instruction/formative-test/insert-grades/grading'}>
                            <img className="rounded-full h-14 p-2" src="https://www.atmeplay.com/images/users/avtar/avtar_nouser.png" alt="img" />
                            <div className="text-xs flex content-center items-center justify-center">{name}</div>
                        </Link>
                    ))
                }
            </div>))
        }
    </div>
}

export default (InsertGrades)
