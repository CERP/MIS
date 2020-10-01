//@ts-nocheck
import React from 'react';
import { connect } from 'react-redux'

interface P {
    testId: any
    testType: any
    stdObj: any
    stdId: any
    type: any
    allStudents: any
    students: RootDBState["students"]
}

const Report: React.FC<P> = (props: any) => {

    let test = props.students && props.students[props.stdId].report[props.testType][props.testId && props.testId]
    const allStds = Object.values(props.students)
        .reduce((agg, std) => {
            let stdObj = {}
            const report = std.report && std.report[props.testType][props.testId]
            if (report) {
                stdObj = {
                    ...stdObj,
                    "Student": {
                        "id": std.id,
                        "name": std.Name
                    }
                }
                for (let [slo, sloObj] of Object.entries(report)) {
                    stdObj = {
                        ...stdObj,
                        [slo]: sloObj.percentage
                    }
                }

            }
            return [...agg,
                stdObj]
        }, [])

    const getStudentId = (e: any) => {
        props.setReport("Single Student")
        test = props.students && props.students[e.target.id].report[props.testType][props.testId && props.testId]
    }

    return <>
        {
            props.type === 'Single Student' ? <div className="section">
                <div className="table">
                    <div className="row ">
                        <div className="slo">SLO</div>
                        <div className="table-header" >POSSIBLE</div>
                        <div className="table-header" >CORRECT</div>
                        <div className="table-header" >PERCENTAGE</div>
                    </div>
                    <div>{Object.keys(test && test).map(function (key) {
                        return <div key={key} className="row">
                            <div className="table-data" style={{ textAlign: "left" }}>{key}</div>
                            <div className="table-data">{test[key].possible}</div>
                            <div className="table-data">{test[key].correct}</div>
                            <div className="table-data">{`${test[key].percentage}%`}</div>
                        </div>
                    })}</div>
                </div>
            </div> :
                props.type === 'All Students' ?
                    <div className="section">
                        <div className="table">
                            <div className="row ">
                                {allStds && allStds.slice(0, 1).map((std) => {
                                    return <> {Object.keys(std).map(function (key) {
                                        if (key === 'Student') {
                                            return <div className="table-header" style={{ textAlign: "left" }} key={std}>{key}</div>
                                        } else {
                                            return <div className="table-header" key={std}>{key}</div>
                                        }
                                    })}</>
                                })}
                            </div>
                            {allStds && allStds.map((std) => {
                                return <div className="row" key={std}> {Object.keys(std).map(function (key) {
                                    if (key === 'Student') {
                                        return <div className="std-name" key={std} id={std[key].id} onClick={getStudentId}>{std[key].name}</div>
                                    } else {
                                        return <div className="table-data" key={std}>{`${std[key]}%`}</div>
                                    }
                                })}</div>
                            })}
                        </div>
                    </div> :
                    null
        }
    </>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students
}))(Report)
