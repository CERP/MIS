import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom'
import Headings from '../Headings'
import Classes from '../Classes'
import Card from '../Card'

interface P {
}

type PropsType = P & RouteComponentProps

const LessonPlans: React.FC<PropsType> = (props) => {
    const [className, setClassName] = useState('');

    return <div className="flex flex-wrap content-between">
        <Card {...props} className={className} />
        <Headings heading="Lesson Plans" subHeading="Select the class" {...props} />
        <Classes {...props} setClassName={setClassName} />
    </div>
}

export default LessonPlans
