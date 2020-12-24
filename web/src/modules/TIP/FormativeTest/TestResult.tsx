import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom'

interface P {
}

type PropsType = P & RouteComponentProps

const TestResult: React.FC<PropsType> = () => {

    return <div className="flex flex-wrap content-between">
        <div className="text-blue-900 text-bold text-lg flex justify-center w-full mt-5">Formative Test Result</div>
        <div className="text-blue-900 text-bold text-xs flex justify-center w-full">Select the SLO you want to see</div>
        {
            ["Math", "English", "Urdu"].map((row) => (
                <div key={row} className="flex flex-col justify-between m-3 w-11/12">
                    <div className="text-blue-900 text-extrabold text-lg">{row}</div>
                    <Link className="bg-blue-900 rounded flex flex-row justify-between p-2 my-2 shadow-lg" to={'/targeted-instruction/formative-test/insert-grades/grading/test-result/result'}>
                        <div className="text-white text-extrabold text-xs ">Two digits Multiplication</div>
                        <div className="bg-white rounded-full">Arr</div>
                    </Link>
                    <div className="bg-blue-900 rounded flex flex-row justify-between p-2 my-2 shadow-lg">
                        <div className="text-white text-extrabold text-xs">Two digits Addition</div>
                        <div className="bg-white rounded-full">Arr</div>
                    </div>
                </div>
            ))
        }
        <div className="flex justify-center items-center w-full mt-8">
            <button className="rounded-2xl bg-pink-600 border-none text-white text-bold p-2 w-6/12">Overall Analysis</button>
        </div>
    </div>
}

export default TestResult
