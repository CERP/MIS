import React from 'react';
import { index_map, grade_map } from 'constants/TIP'
interface P {
    setSectionId: (sectionId: string) => any
    grades: TIPLevels[]
}

// grades could have TIPLevels, TIPGrades
// for formative, grades will be tiplevels
// for diagnostic, grades will be tipgrades
const Levels: React.FC<P> = ({ setSectionId, grades }) => {

    // "grade" is misleading as we only deal with TIPLevels here. we map the level to a 
    // TIPGrade inside the map function below (mapped_grade)
    return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
        {
            grades && grades
                .sort((a, b) => a.localeCompare(b))
                .map((grade, index) => {
                    console.log(grade)

                    return <div
                        key={grade}
                        className={`${index_map[index]} cursor-pointer flex-wrap container w-2/5 sm:px-8 rounded-lg m-3 h-32 flex items-center justify-center flex-col shadow-lg`}
                        onClick={() => setSectionId(grade)}>
                        <div className="text-white text-xs font-bold mb-1">{`${grade_map[grade]} Group`}</div>
                        <div className="text-xs text-white font-thin">{`Remedial ${grade}`}</div>
                    </div>
                })
        }
    </div >
}

export default Levels