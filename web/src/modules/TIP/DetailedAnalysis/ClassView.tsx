import React, { useState } from 'react';
import ClassViewCard from './ClassViewCard'
interface P {
    students: RootDBState["students"]
    sorted_sections: AugmentedSection[]
}

const ClassView: React.FC<P> = ({ students, sorted_sections }) => {

    const [section_id, setSectionId] = useState('')

    return <><div className='flex flex-row justify-around w-full'>
        <select className='tw-select' onChange={(e) => setSectionId(e.target.value)}>
            <option value="">Select Class</option>
            {
                sorted_sections.map((class_obj) => {
                    return <option key={class_obj.class_id} value={class_obj.id}>{class_obj.namespaced_name}</option>
                })
            }
        </select>
    </div >
        <div className="h-10 items-center text-white text-xs bg-blue-tip-brand w-full mt-4 flex flex-row justify-around">
            <div className="w-4/12 md:w-6/12 flex flex-row justify-between px-3 items-center m-2">
                <div className="font-bold text-center">Name</div>
            </div>
            <div className="flex flex-row justify-between w-8/12 md:w-6/12 text-xs m-4">
                {
                    ['Urdu', 'Maths', 'Eng']
                        .map((sub) => (
                            <div key={sub} className="font-bold w-2/6 flex justify-center items-center">{sub}</div>
                        ))
                }
            </div>
        </div>
        <div className="flex flex-col">
            {
                Object.values(students || {})
                    .filter(t => t.section_id === section_id)
                    .map((std) => (
                        <ClassViewCard
                            key={std.id}
                            std={std}
                        />
                    ))
            }
        </div>
    </>
}

export default ClassView
