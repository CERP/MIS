import React from 'react'
import clsx from 'clsx';
import Headings from '../Headings'
import { convertLearningGradeToGroupName } from 'utils/TIP'

interface P {
    subject: TIPSubjects
    selected_grade: TIPGrades
    current_grade: TIPGrades

    reAssignGrade: () => void
}

const ChangeTIPGroup: React.FC<P> = ({ subject, selected_grade, current_grade, reAssignGrade }) => {

    const current_group = convertLearningGradeToGroupName(current_grade)
    const new_group = convertLearningGradeToGroupName(selected_grade)
    return (
        <div className="flex flex-col rounded-t-xl padding-3 bg-white">
            <div className="text-center rounded-t-lg bg-blue-tip-brand h-12 md:h-16 text-white flex flex-row justify-around items-center text-sm md:text-lg">
                Change Group for {subject}
            </div>
            <div className="p-2">
                <Headings heading='' sub_heading={`Are you sure you want to change ${subject} sorting from 
            ${current_group} to ${new_group}`} />
                <div className="flex flex-row justify-around items-center mt-5">
                    <div className={clsx("text-center p-3 rounded-md text-white text-lg", {
                        "bg-gray-400": current_group === 'Oral',
                        "bg-gray-600": current_group === 'Remediation Not Needed'
                    }, `bg-${current_group.toLowerCase()}-tip-brand`)}>{current_group === 'Remediation Not Needed' ? current_group : `${current_group} Group`}</div>
                To
                    <div className={clsx("text-center p-3 rounded-md text-white text-lg", {
                        "bg-gray-400": current_group === 'Oral',
                        "bg-gray-600": current_group === 'Remediation Not Needed'
                    }, `bg-${new_group.toLowerCase()}-tip-brand`)}>{new_group} Group</div>
                </div>
                <div className="flex justify-center items-center mt-5">
                    <button className="text-blue-900 font-bold text-lg border-none bg-white shadow-lg py-2 px-5 rounded-lg outline-none"
                        onClick={reAssignGrade}>Confirm</button>
                </div>
            </div>
        </div >
    )
}

export default ChangeTIPGroup
