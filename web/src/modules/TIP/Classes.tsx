import React from 'react';

interface P {
    setSectionId: (sectionId: string) => any
    sortedSections: AugmentedSection[]
}

const Classes: React.FC<P> = ({ setSectionId, sortedSections }) => {

    return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
        {
            sortedSections.map((classObj) => {
                return <div
                    key={classObj.id}
                    className="flex-wrap container w-2/5 sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg"
                    id={classObj.id}
                    onClick={(e: any) => setSectionId(e.target.id)}>
                    <div className={`text-white text-bold flex items-center justify-center m-5 rounded-full h-10 w-10 bg-blue-900`}>{(classObj.namespaced_name).substring(6)}</div>
                    <div className="text-blue-900">Class</div>
                </div>
            })
        }
    </div >
}

export default Classes