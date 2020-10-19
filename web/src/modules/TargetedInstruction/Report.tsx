import React from 'react'
import { smsIntentLink } from 'utils/intent'
import moment from 'moment'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DataTable from 'react-data-table-component';
import { isMobile } from 'utils/helpers'
import { customStyles, singleStdColumns } from 'constants/targetedInstruction'
import { getSingleStdData } from 'utils/targetedInstruction'

interface P {
    type: string
    data: object[]
    stdId: string
    testId: string
    testType: string
    students: RootDBState["students"]
    faculty_id: string
    selectedClass: string
    stdReport: Report
    allStudents: RootDBState["students"]

    setReport: (type: string) => any
    logSms: (history: MISSMSHistory) => any
}

type columns = {
    name: string
    selector: string
    sortable: boolean
}

const Report: React.FC<P> = ({ students, testType, testId, stdId, allStudents, type, faculty_id, selectedClass, data, stdReport, setReport, logSms }) => {

    let allStds, singleStd, columns: columns[] = [];

    const getAllStdData = () => {
        allStds = Object.entries(stdReport)
            .reduce((agg, [id, reportObj]) => {
                let stdObj = {}
                stdObj = {
                    ...stdObj,
                    "student": reportObj.name,
                    "id": id
                }
                !columns.find(col => col.name === 'student name') &&
                    columns.push({
                        "name": "student name",
                        "selector": "student",
                        "sortable": true
                    })
                for (let [slo, sloObj] of Object.entries(reportObj.report)) {
                    stdObj = {
                        ...stdObj,
                        [slo]: sloObj.percentage
                    }
                    !columns.find(col => col.name === slo) && columns.push({
                        "name": slo,
                        "selector": slo,
                        "sortable": true
                    })
                }
                return [...agg,
                    stdObj]
            }, [])
    }

    type === "Single Student" ? singleStd = getSingleStdData(stdId, stdReport) : type === "All Students" && getAllStdData()

    const getStudentId = (e: any) => {
        setReport("Single Student")
        singleStd = getSingleStdData(e.id, stdReport)
    }

    const redirectToIlmx = (e: any) => {
        window.location.href = e.link
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
            const stdName = allStudents[stdId].Name
            let message = []
            message.push(`${stdName} scored`)
            for (let [testName, testObj] of Object.entries(stdReport[stdId].report)) {
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

        if (type === 'Single Student') {
            let phone
            phone = allStudents[stdId].Phone
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
        {type === 'Single Student' ? <div className="section form">
            <DataTable
                columns={singleStdColumns}
                customStyles={customStyles}
                data={singleStd && singleStd}
                pagination={true}
                noHeader={true}
                highlightOnHover={true}
                responsive={true}
                onRowClicked={redirectToIlmx}
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
            <><div className="graph-div">
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
                    <DataTable
                        columns={columns}
                        customStyles={customStyles}
                        data={allStds && allStds}
                        pagination={true}
                        noHeader={true}
                        highlightOnHover={true}
                        responsive={true}
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
                </div></>
        }
    </>
}

export default Report
