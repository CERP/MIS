//@ts-nocheck
import React, { useEffect, useState } from 'react'
import Modal from 'components/Modal'
import IlmxRedirectModal from 'components/Ilmx/redirectModal'
import { showScroll, hideScroll } from 'utils/helpers'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

interface P {
    testId: any
    testType: any
    stdObj: any
    stdId: any
    type: any
    allStudents: any
    students: RootDBState["students"]
    auth: RootReducerState["auth"]
    client_id: string
}

const Report: React.FC<P> = (props: any) => {

    const [phone, setPhone] = useState('')
    const [toggleModal, setToggleModal] = useState(false)

    useEffect(() => {
        const phone = localStorage.getItem("ilmx")
        setPhone(phone)
    }, [])

    let test, allStds;
    if (props.stdId) {
        test = props.students && props.students[props.stdId].report[props.testType][props.testId && props.testId]
        if (props.type === "All Students") {
            allStds = Object.values(props.students)
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
        }
    }

    const getStudentId = (e: any) => {
        props.setReport("Single Student")
        test = props.students && props.students[e.target.id].report[props.testType][props.testId && props.testId]
    }

    const handleRedirectToIlmx = (input_phone?: string) => {

        const link = `http://localhost:3001/auto-login?type=SCHOOL&id=${props.auth.school_id}&key=${props.auth.token}&cid=${props.client_id}&phone=${phone || input_phone}`

        if (input_phone) {
            localStorage.setItem("ilmx", input_phone)
            window.location.href = link
            return
        }

        if (phone) {
            window.location.href = link
        } else {
            setToggleModal(!toggleModal)
            hideScroll()
        }
    }

    const handleToggleModal = () => {
        setToggleModal(!toggleModal)
        showScroll()
    }

    return <>
        {
            toggleModal && <Modal>
                <IlmxRedirectModal
                    redirectToIlmx={handleRedirectToIlmx}
                    onClose={handleToggleModal}
                />
            </Modal>
        }
        {
            props.type === 'Single Student' ? <div className="section">
                <table className="report-table">
                    <tr>
                        <th className="table-header" style={{ textAlign: "left" }}>SLO</th>
                        <th className="table-header" >POSSIBLE</th>
                        <th className="table-header" >CORRECT</th>
                        <th className="table-header" >PERCENTAGE</th>
                    </tr>
                    {Object.keys(test && test).map(function (key) {
                        return <tr key={key}>
                            <td className="slo" onClick={handleRedirectToIlmx}>{key}</td>
                            <td className="table-data">{test[key].possible}</td>
                            <td className="table-data">{test[key].correct}</td>
                            <td className="table-data">{`${test[key].percentage}%`}</td>
                        </tr>

                    })}
                </table>
            </div> :
                props.type === 'All Students' ?
                    <div className="section">
                        <table className="report-table">
                            <tr>
                                {allStds && allStds.slice(0, 1).map((std) => {
                                    return <> {Object.keys(std).map(function (key) {
                                        if (key === 'Student') {
                                            return <th className="table-header" style={{ textAlign: "left" }} key={std}>{key}</th>
                                        } else {
                                            return <th className="table-header" key={std}>{key}</th>
                                        }
                                    })}</>
                                })}
                            </tr>
                            {Object.keys(test && test).map(function () {
                                return <>
                                    {allStds && allStds.map((std) => {
                                        return <tr key={std}> {Object.keys(std).map(function (key) {
                                            if (key === 'Student') {
                                                return <td className="std-name" key={std} id={std[key].id} onClick={getStudentId}>{std[key].name}</td>
                                            } else {
                                                return <td className="table-data" key={std}>{`${std[key]}%`}</td>
                                            }
                                        })}</tr>
                                    })}
                                </>

                            })}
                        </table>
                    </div> :
                    null
        }
    </>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    auth: state.auth,
    client_id: state.client_id,
}))(withRouter(Report))
