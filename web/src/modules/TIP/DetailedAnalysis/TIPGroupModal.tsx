import React from 'react'
import { convertLearningLevelToGrade } from 'utils/TIP'

interface P {
    subject: TIPSubjects
    grades: TIPLevels[]

    setShowChangeGroupModal: (showModal: boolean) => void
    setShowTIPGroupModal: (showModal: boolean) => void
    setSelectedGrade: (grade: TIPGrades) => void
}

const index_map = [
    'bg-light-blue-tip-brand',
    'bg-yellow-tip-brand',
    'bg-green-tip-brand',
    'bg-orange-tip-brand',
    'bg-red-tip-brand'
]

const grade_map = {
    '1': 'Blue',
    '2': 'Yellow',
    '3': 'Green',
    '4': 'Orange',

    'Level 0': 'Blue',
    'Level 1': 'Yellow',
    'Level 2': 'Green',
    'Level 3': 'Orange',
    'Oral': 'red'
}

const TIPGroupModal: React.FC<P> = ({ subject, grades, setSelectedGrade, setShowTIPGroupModal, setShowChangeGroupModal }) => {

    const onClickGrade = (grade: TIPGrades) => {
        setShowChangeGroupModal(true)
        setShowTIPGroupModal(false)
        setSelectedGrade(grade)
    }
    return (
        <div className="flex flex-col rounded-t-xl padding-3 bg-white">
            <div className="text-center rounded-t-lg bg-blue-tip-brand h-16 text-white flex justify-center items-center text-xl">
                Select new group for {subject}
            </div>
            <div className="flex justify-center items-center">
                <div className="grid grid-cols-2 grid-rows-2 content-center p-3">
                    {
                        grades && grades
                            .sort((a, b) => a.localeCompare(b))
                            .map((grade, index) => {
                                return <div key={grade} >
                                    <div className={`${index_map[index]} sm:w-1/5 md:w-3/5 lg:w-3/5 cursor-pointer container sm:px-8 rounded-lg m-2 h-20 flex items-center justify-center shadow-lg`}
                                        onClick={() => onClickGrade(convertLearningLevelToGrade(grade))}>
                                        <div className="text-white font-bold mb-1">{`${grade_map[grade]} Group`}</div>
                                    </div>
                                </div>
                            })
                    }
                </div>
            </div>
        </div >
    )
}

export default TIPGroupModal
