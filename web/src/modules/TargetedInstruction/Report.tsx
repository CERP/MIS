//@ts-nocheck
import React from 'react'
import { logSms } from 'actions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { smsIntentLink } from 'utils/intent'
import moment from 'moment'
import { isMobile } from 'utils/helpers'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface P {
    type: any
    data: any
    stdId: any
    testId: any
    testType: any
    allStudents: any
    client_id: string
    faculty_id: string
    selectedClass: string
    auth: RootReducerState["auth"]
    students: RootDBState["students"]

    setReport: () => any
    sendMessage: (text: string, number: string) => any
    logSms: (history: MISSMSHistory) => any
}

const Report: React.FC<P> = ({ students, testType, testId, stdId, allStudents, type, faculty_id, selectedClass, data, setReport, logSms }) => {

    let test, allStds;
    if (stdId) {

        test = students && students[stdId] && students[stdId].report[testType][testId && testId]
        if (type === "All Students") {
            allStds = Object.values(students)
                .reduce((agg, std) => {
                    let stdObj = {}
                    const report = std.report && std.report[testType] && std.report[testType][testId]
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
        setReport("Single Student")
        test = students && students[e.target.id].report[testType][testId && testId]
    }

    const handleRedirectToIlmx = (redirectLink) => {
        window.location.href = redirectLink
    }

    const logMessages = (messages: MISSms[]) => {
        if (messages.length === 0) {
            console.log("No Messaged to Log")
            return
        }

        const historyObj = {
            faculty: faculty_id,
            date: new Date().getTime(),
            type: "REPORT",
            count: messages.length,
        }

        logSms(historyObj)
    }

    const reportString = (stdId): string => {
        const curr_date = `Date: ${moment().format("DD MMMM YYYY")}\n`
        const section_name = `Class: ${selectedClass}\n`
        const test_type = `Test Type: ${testType}\n`
        const test_name = `Test Name: ${testId}\n`
        const stdReport = students[stdId].report && students[stdId].report[testType] && students[stdId].report[testType][testId]
        if (stdReport) {
            const stdName = students[stdId].Name
            let message = []
            message.push(`${stdName} scored`)
            for (let [testName, testObj] of Object.entries(stdReport)) {
                if (testObj.percentage <= 50) {
                    message.push(`${testObj.percentage}% marks in ${testName} kindly follow this link ${testObj.link}`)
                } else {
                    message.push(`${testObj.percentage}% marks in ${testName}`)
                }
            }
            const raw_report_string = curr_date + section_name + test_type + test_name + message.join(" \n ")
            const report_string = replaceSpecialCharsWithUTFChars(raw_report_string)
            return report_string
        }
    }

    const getMessages = (): MISSms[] => {
        // in case of single student
        if (type === 'Single Student') {
            let phone
            if (stdId) {
                phone = students[stdId].Phone
            }
            const report = reportString(stdId)

            return [{ number: phone, text: report }]
        } else if (type === 'All Students') {

            const messages = allStudents
                .reduce((agg, student) => {
                    const index = agg.findIndex(s => s.number === student.Phone)

                    if (index >= 0) {
                        return agg
                    }
                    return [
                        ...agg,
                        {
                            number: student.Phone,
                            text: reportString(student.id)
                        }
                    ]
                }, [])
            return messages
        }
    }

    let messages = getMessages()

    return <>
        {
            type === 'Single Student' ? <div className="section form">
                <table className="report-table">
                    <tbody>
                        <tr>
                            <th className="table-header" style={{ textAlign: "left" }}>SLO</th>
                            <th className="table-header" >POSSIBLE</th>
                            <th className="table-header" >CORRECT</th>
                            <th className="table-header" >PERCENTAGE</th>
                        </tr>
                        {Object.keys(test && test).map(function (key) {
                            return <tr key={key}>
                                <td className="slo" id={test[key].link} onClick={() => handleRedirectToIlmx(test[key].link)}>{key}</td>
                                <td className="table-data">{test[key].possible}</td>
                                <td className="table-data">{test[key].correct}</td>
                                <td className="table-data">{`${test[key].percentage}%`}</td>
                            </tr>

                        })}
                    </tbody>
                </table>
                <div className="send-btn-div">
                    <a className="button blue mb mobile-mode"
                        href={smsIntentLink({
                            messages,
                            return_link: window.location.href
                        })}
                        onClick={() => logMessages(messages)}>
                        Send Report using Local SIM </a>
                </div>
            </div> :
                type === 'All Students' ?
                    <>
                        <div className="graph-div">
                            <BarChart
                                width={isMobile() ? 350 : 700}
                                height={500}
                                data={data && data}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="percentage" fill="#82ca9d" />
                            </BarChart>
                        </div>
                        <div className="section">
                            <table className="report-table">
                                <tbody>
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
                                            {allStds && allStds.map((std, index) => {
                                                return <tr key={index}> {Object.keys(std).map(function (key) {
                                                    if (key === 'Student') {
                                                        return <td className="std-name" id={std[key].id} onClick={getStudentId}>{std[key].name}</td>
                                                    } else {
                                                        return <td className="table-data">{`${std[key]}%`}</td>
                                                    }
                                                })}</tr>
                                            })}
                                        </>

                                    })}
                                </tbody>
                            </table>
                            <div className="send-btn-div">
                                <a className="button blue mb mobile-mode"
                                    href={smsIntentLink({
                                        messages,
                                        return_link: window.location.href
                                    })}
                                    onClick={() => logMessages(messages)}>
                                    Send Report using Local SIM </a>
                            </div>
                        </div>
                    </> :
                    null
        }
    </>
}

export default connect((state: RootReducerState) => ({
    auth: state.auth,
    client_id: state.client_id,
    students: state.db.students,
    faculty_id: state.auth.faculty_id,
}), (dispatch: Function) => ({
    sendMessage: (text: string, number: string) => dispatch(sendSMS(text, number)),
    logSms: (history: MISSMSHistory) => dispatch(logSms(history)),
}))(withRouter(Report))

