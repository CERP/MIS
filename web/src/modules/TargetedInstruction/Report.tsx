import React, { useState, useMemo, useEffect } from 'react'
import { smsIntentLink } from 'utils/intent'
import moment from 'moment'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DataTable from 'react-data-table-component';
import { isMobile } from 'utils/helpers'
import { customStyles, singleStdColumns, conditionalRowStyles } from 'constants/targetedInstruction'
import { getSingleStdData, redirectToIlmx, getAllStdData, graphData } from 'utils/targetedInstruction'

interface P {
    type: string
    stdId: string
    testId: string
    testType: string
    faculty_id: string
    selectedClass: string
    stdReport: Report
    students: RootDBState["students"]

    setType: (type: string) => any
    logSms: (history: MISSMSHistory) => any
}

const Report: React.FC<P> = ({ students, testType, testId, stdId, type, faculty_id, selectedClass, stdReport, setType, logSms }) => {

    const [toggle, setToggle] = useState(true);
    const [studentId, setStudentId] = useState(stdId);
    const [allStds, columns] = useMemo(() => getAllStdData(stdReport), [stdReport]);
    const data = useMemo(() => graphData(stdReport, students), [stdReport]);
    const singleStd = useMemo(() => getSingleStdData(stdId, stdReport), [studentId, stdReport]);

    useEffect(() => {
        setStudentId(stdId)
    }, [stdId])

    const getStudentId = (e: any) => {
        setType("Single Student")
        setStudentId(e.id)
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

    const reportString = (stdId: string): string => {
        const curr_date = `Date: ${moment().format("DD MMMM YYYY")}\n`
        const section_name = `Class: ${selectedClass}\n`
        const test_type = `Test Type: ${testType}\n`
        const test_name = `Test Name: ${testId}\n`
        if (stdReport) {
            let message = []
            message.push(`${students[stdId].Name} scored`)
            for (let [testName, testObj] of Object.entries(stdReport[stdId].report)) {
                testObj.percentage <= 50 ?
                    message.push(`${testObj.percentage}% marks in ${testName} kindly follow this link ${testObj.link}`) :
                    message.push(`${testObj.percentage}% marks in ${testName}`)
            }
            const raw_report_string = curr_date + section_name + test_type + test_name + message.join(" \n ")
            const report_string = replaceSpecialCharsWithUTFChars(raw_report_string)
            return report_string
        }
    }

    const getMessages = (): MISSms[] => {
        if (type === 'Single Student' && stdId) {
            let phone
            phone = students[stdId].Phone
            const report = reportString(stdId)
            return [{ number: phone, text: report }]
        } else if (type === 'All Students') {
            const messages = Object.values(students)
                .reduce((agg, student) => {
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
        {type === 'Single Student' && stdId ? <div className="section form">
            <DataTable
                columns={singleStdColumns}
                customStyles={customStyles}
                data={singleStd}
                pagination={true}
                noHeader={true}
                highlightOnHover={true}
                responsive={true}
                striped={true}
                onRowClicked={(e) => redirectToIlmx(e.id)}
                conditionalRowStyles={conditionalRowStyles}
            />
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
            type === 'All Students' &&
            <>
                <div className="inner-tabs">
                    <div className="row">
                        <button className={`button ${toggle && "orange"}`} onClick={() => setToggle(!toggle)}>Graph</button>
                        <button className={`button ${!toggle && "blue"}`} onClick={() => setToggle(!toggle)}>Table</button>
                    </div>
                </div>
                {toggle && <div className="graph-div">
                    <BarChart
                        width={isMobile() ? 350 : 700}
                        height={500}
                        data={data}
                        style={{ margin: 'auto' }}
                        onClick={(e) => redirectToIlmx(e.activePayload[0].payload.link)}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="percentage" fill="#82ca9d" />
                    </BarChart>
                </div>}
                {!toggle && <div className="section">
                    <DataTable
                        columns={columns}
                        customStyles={customStyles}
                        data={allStds}
                        pagination={true}
                        noHeader={true}
                        highlightOnHover={true}
                        responsive={true}
                        striped={true}
                        onRowClicked={getStudentId}
                    />
                    <div className="send-btn-div">
                        <a className="button blue mb mobile-mode"
                            href={smsIntentLink({
                                messages,
                                return_link: window.location.href
                            })}
                            onClick={() => logMessages(messages)}>
                            Send Report using Local SIM </a>
                    </div>
                </div>}
            </>
        }
    </>
}

export default Report
