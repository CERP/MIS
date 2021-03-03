import React from 'react'
import clsx from 'clsx'
import { convertLearningLevelToGrade } from 'utils/TIP'

interface P {
    subject: TIPSubjects

    setModalType: (modal_type: string) => void
    setSelectedGrade: (grade: TIPGrades) => void
}

type OrderedGroupItem = {
    group: TIPLevels
    color: TIPLearningGroups
}

const ordered_groups: Array<OrderedGroupItem> = [
    { group: "Level KG", color: "Blue" },
    { group: "Level 1", color: "Yellow" },
    { group: "Level 2", color: "Green" },
    { group: "Level 3", color: "Orange" }
]

const TIPGroupModal: React.FC<P> = ({ subject, setSelectedGrade, setModalType }) => {

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
                        ordered_groups && ordered_groups
                            .map((ordered_group, index) => {
                                return <div key={ordered_group.group}>
                                    <div
                                        className={clsx("py-3 px-1 md:py-5 md:px-1 lg:py-6 lg:px-2 text-sm md:text-base cursor-pointer container rounded-lg flex items-center justify-center shadow-lg", {
                                            "bg-light-blue-tip-brand": index === 0,
                                            "bg-yellow-tip-brand": index === 1,
                                            "bg-green-tip-brand": index === 2,
                                            "bg-orange-tip-brand": index === 3
                                        })}
                                        onClick={() => onClickGrade(convertLearningLevelToGrade(ordered_group.group))}>
                                        <div className="text-white font-bold mb-1">{`${ordered_group.color} Group`}</div>
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
