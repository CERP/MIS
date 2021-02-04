import React from 'react';

interface P {
    color: string
    level: string
    students: RootDBState["students"]
}

const Groups: React.FC<P> = ({ students, color, level }) => {

    return <div className="flex flex-wrap flex-col justify-between w-full">
        <div className={`flex flex-row justify-between h-7 items-center text-white px-3 bg-${color.toLowerCase()}-primary`}>
            <div className="capitalize">{color} Group</div>
            <div>Remedial Level {level}</div>
        </div>
        {<div className="flex flex-wrap w-full justify-start">
            {Object.values(students)
                .sort((a, b) => a.Name.localeCompare(b.Name))
                .map((std) => (<div key={std.id} className="relative no-underline h-24 flex flex-col flex items-center justify-center">
                    <img className="border border-solid border-green-primary rounded-full h-14 w-14" src="https://www.atmeplay.com/images/users/avtar/avtar_nouser.png" alt="img" />
                    <div className="text-xs flex items-center justify-center w-24 md:w-28 truncate">{std.Name}</div>
                </div>))}
        </div>}
    </div>
}

export default Groups
