import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import Headings from './Headings'
import Classes from './Classes'
import Card from './Card'

interface P {
}

type PropsType = P & RouteComponentProps

const FormativeTest: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <Card {...props} />
        <Headings heading="Formative Test" subHeading="Select the class you want to evaluate" {...props} />
        <Classes {...props} />
    </div>
}

export default FormativeTest
