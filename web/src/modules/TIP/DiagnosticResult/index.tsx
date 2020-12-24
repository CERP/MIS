import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom'
import Classes from '../Classes'
import Card from '../Card'
import Headings from '../Headings';

interface P {
}

type PropsType = P & RouteComponentProps

const DiagnosticTestResult: React.FC<PropsType> = (props) => {
    const [className, setClassName] = useState('');

    return <div className="flex flex-wrap content-between">
        <Card {...props} className={className} />
        <Headings heading="Diagnostic Test Result" subHeading="Select the class you want to evaluate" {...props} />
        <Classes {...props} setClassName={setClassName} />
    </div>
}

export default DiagnosticTestResult
