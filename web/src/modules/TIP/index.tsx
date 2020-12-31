import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom'
import Headings from './Headings'
import Card from './Card'
interface P {
}

type PropsType = P & RouteComponentProps

const Home: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <Card {...props} class_name='' />
        <Headings heading="Welcome to TIP" sub_heading="What would you like to do today ?" {...props} />
        <Link className="container sm:px-8 bg-white rounded-lg m-3 h-36 flex flex-col content-between shadow-lg"
            to={'/targeted-instruction/formative-test'}>
            <img className="h-16 p-4" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-MSLSWNhZG0txBrXzA-TJzwfjuebYd8pkvA&usqp=CAU" alt="img" />
            <div className="text-center text-blue-900 text-bold">Formative Test</div>
        </Link>
        <Link className="container sm:px-8 bg-white rounded-lg m-3 h-20 flex flex-row content-between shadow-lg"
            to={"/targeted-instruction/diagnostic-result"}>
            <img className="h-16 p-2" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
            <div className="text-center text-blue-900 text-bold items-center py-8">Diagnostic Test Results</div>
        </Link>
        <div className="flex flex-row content-between w-full">
            <Link className="container w-1/2 sm:px-8 bg-white rounded-lg m-3 h-36 flex flex-col content-between shadow-lg"
                to={"/targeted-instruction/training-videos"}>
                <img className="h-20 py-3" src="https://www.wivb.com/wp-content/uploads/sites/97/2020/04/youtubelogo_38150283_ver1.0.jpg?w=719" alt="img" />
                <div className="text-center text-blue-900 text-bold items-center">Training Videos</div>
            </Link>
            <Link className="container w-1/2 sm:px-8 bg-white rounded-lg m-3 h-36 flex flex-col content-between shadow-lg"
                to={"/targeted-instruction/lesson-plans"}>
                <img className="h-20 p-3" src="https://openbookphilly.com/wp-content/uploads/2016/11/bookstack.png" alt="img" />
                <div className="text-center text-blue-900 text-bold items-center">Lesson Plans</div>
            </Link>
        </div>
    </div>
}

export default Home
