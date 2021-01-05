import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom'
import { Formative, LessonPlans, Diagnostic } from 'assets/icons'
import Headings from './Headings'
import Card from './Card'
interface P {
}

type PropsType = P & RouteComponentProps

const Home: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <Card {...props} class_name='' />
        <Headings heading="Welcome to TIP" sub_heading="What would you like to do today ?" {...props} />
        <Link className="container sm:px-8 bg-white rounded-lg m-3 h-44 flex flex-col content-center items-center shadow-lg"
            to={'/targeted-instruction/formative-test'}>
            <img className="h-24 py-4 pr-4 w-28" src={Formative} alt="img" />
            <div className="text-blue-900 text-lg text-bold no-underline">Formative Test</div>
        </Link>
        <Link className="container sm:px-8 bg-white rounded-lg m-3 h-28 flex flex-row content-between items-center shadow-lg"
            to={"/targeted-instruction/diagnostic-result"}>
            <img className="h-12 py-4 px-8" src={Diagnostic} alt="img" />
            <div className="text-blue-900 text-lg no-underline">Diagnostic Test Results</div>
        </Link>
        <div className="flex flex-row content-center items-center justify-center w-full">
            <Link className="container sm:px-8 bg-white rounded-lg m-3 h-40 flex flex-col content-center items-center shadow-lg"
                to={"/targeted-instruction/training-videos"}>
                <img className="h-20 py-4" src="https://www.wivb.com/wp-content/uploads/sites/97/2020/04/youtubelogo_38150283_ver1.0.jpg?w=719" alt="img" />
                <div className="text-base text-blue-900 no-underline">Training Videos</div>
            </Link>
            <Link className="container sm:px-8 bg-white rounded-lg m-3 h-40 flex flex-col content-center items-center  shadow-lg"
                to={"/targeted-instruction/lesson-plans"}>
                <img className="h-20 p-4" src={LessonPlans} alt="img" />
                <div className="text-base text-blue-900 no-underline">Lesson Plans</div>
            </Link>
        </div>
    </div>
}

export default Home
