import React from 'react';
import clsx from 'clsx';
import { convertLearningGradeToGroupName } from 'utils/TIP'

interface P {
    name: string
    learning_levels: RootDBState["students"]["targeted_instruction"]
}

const ClassViewCard: React.FC<P> = ({ name, learning_levels }) => {

    return <div className="h-10 items-center text-xs w-full mt-4 flex flex-row justify-around shadow-lg">
        <div className="w-6/12 flex flex-row justify-between px-3 items-center m-2">
            <div className="font-bold text-center">{name}</div>
        </div>
        <div className="flex flex-row justify-between w-6/12 text-xs m-4">
            {
                Object.entries(learning_levels || {})
                    .sort(([sub,]) => sub.localeCompare(sub))
                    .map(([, grade_obj]) => {
                        const grade = convertLearningGradeToGroupName(grade_obj.grade)
                        return <div key={grade} className="w-2/6 flex justify-center items-center">
                            <div className={clsx("px-2 py-1 rounded-md text-white", {
                                "bg-gray-400": grade === 'Oral',
                                "bg-gray-600": grade === 'Remediation Not Needed'
                            }, `bg-${grade.toLowerCase()}-tip-brand`)}>{grade}</div>
                        </div>
                    })
            }
        </div>
    </div >
}

export default ClassViewCard
