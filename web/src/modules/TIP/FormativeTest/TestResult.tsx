import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import Headings from '../Headings'
import { ArrowBack } from 'assets/icons'
import { RouteComponentProps, Link, withRouter } from 'react-router-dom'
import { getSloList } from 'utils/TIP'

interface P {
    targeted_instruction: RootReducerState["targeted_instruction"]
}
interface SLOList {
    [test_id: string]: string[]
}

type PropsType = P & RouteComponentProps

const TestResult: React.FC<PropsType> = (props) => {

    const sloList: SLOList = useMemo(() => getSloList(props.targeted_instruction), [])
    const { class_name, subject, std_id, section_id } = props.match.params as Params

    return <div className="flex flex-wrap content-between">
        <Headings heading="Formative Test Result" sub_heading={"Select the SLO you want to see"} />
        {
            Object.entries(sloList).map(([id, sloObj]) => {
                return <div key={id} className="flex flex-col justify-between m-3 w-11/12">
                    <div className="text-blue-900 text-extrabold text-2xl capitalize font-bold">{id.split("-")[0]}</div>
                    {
                        sloObj.map((slo) => {
                            return <Link key={slo}
                                className="no-underline bg-blue-250 rounded-md flex flex-row justify-between items-center px-3 my-2 h-11 shadow-lg"
                                to={`${(props.location.pathname).substring(0, 36)}/${section_id}/${class_name}/${subject}/insert-grades/${std_id}/grading/test-result/result`}>
                                <div className="text-white text-extrabold text-base font-bold">{slo}</div>
                                <div className="bg-white rounded-full h-7 w-7 flex justify-center items-center">
                                    <img className="h-3" src={ArrowBack} />
                                </div>
                            </Link>
                        })
                    }
                </div>
            })
        }
        <div className="flex justify-center items-center w-full mt-8">
            <button className="rounded-3xl bg-red-primary h-9 border-none text-white text-base p-2 w-8/12 mb-4 outline-none">Overall Analysis</button>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.targeted_instruction
}))(withRouter(TestResult))