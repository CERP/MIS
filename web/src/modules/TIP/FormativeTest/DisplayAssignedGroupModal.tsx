import React from 'react';
import clsx from 'clsx'

interface P {
    group: TIPLearningGroups

    redirect: () => void
}

const DisplayAssignedGroupModal: React.FC<P> = ({ group, redirect }) => {

    return <>
        <div className={clsx("text-center p-3 rounded-md text-white text-lg font-bold", {
            "bg-gray-400": group === 'Oral',
            "bg-gray-600": group === 'Remediation Not Needed'
        }, `bg-${group.toLowerCase()}-tip-brand`)}>
            {group} Group
            </div>
        <div className="w-full flex justify-center items-center mt-6">
            <button className="w-6/12 p-3 border-none bg-green-tip-brand text-white rounded-lg outline-none" onClick={redirect}>OK</button>
        </div>
    </>
}

export default DisplayAssignedGroupModal

