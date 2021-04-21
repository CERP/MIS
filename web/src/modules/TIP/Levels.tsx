import React from 'react';
import clsx from 'clsx';
interface P {
    setSectionId: (sectionId: string) => any
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

// grades could have TIPLevels, TIPGrades
// for formative, grades will be tiplevels
// for diagnostic, grades will be tipgrades
const Levels: React.FC<P> = ({ setSectionId }) => {

    // "grade" is misleading as we only deal with TIPLevels here. we map the level to a 
    // TIPGrade inside the map function below (mapped_grade)
    return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
        {
            ordered_groups && ordered_groups
                .map((ordered_group, index) => {

                    return <div
                        key={ordered_group.group}
                        className={clsx("cursor-pointer flex-wrap container w-2/5 sm:px-8 rounded-lg m-3 h-32 flex items-center justify-center flex-col shadow-lg", {
                            "bg-light-blue-tip-brand": index === 0,
                            "bg-yellow-tip-brand": index === 1,
                            "bg-green-tip-brand": index === 2,
                            "bg-orange-tip-brand": index === 3
                        })}
                        onClick={() => setSectionId(ordered_group.group)}>
                        <div className="text-white text-xs font-bold mb-1">{`${ordered_group.color} Group`}</div>
                        <div className="text-xs text-white font-thin">{`Remedial ${ordered_group.group}`}</div>
                    </div>
                })
        }
    </div >
}

export default Levels