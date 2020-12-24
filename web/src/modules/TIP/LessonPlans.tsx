import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import Headings from './Headings'
import Classes from './Classes'
import Card from './Card'

interface P {
}

type PropsType = P & RouteComponentProps

const LessonPlans: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <Card {...props} />
        <Headings heading="Lesson Plans" subHeading="Select the class" {...props} />
        <Classes {...props} />
    </div>
}

export default LessonPlans
