import React from 'react';
import { RouteComponentProps } from 'react-router-dom'

interface P {
    heading: string
    subHeading: string
}

type PropsType = P & RouteComponentProps

const Headings: React.FC<PropsType> = ({ heading, subHeading }) => {

    return <div className="w-full">
        <div className="text-blue-900 text-lg font-medium text-center">{heading}</div>
        <div className="text-blue-900 text-sm font-thin text-center">{subHeading}</div>
    </div>
}

export default Headings
