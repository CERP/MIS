import React, { useMemo, useState } from 'react';

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
            <div className="w-6/12 flex flex-row justify-between px-3 items-center m-2">
                <div className="font-bold text-center">Name</div>
            </div>
            <div className="flex flex-row justify-between w-6/12 text-xs m-4">
                {
                    ['Maths', 'Urdu', 'Eng'].map((sub) => (
                        <div key={sub} className="font-bold">{sub}</div>
                    ))
                }
            </div>
        </div>
        <div className="flex flex-col">
            {/* {Object.values(filtered_students || {}).map((std) => {
                const class_name = getClassnameFromSectionId(sorted_sections, std.section_id)
                return <DetailedCard key={std.id} name={std.Name} roll_no={std.RollNumber} class_name={class_name} />
            })} */}
        </div>
    </>
}

export default ClassView
