import React from 'react'
import clsx from 'clsx'
import { grade_map } from 'constants/TIP'
import { convertLearningLevelToGrade } from 'utils/TIP'

interface P {
    subject: TIPSubjects
    grades: TIPLevels[]

    setModalType: (modal_type: string) => void
    setSelectedGrade: (grade: TIPGrades) => void
}

const TIPGroupModal: React.FC<P> = ({ subject, grades, setSelectedGrade, setModalType }) => {

    const onClickGrade = (grade: TIPGrades) => {
        setModalType('change_group')
        setSelectedGrade(grade)
    }
    return (
        <div className="flex flex-col rounded-t-xl padding-3 bg-white">
            <div className="text-center rounded-t-lg bg-blue-tip-brand h-12 md:h-16 lg:h-16 text-white flex flex-row justify-around items-center text-sm md:text-lg lg:text-lg">
                Select new group for {subject}
            </div>
            <div className="flex justify-center items-center p-2">
                <div className="grid grid-cols-2 grid-rows-2 gap-6 md:gap-6 lg:gap-10 content-center py-3">
                    {
                        grades && grades
                            .sort((a, b) => a.localeCompare(b))
                            .map((grade, index) => {
                                return <div key={grade}>
                                    <div
                                        className={clsx("py-3 px-1 md:py-5 md:px-1 lg:py-6 lg:px-2 text-sm md:text-base cursor-pointer container rounded-lg flex items-center justify-center shadow-lg", {
                                            "bg-light-blue-tip-brand": index === 0,
                                            "bg-yellow-tip-brand": index === 1,
                                            "bg-green-tip-brand": index === 2,
                                            "bg-orange-tip-brand": index === 3
                                        })}
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
