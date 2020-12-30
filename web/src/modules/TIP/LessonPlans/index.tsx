import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom'
import Headings from '../Headings'
import Classes from '../Classes'
import Card from '../Card'
import Subjects from '../Subjects'

interface P {
}

type PropsType = P & RouteComponentProps

const LessonPlans: React.FC<PropsType> = (props) => {
    const [className, setClassName] = useState('');
    const [sectionId, setSectionId] = useState('');

    return <div className="flex flex-wrap content-between">
        <Card {...props} className={className} />
        <Headings heading="Lesson Plans" subHeading={className ? "Select the subject you want to evaluate" : "Select the class you want to evaluate"} {...props} />
        {/* {
            className ? <Subjects {...props} className={className} sectionId={sectionId} /> : <Classes {...props} setClassName={setClassName} setSectionId={setSectionId} />
        } */}
    </div>
}

export default LessonPlans
