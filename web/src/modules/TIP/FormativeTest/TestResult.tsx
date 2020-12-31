//@ts-nocheck
import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import Headings from '../Headings'
import { RouteComponentProps, Link, withRouter } from 'react-router-dom'

interface P {
    targeted_instruction: RootReducerState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const TestResult: React.FC<PropsType> = (props) => {

    const sloList = useMemo(() => getSloList(props.targeted_instruction), [])

    return <div className="flex flex-wrap content-between">
        <Headings heading="Formative Test Result" subHeading={"Select the SLO you want to see"} {...props} />
        {
            Object.entries(sloList).map(([id, sloObj]) => {
                return <div key={id} className="flex flex-col justify-between m-3 w-11/12">
                    <div className="text-blue-900 text-extrabold text-lg capitalize">{id.split("-")[0]}</div>
                    {
                        sloObj.map((slo) => {
                            return <Link key={slo} className="no-underline bg-blue-900 rounded flex flex-row justify-between p-2 my-2 shadow-lg" to={'/targeted-instruction/formative-test/insert-grades/grading/test-result/result'}>
                                <div className="text-white text-extrabold text-xs ">{slo}</div>
                                <div className="bg-white rounded-full">Arr</div>
                            </Link>
                        })
                    }
                </div>
            })
        }
        <div className="flex justify-center items-center w-full mt-8">
            <button className="rounded-2xl bg-pink-600 border-none text-white text-bold p-2 w-6/12">Overall Analysis</button>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.targeted_instruction
}))(withRouter(TestResult))


const getSloList = (targeted_instruction: RootReducerState["targeted_instruction"]) => {
    return Object.entries(targeted_instruction.tests).reduce((agg, [test_id, test]) => {
        return {
            ...agg,
            [test_id]: Object.values(test.questions).reduce((agg2, test) => {
                if ((agg2.length === 0 || agg2.length > 0) && !agg2.includes(test.slo_category)) {
                    return [
                        ...agg2, test.slo_category
                    ]
                }
                return [...agg2]
            }, [])

        }
    }, {})
}