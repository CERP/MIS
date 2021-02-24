import React from 'react'
import clsx from 'clsx';
import { convertLearningGradeToGroupName } from 'utils/TIP'

interface P {
    learning_levels: RootDBState["students"]["targeted_instruction"]

    setCurrentGrade: (grade: TIPGrades) => void
    setSelectSubject: (sub: TIPSubjects) => void
    setShowTIPGroupModal: (showModal: boolean) => void
    setShowStudentInfoModal: (showModal: boolean) => void
    onClose: () => void
}

const StudentInfoModal: React.FC<P> = ({ learning_levels, onClose, setShowTIPGroupModal, setCurrentGrade, setSelectSubject, setShowStudentInfoModal }) => {

    const onEdit = (sub: TIPSubjects, grade: TIPGrades) => {
        setShowTIPGroupModal(true)
        setShowStudentInfoModal(false)
        setCurrentGrade(grade)
        setSelectSubject(sub)
    }
    return (
        <div className="flex flex-col rounded-t-xl padding-3 md:w-6/12 lg:w-4/12 bg-gray-300 bg-white">
            <div className="right-2 top-2 absolute text-danger-tip-brand cursor-pointer" onClick={onClose}>
                X
        </div>
            <div className="text-center rounded-t-lg bg-blue-tip-brand h-16 text-white flex flex-row justify-around items-center text-xl">
                {['Subject', 'Group', 'Action'].map((item) => (<div key={item}>{item}</div>))}
            </div>
            {
                Object.entries(learning_levels || {})
                    .map(([sub, grade_obj]) => {
                        const grade = convertLearningGradeToGroupName(grade_obj.grade)
                        return <div key={grade} className="mb-3 h-20 bg-white flex flex-row justify-around items-center cursor-pointer font-bold text-blue-900 shadow-lg">
                            <div className="w-4/12 text-center">{sub}</div>
                            <div className={clsx("w-4/12 text-center", {
                                "text-gray-400": grade === 'Oral',
                                "text-gray-600": grade === 'Remediation Not Needed'
                            }, `text-${grade.toLowerCase()}-tip-brand`)}>{grade}</div>
                            <div className="w-4/12 text-center" onClick={() => onEdit(sub as TIPSubjects, grade_obj.grade)}>Edit</div>
                        </div>
                    })
            }
        </div >
    )
}

export default StudentInfoModal
