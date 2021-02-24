import React from 'react'
import clsx from 'clsx';
import Headings from '../Headings'
import { convertLearningGradeToGroupName } from 'utils/TIP'

interface P {
    subject: TIPSubjects
    selected_grade: TIPGrades
    current_grade: TIPGrades

    reAssignGrade: () => void
    onClose: () => void
}

const ChangeTIPGroup: React.FC<P> = ({ subject, selected_grade, current_grade, onClose, reAssignGrade }) => {

    const current_group = convertLearningGradeToGroupName(current_grade)
    const new_group = convertLearningGradeToGroupName(selected_grade)
    return (
        <div className="flex flex-col rounded-t-xl padding-3 w-3/12 bg-white">
            <div className="right-2 top-2 absolute text-danger-tip-brand cursor-pointer" onClick={onClose}>
                X
        </div>
            <div className="rounded-t-lg text-center bg-blue-tip-brand h-16 text-white flex justify-center items-center text-xl">
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
