import React from 'react';

interface P {
    setSectionId: (sectionId: string) => any
    sortedSections: AugmentedSection[]
}

const Classes: React.FC<P> = ({ setSectionId, sortedSections }) => {

    return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
        {
            sortedSections.map((classObj, index) => (<div
                key={classObj.id}
                className="flex-wrap container w-2/5 sm:px-8 bg-white rounded-lg m-3 h-36 flex items-center justify-start flex-col shadow-lg"
                id={classObj.id}
                onClick={(e: any) => setSectionId(e.target.id)}>
                <div className={`text-white font-bold shadow-2xl flex items-center justify-center mt-8 mb-5 rounded-full text-xl h-12 w-12 
                ${index === 0 ? "bg-blue-primary" :
                        index === 1 ? "bg-orange-primary" :
                            index === 2 ? "bg-green-primary" :
                                index === 3 ? "bg-blue-900" :
                                    "bg-red-primary"}`}>{(classObj.namespaced_name).substring(6)}
                </div>
                <div className="text-blue-900 text-lg font-thin">Level</div>
            </div>
            ))
        }
    </div >
}

export default Classes