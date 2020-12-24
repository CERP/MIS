import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'

interface P {
}

type PropsType = P & RouteComponentProps

const subjects = [{ logo: "+ - x /", subject: "Math" }, { logo: "ا ب پ", subject: "Urdu" }, { logo: "A B C", subject: "English" }]
const Subjects: React.FC<PropsType> = (props) => {

    const pathname = props.location.pathname
    const previousComponent = (props.location.pathname).substring(22)
    console.log(previousComponent === 'diagnostic-result')
    console.log(`${pathname}/remedial-group`)
    return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
        {subjects.map((subjectObj) => (
            <div key={subjectObj.subject} className="container w-full sm:px-8 bg-white rounded-lg m-3 h-28 flex items-center justify-start flex-col shadow-lg"
                onClick={() => props.history.push(previousComponent === 'diagnostic-result' ? `${pathname}/remedial-group` : `${pathname}/pdf`)}>
                <div className="text-blue-400 text-bold flex items-center justify-center m-5 text-3xl h-10 w-full">{subjectObj.logo}</div>
                <div className="text-blue-900 tracking-wider">{subjectObj.subject}</div>
            </div>
        ))}
    </div>
}

export default withRouter(Subjects)
