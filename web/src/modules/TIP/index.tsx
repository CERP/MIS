import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom'
import { Formative, LessonPlans, Diagnostic, Videos } from 'assets/icons'
import Headings from './Headings'
import Card from './Card'
interface P {
}

type PropsType = P & RouteComponentProps

const Home: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between bg-white">
        <Card {...props} class_name='' />
        <Headings heading="Welcome to TIP" sub_heading="What would you like to do today ?" {...props} />
        <Link className="container sm:px-8 bg-white rounded-2xl m-3 h-44 flex flex-col content-center items-center shadow-lg no-underline"
            to={'/targeted-instruction/formative-test'}>
            <img className="h-24 py-4 pr-4 w-28" src={Formative} alt="img" />
            <div className="text-blue-900 text-lg font-bold">Formative Test</div>
        </Link>
        <Link className="container sm:px-8 bg-white rounded-xl m-3 h-28 flex flex-row justify-around w-full items-center shadow-lg no-underline"
            to={"/targeted-instruction/diagnostic-result"}>
            <img className="h-12 py-4 pl-4" src={Diagnostic} alt="img" />
            <div className="text-blue-900 text-lg font-bold">Diagnostic Test Results</div>
        </Link>
        <div className="flex flex-row content-center items-center justify-center w-full">
            <Link className="container sm:px-8 bg-white rounded-xl m-3 h-40 flex flex-col content-center items-center shadow-lg no-underline"
                to={"/targeted-instruction/training-videos"}>
                <img className="h-12 py-8" src={Videos} alt="img" />
                <div className="text-base text-blue-900 font-bold">Training Videos</div>
            </Link>
            <Link className="container sm:px-8 bg-white rounded-xl m-3 h-40 flex flex-col content-center items-center shadow-lg no-underline"
                to={"/targeted-instruction/lesson-plans"}>
                <img className="h-20 p-4" src={LessonPlans} alt="img" />
                <div className="text-base text-blue-900 font-bold">Lesson Plans</div>
            </Link>
        </div>
    </div>
}

export default Home
