import React, { useState } from 'react';
import Headings from '../Headings';
import Card from '../Card';
import GroupView from './GroupView'

interface P {

}

const DetailedAnalysis: React.FC<P> = () => {
    const [view_type, setViewType] = useState('')

    return <div className="bg-white h-full">
        <Card class_name='' subject='' lesson_name='' lesson_no='' />
        {
            view_type === '' && <div className="py-10">
                <Headings heading="" sub_heading='Do you want to see Class view or Group view' />
            </div>
        }
        <div className="flex flex-row justify-around px-3">
            <button className={`border-none shadow-lg rounded-md p-5 outline-none ${view_type === 'class_view' ? 'bg-green-tip-brand text-white' : 'bg-white text-blue-900'}`}
                onClick={() => setViewType('class_view')}>Class View</button>
            <button className={`border-none shadow-lg rounded-md p-5 outline-none ${view_type === 'group_view' ? 'bg-green-tip-brand text-white' : 'bg-white text-blue-900'}`}
                onClick={() => setViewType('group_view')}>Group View</button>
        </div>
        {
            view_type === 'class_view' && <div className="py-10">
                <Headings heading="" sub_heading='Select your Class' />
            </div>
        }
        {
            view_type === 'group_view' && <div className="py-10">
                <Headings heading="" sub_heading='Select your Goryp and Subject' />
            </div>
        }
        {
            view_type === 'group_view' && <GroupView />
        }
    </div>
}

export default DetailedAnalysis
