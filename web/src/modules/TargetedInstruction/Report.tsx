import * as React from 'react';

interface P {
    testId: any
    testType: any
    stdObj: any
}
const Report: React.FC<P> = (props: any) => {

    const test = props.stdObj.report && props.stdObj.report[props.testType]
    const testName = test[props.testId && props.testId]

    return <div className="section">
        <div className="table">
            <div className="row ">
                <div className="table-header" style={{ textAlign: "left" }}>SLO</div>
                <div className="table-header" >POSSIBLE</div>
                <div className="table-header" >CORRECT</div>
                <div className="table-header" >PERCENTAGE</div>
            </div>
            {Object.keys(testName).map(function (key) {
                debugger
                return <div key={key} className="row">
                    <div className="table-data" style={{ textAlign: "left" }}>{key}</div>
                    <div className="table-data">{testName[key].possible}</div>
                    <div className="table-data">{testName[key].correct}</div>
                    <div className="table-data">{`${testName[key].percentage}%`}</div>
                </div>
            })}
        </div>
    </div >
}

export default Report
